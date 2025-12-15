import { UserIF } from "./user.types";

export interface MessageIF {
  _id?: string;
  conversationId: string;
  sender: UserIF;
  content?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker' | 'date' | "typing";
  mentionedUsers?: string[];
  seenBy?: (string | UserIF)[];
  media?: {
    url: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker';
  };
  reactions?: {
    emoji: string;
    userId: string;
  }[];
  replyTo?: MessageIF;
  isEdited: boolean;
  isSeen: boolean;
  isDeleted: boolean;

  createdAt: Date | string;
  updatedAt: Date | string;
}
