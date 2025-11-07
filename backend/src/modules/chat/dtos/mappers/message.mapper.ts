import { MessageIF } from "@shared/types";
import { toPublicUserDTO } from "@modules/user/dtos";
import { PublicMessageDTO } from "@modules/chat/dtos";


export const toPublicMessageDTO = (message: MessageIF): PublicMessageDTO => {
  const SYSTEM_USER_ID = "000000000000000000000000";

  const isSystemMessage = message.type === "system" || message.sender?.toString() === SYSTEM_USER_ID;

  return {
    _id: message._id ? message._id.toString() : '',
    conversationId: message.conversationId as any,
    sender: isSystemMessage
      ? {
          _id: SYSTEM_USER_ID,
          username: "System",
          avatar: null,
        }
      : toPublicUserDTO(message.sender as any),
    content: message.content,
    type: message.type,
    mentionedUsers: message.mentionedUsers?.map(id => id.toString()) || [],
    seenBy: message.seenBy ,
    media: message.media,
    reactions: message.reactions?.map(r => ({
      emoji: r.emoji,
      userId: r.userId.toString(),
    })) || [],
    replyTo: message.replyTo as any,
    isEdited: message.isEdited,
    isDeleted: message.isDeleted,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};


export const toPublicMessageDTOs = (messages: MessageIF[]): PublicMessageDTO[] => {
  return messages.map(toPublicMessageDTO);
};
