import { BaseService } from "@core"
import { IMessageCommandService, IMessageRepository } from "@modules/chat"
import { PublicMessageDTO, toPublicMessageDTO } from "@modules/chat/dtos"
import { MessageIF } from "@shared/types"
import { verifyAccessToken } from "@utils/token"
import { Types } from "mongoose"

export class MessageCommandService
  extends BaseService<MessageIF, PublicMessageDTO>
  implements IMessageCommandService
{
  constructor(private readonly messageRepo: IMessageRepository) {
    super()
  }

  protected toDTO(entity: MessageIF): PublicMessageDTO {
    return toPublicMessageDTO(entity)
  }

  protected toDTOs(): PublicMessageDTO[] {
    return []
  }

  async createMessage(
    data: MessageIF & { replyTo?: string },
    accessToken: string | null
  ): Promise<PublicMessageDTO> {
    const SYSTEM_USER_ID = new Types.ObjectId("000000000000000000000000")

    let sender

    if (accessToken) {
      const user = verifyAccessToken(accessToken) as any
      if (!user) throw new Error("Unauthorized")
      sender = new Types.ObjectId(user.userId)
    } else {
      sender = SYSTEM_USER_ID
    }

    const message = await this.messageRepo.createMessage({ ...data, sender })
    return this.mapOne(message)
  }

  async editMessage(
    messageId: string,
    newText: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.editMessage(messageId, newText)
    return updated ? this.mapOne(updated) : null
  }

  async deleteMessage(messageId: string): Promise<PublicMessageDTO | null> {
    const deleted = await this.messageRepo.deleteMessage(messageId)
    return deleted ? this.mapOne(deleted) : null
  }
}
