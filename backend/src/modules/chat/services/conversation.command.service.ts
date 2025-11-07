import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

import {
  PublicConversationDTO,
  toPublicConversationDTO
} from "@modules/chat/dtos";

import {
  IConversationCommandService,
  IConversationRepository
} from "@modules/chat";

import { ConversationIF } from "@shared/types";


export class ConversationCommandService
  extends BaseService<ConversationIF, PublicConversationDTO>
  implements IConversationCommandService
{
  constructor(private readonly conversationRepo: IConversationRepository) {
    super();
  }

  protected toDTO(entity: ConversationIF): PublicConversationDTO {
    return toPublicConversationDTO(entity);
  }

  protected toDTOs(entities: ConversationIF[]): PublicConversationDTO[] {
    return entities.map(e => toPublicConversationDTO(e));
  }

  async createOneToOne(userA: string, userB: string): Promise<string> {
    const existing = await this.conversationRepo.findOneToOne(userA, userB);
    if (existing) return existing._id!.toString();

    const created = await this.conversationRepo.createOneToOne(userA, userB);
    if (!created) throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create conversation");

    return created._id!.toString();
  }

  async updateLastMessage(conversationId: string, messageId: string): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.updateLastMessage(conversationId, messageId);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(updated);
  }

  async addUnreadCounts(conversationId: string, userIds: string[]): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.addUnreadCountsForUsers(conversationId, userIds);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(updated);
  }

  async markAsRead(conversationId: string, userId: string): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.markRead(conversationId, userId);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(updated);
  }
}
