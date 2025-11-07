import { PublicUserDTO } from "@modules/user/dtos";

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
