import { PopulatedConversation } from "@shared/types";
import { PublicConversationDTO } from "@modules/chat/dtos";
import { toPublicUserDTO } from "@modules/user/dtos";
import { toPublicMessageDTO } from "./message.mapper";

export const toPublicConversationDTO = (conversation: PopulatedConversation): PublicConversationDTO => {
  // Helper to check if an object is populated (has fields other than _id)
  const isPopulatedMatches = (doc: any) => doc && typeof doc === 'object' && 'sender' in doc;
  const isPopulatedUser = (doc: any) => doc && typeof doc === 'object' && 'username' in doc;

  return {
    _id: conversation._id.toString(),
    type: conversation.type as 'group' | 'one-to-one',
    // Only map participants if they are populated objects
    participants: conversation.participants && conversation.participants.every(isPopulatedUser)
      ? conversation.participants.map(toPublicUserDTO)
      : [],
    // Only map latestMessage if it is populated (has sender)
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
