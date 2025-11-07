import { PublicMessageDTO } from "@modules/chat/dtos"

export interface IMessageCommandService {
  createMessage(data: any, accessToken: string | null): Promise<PublicMessageDTO>
  editMessage(messageId: string, newText: string): Promise<PublicMessageDTO | null>
  deleteMessage(messageId: string): Promise<PublicMessageDTO | null>
}
