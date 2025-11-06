import { ConversationIF } from "../shared/types/conversation.types";
import { PublicUserDTO } from "./user.dto";

export interface PublicConversationDTO {
  _id: string;
  type: 'group' | 'one-to-one';
  participants: PublicUserDTO[];
  latestMessage?: any;
  isDeleted?: boolean;
  typingUsers: PublicUserDTO[];
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export const toPublicConversationDTO = (conversation: ConversationIF,publicTypingUsers?: PublicUserDTO[]): PublicConversationDTO => {
  return {
    _id: conversation._id ? conversation._id.toString() : "",
    type: conversation.type as 'group' | 'one-to-one',
    participants: conversation.participants as any,
    latestMessage: conversation.latestMessage,
    isDeleted: conversation.isDeleted,
    typingUsers: publicTypingUsers ?? (conversation.typingUsers as any),
    unreadCounts: conversation.unreadCounts,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
};

export const toPublicConversationDTOs = (conversations: ConversationIF[]): PublicConversationDTO[] => {
  return conversations.map(toPublicConversationDTO as any);
};
