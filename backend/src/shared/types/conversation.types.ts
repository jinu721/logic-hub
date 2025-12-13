import { Types} from "mongoose";

export interface ConversationAttrs {
  type: string;
  participants: Types.ObjectId[];
  groupId?: Types.ObjectId | null;
  typingUsers: Types.ObjectId[];      
  seenBy: Types.ObjectId[];            
  latestMessage?: Types.ObjectId;
  unreadCounts: Map<string, number>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDocument extends ConversationAttrs, Document {}