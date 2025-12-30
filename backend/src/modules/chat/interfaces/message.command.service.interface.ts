import { PublicMessageDTO } from "@modules/chat/dtos"
import { CreateMessageInput, MessageData } from "@shared/types"

export interface IMessageCommandService {
  createMessage(data: MessageData, accessToken: string | null): Promise<PublicMessageDTO>
  createMessageWithSender(data: CreateMessageInput, accessToken: string | null): Promise<PublicMessageDTO>
  editMessage(messageId: string, newText: string): Promise<PublicMessageDTO | null>
  deleteMessage(messageId: string): Promise<PublicMessageDTO | null>
}
