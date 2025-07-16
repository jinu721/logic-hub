import { PublicConversationDTO } from "../../mappers/conversation.dto";

export interface IConversationService {
    findOneToOne(userA: string, userB: string): Promise<PublicConversationDTO | null>;
    findConversation(conversationId: string,userId:string): Promise<PublicConversationDTO | null>;
    findConversations(userId:string,search:any): Promise<PublicConversationDTO[] | null>;
    createOneToOne(userA: string, userB: string): Promise<string | null>;
    setTypingUser(conversationId: string, userId: string): Promise<PublicConversationDTO | null>;
    removeTypingUser(conversationId: string, userId: string): Promise<PublicConversationDTO | null>;
    getTypingUsers(conversationId: string): Promise<any[]>;
    addUnreadCountsForUsers(conversationId: string, userIds: string[]): Promise<PublicConversationDTO | null>;
    markAsRead(conversationId: string, userId: string): Promise<PublicConversationDTO | null>;
    findConversationByGroup(groupId: string): Promise<PublicConversationDTO | null>;
    updateLastMessage(conversationId: string, messageId: string): Promise<PublicConversationDTO | null>;
    getConversationById(conversationId: string): Promise<PublicConversationDTO | null>;
}
