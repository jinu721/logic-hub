import { PopulatedMessage } from "@shared/types";
import { toPublicUserDTO } from "@modules/user/dtos";
import { PublicMessageDTO } from "@modules/chat/dtos";


export const toPublicMessageDTO = (message: PopulatedMessage): PublicMessageDTO => {
  const SYSTEM_USER_ID = "000000000000000000000000";

  const senderId = message.sender?._id?.toString() || message.sender?.toString();
  const isSystemSender = senderId === SYSTEM_USER_ID;
  const isSystemMessage = message.type === "system" || isSystemSender;

  const getSafeId = (user) => (user?._id ? user._id.toString() : user?.toString());

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
      : (message.sender && typeof message.sender === 'object' && 'username' in message.sender
        ? toPublicUserDTO(message.sender)
        : { _id: senderId, username: "Unknown", email: "", avatar: null, bio: "" }), 
    content: message.content,
    type: message.type,
    mentionedUsers: message.mentionedUsers?.map(getSafeId) || [],
    seenBy: message.seenBy?.map(u =>
      typeof u === 'object' && 'username' in u
        ? toPublicUserDTO(u)
        : getSafeId(u)
    ) || [],
    media: message.media,
    reactions: message.reactions?.map(r => ({
      emoji: r.emoji,
      userId: getSafeId(r.userId),
    })) || [],
    replyTo: message.replyTo && typeof message.replyTo === 'object' && '_id' in message.replyTo
      ? toPublicMessageDTO(message.replyTo as PopulatedMessage)
      : null,
    isEdited: message.isEdited,
    isDeleted: message.isDeleted,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
};


export const toPublicMessageDTOs = (messages: PopulatedMessage[]): PublicMessageDTO[] => {
  return messages.map(toPublicMessageDTO);
};
