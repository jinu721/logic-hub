import { PublicConversationDTO } from "@modules/chat/dtos";
import { ConversationSearchFilter } from "@shared/types";

export interface IConversationQueryService {
  findOneToOne(userA: string, userB: string): Promise<PublicConversationDTO>;
  getConversationById(conversationId: string): Promise<PublicConversationDTO>;
  findConversation(conversationId: string, currentUserId: string): Promise<PublicConversationDTO>;
  findConversations(userId: string, search: ConversationSearchFilter): Promise<PublicConversationDTO[]>;
  findConversationByGroup(groupId: string): Promise<PublicConversationDTO>;
}
