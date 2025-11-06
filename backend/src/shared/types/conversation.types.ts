import { Types,Document } from "mongoose";

export interface ConversationIF extends Document {
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