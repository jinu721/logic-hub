import { Server } from "socket.io";
import {
  ExtendedSocket,
  MessageData,
  PollVoteData,
  TypingData,
} from "@shared/types";
import redisClient from "../../config/redis.config";
import { PublicUserDTO } from "@modules/user/dtos";
import { Container } from "@di";
import { PublicMessageDTO } from "@modules/chat";

export class MessageHandler {
  constructor(private io: Server, private container: Container) { }

  public setupMessageHandlers(socket: ExtendedSocket): void {
    socket.on("send_message", this.handleSendMessage.bind(this, socket));
    socket.on("delete_message", this.handleDeleteMessage.bind(this, socket));
    socket.on("edit_message", this.handleEditMessage.bind(this, socket));
    socket.on("react_message", this.handleReactMessage.bind(this, socket));
    socket.on("typing", this.handleTyping.bind(this, socket));
    socket.on("stopTyping", this.handleStopTyping.bind(this, socket));
    socket.on(
      "mark-all-conv-as-read",
      this.handleMarkAllConvAsRead.bind(this, socket)
    );
  }

  private async handleSendMessage(
    socket: ExtendedSocket,
    { data, accessToken }: { data: MessageData; accessToken: string }
  ): Promise<void> {
    try {
      const msg: PublicMessageDTO = await this.container.messageCommandSvc.createMessage(
        data,
        accessToken
      );
      await this.container.conversationCommandSvc.updateLastMessage(
        msg.conversationId,
        msg._id
      );


      this.io.to(data.conversationId).emit("receive_message", {
        conversationId: data.conversationId,
        message: msg,
      });

      const conversation = await this.container.conversationQuerySvc.getConversationById(
        msg.conversationId.toString()
      );

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      // Identify other participants (excluding sender) to increment unread count
      const participantIds = conversation.participants.map((p) =>
        p.userId.toString()
      );
      const otherUserIds = participantIds.filter(
        (id) => id !== msg.sender?.userId
      );

      // Increment Unread Counts for others
      const updatedConv =
        await this.container.conversationCommandSvc.addUnreadCounts(
          msg.conversationId.toString(),
          otherUserIds
        );

      if (!updatedConv) {
        throw new Error("Conversation not found");
      }

      // Emit conversation_updated to ALL participants (including sender)
      // calculated individually if needed, but here updatedConv has all counts.
      // We must map the Map to a plain object if it isn't one already.
      const unreadCountsObj = updatedConv.unreadCounts instanceof Map
        ? Object.fromEntries(updatedConv.unreadCounts)
        : updatedConv.unreadCounts || {};

      // Emit conversation_updated to the ROOM first (ensures list sort updates for everyone)
      // This sends the latest message, but NOT user-specific unread counts (or sends empty/generic)
      this.io.to(data.conversationId).emit("conversation_updated", {
        conversationId: msg.conversationId.toString(),
        lastMessage: msg,
        // We cannot send specific unread counts to the room effectively without exposing data
        // So we send it merely to trigger the sort/preview update
      });


      updatedConv.participants.forEach(async (user: PublicUserDTO) => {
        // Correct Redis Key: sockets:{userId} (Set)
        const socketIds = await redisClient.sMembers(`sockets:${user.userId}`);

        if (socketIds && socketIds.length > 0) {
          const unreadForUser = updatedConv.unreadCounts instanceof Map
            ? Object.fromEntries(updatedConv.unreadCounts)
            : updatedConv.unreadCounts || {};

          for (const socketId of socketIds) {
            this.io.to(socketId).emit("conversation_updated", {
              conversationId: msg.conversationId.toString(),
              lastMessage: msg, // or msg
              unreadCounts: unreadForUser,
            });
          }
        }
      });
    } catch (err) {
      console.log(`Error in Socket setup : ${err}`);
      socket.emit("send_error", {
        message: err instanceof Error ? err.message : "Error to Send Message",
      });
    }
  }

  private async handleMarkAllConvAsRead(
    socket: ExtendedSocket,
    { conversationId, userId }: { conversationId: string; userId: string }
  ): Promise<void> {
    try {
      // 1. Mark messages as seen
      await this.container.messageEngagementSvc.markMessagesAsSeen(
        conversationId,
        userId
      );

      // 2. Reset unread count for user in conversation
      const updatedConv = await this.container.conversationCommandSvc.markAsRead(
        conversationId,
        userId
      );

      if (!updatedConv) {
        throw new Error("Conversation not found");
      }

      // 3. Emit message_seen to the room (so others see 'seen' status)
      const user = await this.container.userQuerySvc.findUserById(userId);
      if (user) {
        this.io.to(conversationId).emit("message_seen", {
          conversationId,
          seenBy: user,
        });
      }

      // 4. Emit conversation_updated to the USER ONLY (to clear their badge)
      // 4. Emit conversation_updated to the USER ONLY (to clear their badge)
      const socketIds = await redisClient.sMembers(`sockets:${userId}`);

      if (socketIds && socketIds.length > 0) {
        const unreadCountsObj = updatedConv.unreadCounts instanceof Map
          ? Object.fromEntries(updatedConv.unreadCounts)
          : updatedConv.unreadCounts || {};

        for (const socketId of socketIds) {
          this.io.to(socketId).emit("conversation_updated", {
            conversationId: conversationId,
            lastMessage: updatedConv.latestMessage,
            unreadCounts: unreadCountsObj,
          });
        }
      }

    } catch (err) {
      console.log(`Error in mark_all_conv_as_read: ${err}`);
      socket.emit("send_error", {
        message: err instanceof Error ? err.message : "Error to Mark as Read",
      });
    }
  }

