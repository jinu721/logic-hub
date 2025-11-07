import { PublicUserDTO } from "@modules/user/dtos";

export interface PublicMessageDTO {
  _id: string;
  conversationId: string;
  sender: PublicUserDTO | { _id: string; username: string; avatar: string | null };
  content?: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'voice' | 'poll' | 'system' | 'sticker';
  mentionedUsers?: string[];
  seenBy?: any[];
  media?: {
    url: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'voice' | 'sticker';
  };
  reactions?: {
    emoji: string;
    userId: string;
  }[];
  replyTo?: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
