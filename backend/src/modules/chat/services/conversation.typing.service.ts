import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

import {
  PublicConversationDTO,
  toPublicConversationDTO
} from "@modules/chat/dtos";

import {
  IConversationTypingService,
  IConversationRepository
} from "@modules/chat";
import { ConversationIF } from "@shared/types";


export class ConversationTypingService
  extends BaseService<ConversationIF, PublicConversationDTO>
  implements IConversationTypingService {
  constructor(private readonly conversationRepo: IConversationRepository) {
    super();
  }

  protected toDTO(entity: ConversationIF): PublicConversationDTO {
    return toPublicConversationDTO(entity);
  }

  protected toDTOs(entities: ConversationIF[]): PublicConversationDTO[] {
    return entities.map(e => toPublicConversationDTO(e));
  }

  async setTypingUser(conversationId: string, userId: string): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.setTypingUser(conversationId, userId);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(updated);
  }

  async removeTypingUser(conversationId: string, userId: string): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.removeTypingUser(conversationId, userId);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(updated);
  }

  async getTypingUsers(conversationId: string): Promise<string[]> {
    const users = await this.conversationRepo.getTypingUsers(conversationId);
    return users.map((u: { toString: () => string }) => u.toString());
  }
}
