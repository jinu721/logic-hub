import { GroupIF } from "./group.types";
import { MessageIF } from "./message.types";
import { UserIF } from "./user.types";

export interface ConversationIF extends Document {
  _id: string;
  type: string;
  participants: UserIF[];
  group?: GroupIF;
  typingUsers: string[];  
  otherUser?: UserIF & {isBlocked: boolean};    
  seenBy: string[];            
  currentUserId:string;
  latestMessage?: MessageIF;
  unreadCounts: Map<string, number>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}