import { BaseService } from "@core"
import { IMessageQueryService, IMessageRepository } from "@modules/chat"
import { PublicMessageDTO, toPublicMessageDTOs, toPublicMessageDTO } from "@modules/chat/dtos"
import { PopulatedMessage, MessageQueryFilter } from "@shared/types"

export class MessageQueryService
  extends BaseService<PopulatedMessage, PublicMessageDTO>
  implements IMessageQueryService {
  constructor(private readonly messageRepo: IMessageRepository) {
    super()
  }

  protected toDTO(entity: PopulatedMessage): PublicMessageDTO {
    return toPublicMessageDTO(entity)
  }

  protected toDTOs(entities: PopulatedMessage[]): PublicMessageDTO[] {
    return toPublicMessageDTOs(entities)
  }

  async getMessages(limit: number, query: MessageQueryFilter): Promise<PublicMessageDTO[]> {
    const messages = await this.messageRepo.getMessages(limit, query)
    return this.mapMany(messages)
  }

  async getMessageById(messageId: string): Promise<PublicMessageDTO | null> {
    const message = await this.messageRepo.getMessageById(messageId)
    if (!message) return null
    return this.mapOne(message)
  }
}
