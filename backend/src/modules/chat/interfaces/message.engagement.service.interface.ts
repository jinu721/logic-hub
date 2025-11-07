import { PublicMessageDTO } from "@modules/chat/dtos"

export interface IMessageEngagementService {
  addReaction(messageId: string, userId: string, emoji: string): Promise<PublicMessageDTO | null>
  removeReaction(messageId: string, userId: string, emoji: string): Promise<PublicMessageDTO | null>
  toggleReaction(messageId: string, userId: string, emoji: string): Promise<PublicMessageDTO | null>
  markAsSeen(messageId: string, userId: string): Promise<PublicMessageDTO | null>
  markMessagesAsSeen(conversationId: string, userId: string): Promise<void>
}
