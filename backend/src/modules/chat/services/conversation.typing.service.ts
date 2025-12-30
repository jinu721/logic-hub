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
import { ConversationDocument, PopulatedConversation } from "@shared/types";


export class ConversationTypingService
  extends BaseService<ConversationDocument, PublicConversationDTO>
  implements IConversationTypingService {
  constructor(private readonly conversationRepo: IConversationRepository) {
    super();
  }

  protected toDTO(entity: ConversationDocument): PublicConversationDTO {
    // Handle both populated and non-populated conversations
    if (this.isPopulatedConversation(entity)) {
      return toPublicConversationDTO(entity);
    }
    
    // For non-populated, return basic structure
    return {
      _id: entity._id?.toString() || "",
      type: entity.type as 'group' | 'one-to-one',
      participants: [],
      latestMessage: null,
      isDeleted: entity.isDeleted,
      typingUsers: [],
      unreadCounts: entity.unreadCounts instanceof Map
        ? Object.fromEntries(entity.unreadCounts)
        : entity.unreadCounts || {},
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private isPopulatedConversation(conv: unknown): conv is PopulatedConversation {
    return conv !== null && typeof conv === 'object' && 'participants' in conv && 
           Array.isArray((conv as PopulatedConversation).participants) && 
           (conv as PopulatedConversation).participants.length > 0 && 
           typeof (conv as PopulatedConversation).participants[0] === 'object' && 
           'username' in (conv as PopulatedConversation).participants[0];
  }

  protected toDTOs(entities: ConversationDocument[]): PublicConversationDTO[] {
    return entities.map(e => this.toDTO(e));
  }

  async setTypingUser(conversationId: string, userId: string): Promise<PublicConversationDTO> {
    const updated = await this.conversationRepo.setTypingUser(conversationId, userId);
    console.log("Updatedd", updated)
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
    return users.map((u: unknown) => u?.toString() || "");
  }
}
