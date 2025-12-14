import { Document, Types } from "mongoose";
import { PopulatedUser } from "./user.types";

export interface MessageReactionRaw {
  emoji: string;
  userId: Types.ObjectId;
}

export interface MessageReactionPopulated {
  emoji: string;
  userId: PopulatedUser;
}

export interface MessageBase {
  conversationId: Types.ObjectId;
  content?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker';
  media?: {
    url: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker';
  };
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageRaw extends MessageBase {
  sender: Types.ObjectId;
  mentionedUsers?: Types.ObjectId[];
  seenBy?: Types.ObjectId[];
  reactions?: MessageReactionRaw[];
  replyTo?: Types.ObjectId;
}

export interface PopulatedMessage extends MessageBase {
  _id: Types.ObjectId;
  sender: PopulatedUser;
  mentionedUsers?: PopulatedUser[];
  seenBy?: PopulatedUser[];
  reactions?: MessageReactionPopulated[];
  replyTo?: PopulatedMessage;
}

export interface MessageDocument extends MessageRaw, Document { }


