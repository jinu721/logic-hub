
import { PublicConversationDTO } from "@modules/chat/dtos";

export interface IConversationTypingService {
  setTypingUser(conversationId: string, userId: string): Promise<PublicConversationDTO>;
  removeTypingUser(conversationId: string, userId: string): Promise<PublicConversationDTO>;
  getTypingUsers(conversationId: string): Promise<string[]>; 
}
