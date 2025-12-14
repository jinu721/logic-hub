import { PopulatedMessage } from "@shared/types";
import { toPublicUserDTO } from "@modules/user/dtos";
import { PublicMessageDTO } from "@modules/chat/dtos";


export const toPublicMessageDTO = (message: PopulatedMessage): PublicMessageDTO => {
  const SYSTEM_USER_ID = "000000000000000000000000";

  const isSystemSender = message.sender._id.toString() === SYSTEM_USER_ID;
  const isSystemMessage = message.type === "system" || isSystemSender;

  return {
    _id: message._id.toString(),
    conversationId: message.conversationId.toString(),
    sender: isSystemMessage
      ? {
        _id: SYSTEM_USER_ID,
        username: "System",
        avatar: null,
        banner: null,
        bio: undefined,
      }
      : toPublicUserDTO(message.sender),
    content: message.content,
    type: message.type,
    mentionedUsers: message.mentionedUsers?.map(user => user._id.toString()) || [],
    seenBy: message.seenBy?.map(user => user._id.toString()),
    media: message.media,
    reactions: message.reactions?.map(r => ({
      emoji: r.emoji,
      userId: r.userId._id.toString(),
    })) || [],
    replyTo: message.replyTo?._id.toString(),
    isEdited: message.isEdited,
    isDeleted: message.isDeleted,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};


export const toPublicMessageDTOs = (messages: PopulatedMessage[]): PublicMessageDTO[] => {
  return messages.map(toPublicMessageDTO);
};
