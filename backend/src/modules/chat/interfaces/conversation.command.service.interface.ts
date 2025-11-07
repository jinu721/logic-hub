import { PublicConversationDTO } from "@modules/chat/dtos";

export interface IConversationCommandService {
  createOneToOne(userA: string, userB: string): Promise<string>;
  updateLastMessage(conversationId: string, messageId: string): Promise<PublicConversationDTO>;
  addUnreadCounts(conversationId: string, userIds: string[]): Promise<PublicConversationDTO>;
  markAsRead(conversationId: string, userId: string): Promise<PublicConversationDTO>;
}
