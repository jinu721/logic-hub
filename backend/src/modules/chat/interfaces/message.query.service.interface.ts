import { PublicMessageDTO } from "@modules/chat/dtos"

export interface IMessageQueryService {
  getMessages(limit: number, query: any): Promise<PublicMessageDTO[]>
  getMessageById(messageId: string): Promise<PublicMessageDTO | null>
}