  private async handleDeleteMessage(
    socket: ExtendedSocket,
    { messageId }: { messageId: string }
  ): Promise<void> {
    try {
      const deleted = await this.container.messageCommandSvc.deleteMessage(
        messageId
      );

      console.log("Message Deleted", deleted);

      if (!deleted) {
        throw new Error("Message not found");
      }
      this.io.to(deleted.conversationId.toString()).emit("message_deleted", {
        messageId: deleted._id,
      });
    } catch (err) {
      console.log(`Error in delete_message: ${err}`);
      socket.emit("send_error", {
        message: err instanceof Error ? err.message : "Error to Delete Message",
      });
    }
  }

  private async handleEditMessage(
    socket: ExtendedSocket,
    { messageId, newContent }: { messageId: string; newContent: string }
  ): Promise<void> {
    try {
      const updated = await this.container.messageCommandSvc.editMessage(
        messageId,
        newContent
      );
      if (!updated) {
        throw new Error("Message not found");
      }
      this.io
        .to(updated.conversationId.toString())
        .emit("message_edited", updated);
    } catch (err) {
      console.log(`Error in edit_message: ${err}`);
      socket.emit("send_error", {
        message: err instanceof Error ? err.message : "Error to Edit Message",
      });
    }
  }

  // private async handleReactMessage(
  //   socket: ExtendedSocket,
  //   {
  //     messageId,
  //     userId,
  //     emoji,
  //   }: { messageId: string; userId: string; emoji: string }
  // ): Promise<void> {
  //   try {
  //     const updated = await this.container.messageService.addReaction(
  //       messageId,
  //       userId,
  //       emoji
  //     );
  //     if (!updated) {
  //       throw new Error("Message not found");
  //     }
  //     this.io
  //       .to(updated.conversationId.toString())
  //       .emit("reaction_updated", updated);
  //   } catch (err) {
  //     console.log("Error in react_message:", err);
  //     socket.emit("send_error", {
  //       message: err instanceof Error ? err.message : "Failed to react",
  //     });
  //   }
  // }


  private async handleReactMessage(
    socket: ExtendedSocket,
    {
      messageId,
      userId,
      emoji,
    }: { messageId: string; userId: string; emoji: string }
  ): Promise<void> {
    try {
      const updated = await this.container.messageEngagementSvc.toggleReaction(
        messageId,
        userId,
        emoji
      );

      if (!updated) {
        throw new Error("Message not found");
      }

      this.io.to(updated.conversationId.toString()).emit("reaction_updated", updated);
    } catch (err) {
      console.log("Error in react_message:", err);
      socket.emit("send_error", {
        message: err instanceof Error ? err.message : "Failed to react",
      });
    }
  }


  private async handleTyping(
    socket: ExtendedSocket,
    { conversationId, userId }: TypingData
  ): Promise<void> {
    try {

      console.log("CONVERSATION ID", conversationId);
      console.log("USER ID", userId);
      const conversation = await this.container.conversationTypingSvc.setTypingUser(
        conversationId,
        userId
      );
      console.log("CONVERSATION::", conversation);
      this.io.to(conversationId).emit("typing_users", {
        conversationId,
        typingUsers: conversation?.typingUsers,
      });

    } catch (err) {
      console.log(`Error in Socket setup : ${err}`);
      socket.emit("send_error", {
        message: err instanceof Error ? err.message : "Error to Send Message",
      });
    }
  }

  private async handleStopTyping(
    socket: ExtendedSocket,
    { conversationId, userId }: TypingData
  ): Promise<void> {
    try {
      const conversation =
        await this.container.conversationTypingSvc.removeTypingUser(
          conversationId,
          userId
        );
      this.io.to(conversationId).emit("typing_users", {
        conversationId,
        typingUsers: conversation?.typingUsers,
      });

    } catch (err) {
      console.log(`Error in Socket setup : ${err}`);
      socket.emit("send_error", {
        message: err instanceof Error ? err.message : "Error to Send Message",
      });
    }
  }
}
