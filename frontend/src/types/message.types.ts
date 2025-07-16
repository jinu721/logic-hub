import { UserIF } from "./user.types";

export interface MessageIF {
  _id?: string;
  conversationId: string;
  sender: UserIF;
  content?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker' | 'date' | "typing";
  mentionedUsers?: string[];
  seenBy?: string[];
  media?: {
    url: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker';
  };
  reactions?: {
    emoji: string;
    userId: UserIF;
  }[];
  replyTo?: MessageIF;
  isEdited: boolean;
  isSeen: boolean;
  isDeleted: boolean;
  poll?: {
    question: string;
    type: 'text' | 'code';
    options: { 
      text: string; 
      votes: string[]; 
      isCorrect?: boolean;
    }[];
    code?: {
      language: string;
      content: string;
    };
    isClosed: boolean;
  };
  
  createdAt: Date | string;
  updatedAt: Date | string;
}
