"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const redis_config_1 = __importDefault(require("../../config/redis.config"));
class MessageHandler {
    constructor(io, container) {
        this.io = io;
        this.container = container;
    }
    setupMessageHandlers(socket) {
        socket.on("send_message", this.handleSendMessage.bind(this, socket));
        socket.on("delete_message", this.handleDeleteMessage.bind(this, socket));
        socket.on("edit_message", this.handleEditMessage.bind(this, socket));
        socket.on("react_message", this.handleReactMessage.bind(this, socket));
        socket.on("typing", this.handleTyping.bind(this, socket));
        socket.on("stopTyping", this.handleStopTyping.bind(this, socket));
        socket.on("mark-all-conv-as-read", this.handleMarkAllConvAsRead.bind(this, socket));
    }
    handleSendMessage(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { data, accessToken }) {
            try {
                const msg = yield this.container.messageCommandSvc.createMessage(data, accessToken);
                yield this.container.conversationCommandSvc.updateLastMessage(msg.conversationId, msg._id);
                this.io.to(data.conversationId).emit("receive_message", {
                    conversationId: data.conversationId,
                    message: msg,
                });
                const conversation = yield this.container.conversationQuerySvc.getConversationById(msg.conversationId.toString());
                if (!conversation) {
                    throw new Error("Conversation not found");
                }
                // Identify other participants (excluding sender) to increment unread count
                const participantIds = conversation.participants.map((p) => p.userId.toString());
                const otherUserIds = participantIds.filter((id) => { var _a; return id !== (msg.sender && 'userId' in msg.sender ? msg.sender.userId : (_a = msg.sender) === null || _a === void 0 ? void 0 : _a._id); });
                // Increment Unread Counts for others
                const updatedConv = yield this.container.conversationCommandSvc.addUnreadCounts(msg.conversationId.toString(), otherUserIds);
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
                updatedConv.participants.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                    // Correct Redis Key: sockets:{userId} (Set)
                    const socketIds = yield redis_config_1.default.sMembers(`sockets:${user.userId}`);
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
                }));
            }
            catch (err) {
                console.log(`Error in Socket setup : ${err}`);
                socket.emit("send_error", {
                    message: err instanceof Error ? err.message : "Error to Send Message",
                });
            }
        });
    }
    handleMarkAllConvAsRead(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { conversationId, userId }) {
            try {
                // 1. Mark messages as seen
                yield this.container.messageEngagementSvc.markMessagesAsSeen(conversationId, userId);
                // 2. Reset unread count for user in conversation
                const updatedConv = yield this.container.conversationCommandSvc.markAsRead(conversationId, userId);
                if (!updatedConv) {
                    throw new Error("Conversation not found");
                }
                // 3. Emit message_seen to the room (so others see 'seen' status)
                const user = yield this.container.userQuerySvc.findUserById(userId);
                if (user) {
                    this.io.to(conversationId).emit("message_seen", {
                        conversationId,
                        seenBy: user,
                    });
                }
                // 4. Emit conversation_updated to the USER ONLY (to clear their badge)
                // 4. Emit conversation_updated to the USER ONLY (to clear their badge)
                const socketIds = yield redis_config_1.default.sMembers(`sockets:${userId}`);
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
            }
            catch (err) {
                console.log(`Error in mark_all_conv_as_read: ${err}`);
                socket.emit("send_error", {
                    message: err instanceof Error ? err.message : "Error to Mark as Read",
                });
            }
        });
    }
    handleDeleteMessage(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { messageId }) {
            try {
                const deleted = yield this.container.messageCommandSvc.deleteMessage(messageId);
                console.log("Message Deleted", deleted);
                if (!deleted) {
                    throw new Error("Message not found");
                }
                this.io.to(deleted.conversationId.toString()).emit("message_deleted", {
                    messageId: deleted._id,
                });
            }
            catch (err) {
                console.log(`Error in delete_message: ${err}`);
                socket.emit("send_error", {
                    message: err instanceof Error ? err.message : "Error to Delete Message",
                });
            }
        });
    }
    handleEditMessage(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { messageId, newContent }) {
            try {
                const updated = yield this.container.messageCommandSvc.editMessage(messageId, newContent);
                if (!updated) {
                    throw new Error("Message not found");
                }
                this.io
                    .to(updated.conversationId.toString())
                    .emit("message_edited", updated);
            }
            catch (err) {
                console.log(`Error in edit_message: ${err}`);
                socket.emit("send_error", {
                    message: err instanceof Error ? err.message : "Error to Edit Message",
                });
            }
        });
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
    handleReactMessage(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { messageId, userId, emoji, }) {
            try {
                const updated = yield this.container.messageEngagementSvc.toggleReaction(messageId, userId, emoji);
                if (!updated) {
                    throw new Error("Message not found");
                }
                this.io.to(updated.conversationId.toString()).emit("reaction_updated", updated);
            }
            catch (err) {
                console.log("Error in react_message:", err);
                socket.emit("send_error", {
                    message: err instanceof Error ? err.message : "Failed to react",
                });
            }
        });
    }
    handleTyping(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { conversationId, userId }) {
            try {
                console.log("CONVERSATION ID", conversationId);
                console.log("USER ID", userId);
                const conversation = yield this.container.conversationTypingSvc.setTypingUser(conversationId, userId);
                console.log("CONVERSATION::", conversation);
                this.io.to(conversationId).emit("typing_users", {
                    conversationId,
                    typingUsers: conversation === null || conversation === void 0 ? void 0 : conversation.typingUsers,
                });
            }
            catch (err) {
                console.log(`Error in Socket setup : ${err}`);
                socket.emit("send_error", {
                    message: err instanceof Error ? err.message : "Error to Send Message",
                });
            }
        });
    }
    handleStopTyping(socket_1, _a) {
        return __awaiter(this, arguments, void 0, function* (socket, { conversationId, userId }) {
            try {
                const conversation = yield this.container.conversationTypingSvc.removeTypingUser(conversationId, userId);
                this.io.to(conversationId).emit("typing_users", {
                    conversationId,
                    typingUsers: conversation === null || conversation === void 0 ? void 0 : conversation.typingUsers,
                });
            }
            catch (err) {
                console.log(`Error in Socket setup : ${err}`);
                socket.emit("send_error", {
                    message: err instanceof Error ? err.message : "Error to Send Message",
                });
            }
        });
    }
}
exports.MessageHandler = MessageHandler;
