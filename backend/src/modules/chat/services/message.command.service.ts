import { BaseService } from "@core"
import { IMessageCommandService, IMessageRepository } from "@modules/chat"
import { PublicMessageDTO, toPublicMessageDTO } from "@modules/chat/dtos"
import { PopulatedMessage, CreateMessageInput, JwtPayloadBase, MessageData } from "@shared/types"
import { verifyAccessToken } from "@utils/token"
import { Types } from "mongoose"
import { AppError } from "@utils/application"
import { HttpStatus } from "@constants"

export class MessageCommandService
  extends BaseService<PopulatedMessage, PublicMessageDTO>
  implements IMessageCommandService {
  constructor(private readonly messageRepo: IMessageRepository) {
    super()
  }

  protected toDTO(entity: PopulatedMessage): PublicMessageDTO {
    return toPublicMessageDTO(entity)
  }

  protected toDTOs(entities: PopulatedMessage[]): PublicMessageDTO[] {
    return entities.map(e => toPublicMessageDTO(e))
  }

  private async getPopulated(id: string): Promise<PopulatedMessage> {
    const message = await this.messageRepo.getMessageById(id);
    if (!message) throw new AppError(HttpStatus.NOT_FOUND, "Message not found");
    return message;
  }

  async createMessage(
    data: MessageData,
    accessToken: string | null
  ): Promise<PublicMessageDTO> {
    const SYSTEM_USER_ID = new Types.ObjectId("000000000000000000000000")

    let sender: Types.ObjectId

    if (accessToken) {
      const user = verifyAccessToken(accessToken) as JwtPayloadBase | null
      if (!user) throw new Error("Unauthorized")
      sender = new Types.ObjectId(user.userId)
    } else {
      sender = SYSTEM_USER_ID
    }

    const messageInput: CreateMessageInput = {
      sender,
      conversationId: typeof data.conversationId === 'string' ? new Types.ObjectId(data.conversationId) : data.conversationId,
      content: data.content,
      type: (data.type as any) || 'text',
      mentionedUsers: [],
      seenBy: [],
      isEdited: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const message = await this.messageRepo.createMessage(messageInput as any)
    return this.mapOne(await this.getPopulated(String(message._id)))
  }

  async createMessageWithSender(
    data: CreateMessageInput,
    accessToken: string | null
  ): Promise<PublicMessageDTO> {
    const SYSTEM_USER_ID = new Types.ObjectId("000000000000000000000000")

    let sender: Types.ObjectId

    if (accessToken) {
      const user = verifyAccessToken(accessToken) as JwtPayloadBase | null
      if (!user) throw new Error("Unauthorized")
      sender = new Types.ObjectId(user.userId)
    } else {
      sender = SYSTEM_USER_ID
    }

    const message = await this.messageRepo.createMessage({ ...data, sender } as any)
    return this.mapOne(await this.getPopulated(String(message._id)))
  }

  async editMessage(
    messageId: string,
    newText: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.editMessage(messageId, newText)
    if (!updated) return null;
    return this.mapOne(await this.getPopulated(messageId))
  }

  async deleteMessage(messageId: string): Promise<PublicMessageDTO | null> {
    const deleted = await this.messageRepo.deleteMessage(messageId)
    if (!deleted) return null;
    return this.mapOne(await this.getPopulated(messageId))
  }
}
