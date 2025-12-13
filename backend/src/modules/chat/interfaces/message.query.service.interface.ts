import { PublicMessageDTO } from "@modules/chat/dtos"
import { MessageQueryFilter } from "@shared/types"

export interface IMessageQueryService {
  getMessages(limit: number, query: MessageQueryFilter): Promise<PublicMessageDTO[]>
  getMessageById(messageId: string): Promise<PublicMessageDTO | null>
}
