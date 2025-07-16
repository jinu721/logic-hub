// types/socket.types.ts
import { Socket } from "socket.io";

export interface ExtendedSocket extends Socket {
  userId?: string;
}

export interface MessageData {
  conversationId: string;
  content: string;
  type?: string;
  // Add other message properties as needed
}

export interface PollVoteData {
  pollId: string;
  optionIndex: number;
  userId: string;
}

export interface GroupUpdateData {
  type: 'add_members' | 'remove_member' | 'make_admin' | 'remove_admin' | 
        'edit_group_info' | 'leave_group' | 'delete_group' | 'join_group' | 'approve_group';
  conversationId: string;
  groupId: string;
  members?: string[];
  userId?: string;
  newGroupData?: any;
  removeMember?: string;
}

export interface TypingData {
  conversationId: string;
  userId: string;
}

export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: any;
}

export interface ChallengeData {
  challengeId: string;
  accessToken: string;
}

export interface VoiceRoomData {
  groupId: string;
  roomData: any;
}