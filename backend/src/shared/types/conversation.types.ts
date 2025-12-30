import { Document, Types } from "mongoose";
import { PopulatedUser } from "./user.types";
import { PopulatedMessage } from "./message.types";

export interface ConversationBase {
  type: string;
  isDeleted: boolean;
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationRaw extends ConversationBase {
  participants: Types.ObjectId[];
  groupId?: Types.ObjectId | null;
  typingUsers: Types.ObjectId[];
  seenBy: Types.ObjectId[];
  latestMessage?: Types.ObjectId;
}

export interface PopulatedConversation extends ConversationBase {
  _id: Types.ObjectId;
  participants: PopulatedUser[];
  groupId?: Types.ObjectId | null;
  typingUsers: PopulatedUser[];
  seenBy: PopulatedUser[];
  latestMessage?: PopulatedMessage;
}

export interface ConversationDocument extends ConversationRaw, Document { }

// Legacy interface name for backward compatibility
export interface ConversationIF extends ConversationDocument { }