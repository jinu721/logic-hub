import { BaseService } from "@core"
import { IMessageQueryService,IMessageRepository } from "@modules/chat"
import { PublicMessageDTO, toPublicMessageDTOs, toPublicMessageDTO } from "@modules/chat/dtos"
import { MessageIF } from "@shared/types"

export class MessageQueryService
  extends BaseService<MessageIF, PublicMessageDTO>
  implements IMessageQueryService
{
  constructor(private readonly messageRepo: IMessageRepository) {
    super()
  }

  protected toDTO(entity: MessageIF): PublicMessageDTO {
    return toPublicMessageDTO(entity)
  }

  protected toDTOs(entities: MessageIF[]): PublicMessageDTO[] {
    return toPublicMessageDTOs(entities)
  }

  async getMessages(limit: number, query: any): Promise<PublicMessageDTO[]> {
    const messages = await this.messageRepo.getMessages(limit, query)
    return this.mapMany(messages)
  }

  async getMessageById(messageId: string): Promise<PublicMessageDTO | null> {
    const message = await this.messageRepo.getMessageById(messageId)
    if (!message) return null
    return this.mapOne(message)
  }
}
