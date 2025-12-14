import { PopulatedConversation } from "@shared/types";
import { PublicConversationDTO } from "@modules/chat/dtos";
import { toPublicUserDTO } from "@modules/user/dtos";
import { toPublicMessageDTO } from "./message.mapper";

export const toPublicConversationDTO = (conversation: PopulatedConversation): PublicConversationDTO => {
  return {
    _id: conversation._id.toString(),
    type: conversation.type as 'group' | 'one-to-one',
    participants: conversation.participants.map(toPublicUserDTO),
    latestMessage: conversation.latestMessage ? toPublicMessageDTO(conversation.latestMessage) : null,
    isDeleted: conversation.isDeleted,
    typingUsers: conversation.typingUsers.map(toPublicUserDTO),
    unreadCounts: conversation.unreadCounts,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
};

export const toPublicConversationDTOs = (conversations: PopulatedConversation[]): PublicConversationDTO[] => {
  return conversations.map(toPublicConversationDTO);
};
