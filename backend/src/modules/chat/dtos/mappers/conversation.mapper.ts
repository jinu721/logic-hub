import { PopulatedConversation } from "@shared/types";
import { PublicConversationDTO } from "@modules/chat/dtos";
import { toPublicUserDTO } from "@modules/user/dtos";
import { toPublicMessageDTO } from "./message.mapper";

export const toPublicConversationDTO = (conversation: PopulatedConversation): PublicConversationDTO => {
  const isPopulatedMatches = (doc) => doc && typeof doc === 'object' && 'sender' in doc;
  const isPopulatedUser = (doc) => doc && typeof doc === 'object' && 'username' in doc;

  return {
    _id: conversation._id.toString(),
    type: conversation.type as 'group' | 'one-to-one',
    participants: conversation.participants && conversation.participants.every(isPopulatedUser)
      ? conversation.participants.map(toPublicUserDTO)
      : [],
    latestMessage: conversation.latestMessage && isPopulatedMatches(conversation.latestMessage)
      ? toPublicMessageDTO(conversation.latestMessage)
      : null,
    isDeleted: conversation.isDeleted,
    typingUsers: conversation.typingUsers && conversation.typingUsers.length ? conversation.typingUsers.map(toPublicUserDTO) : [],
    unreadCounts: conversation.unreadCounts instanceof Map
      ? Object.fromEntries(conversation.unreadCounts)
      : conversation.unreadCounts || {},
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
};

export const toPublicConversationDTOs = (conversations: PopulatedConversation[]): PublicConversationDTO[] => {
  return conversations.map(toPublicConversationDTO);
};
