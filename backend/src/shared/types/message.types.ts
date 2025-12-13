import { Document, Types } from "mongoose";

export interface MessageAttrs {
  conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  content?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker';
  mentionedUsers?: Types.ObjectId[];
  seenBy?: Types.ObjectId[];
  media?: {
    url: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker';
  };
  reactions?: {
    emoji: string;
    userId: Types.ObjectId;
  }[];
  replyTo?: Types.ObjectId;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface MessageDocument extends MessageAttrs, Document {}


