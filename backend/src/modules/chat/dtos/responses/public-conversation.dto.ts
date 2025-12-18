import { PublicUserDTO } from "@modules/user/dtos";
import { Types } from "mongoose";
import { PublicMessageDTO } from "./public-message.dto";

export interface PublicConversationDTO {
  _id: string;
  type: 'group' | 'one-to-one';
  participants: PublicUserDTO[];
  latestMessage?: PublicMessageDTO | null;
  isDeleted?: boolean;
  typingUsers: PublicUserDTO[];
  unreadCounts: Record<string, number> ;
  createdAt: Date;
  updatedAt: Date;
}
