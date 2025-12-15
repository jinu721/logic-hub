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

import { PopulatedConversation } from "@shared/types";


export class ConversationCommandService
  extends BaseService<PopulatedConversation, PublicConversationDTO>
  implements IConversationCommandService {
  constructor(private readonly conversationRepo: IConversationRepository) {
    super();
  }

  protected toDTO(entity: PopulatedConversation): PublicConversationDTO {
    return toPublicConversationDTO(entity);
  }

  protected toDTOs(entities: PopulatedConversation[]): PublicConversationDTO[] {
    return entities.map(e => toPublicConversationDTO(e));
  }

  private async getPopulated(id: string): Promise<PopulatedConversation> {
    const conversation = await this.conversationRepo.findConversationById(id);
    if (!conversation) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return conversation;
  }

  async createOneToOne(userA: string, userB: string): Promise<string> {
    const existing = await this.conversationRepo.findOneToOne(userA, userB);
    if (existing) return String(existing._id);

    const created = await this.conversationRepo.createOneToOne(userA, userB);
    if (!created) throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create conversation");

    return String(created._id);
  }

  async updateLastMessage(conversationId: string, messageId: string): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.updateLastMessage(conversationId, messageId);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(await this.getPopulated(conversationId));
  }

  async addUnreadCounts(conversationId: string, userIds: string[]): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.addUnreadCountsForUsers(conversationId, userIds);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    // Ensure we fetch the completely fresh populated conversation
    const populated = await this.getPopulated(conversationId);
    return this.mapOne(populated);
  }

  async markAsRead(conversationId: string, userId: string): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.markRead(conversationId, userId);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(await this.getPopulated(conversationId));
  }
}
