
import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

import {
  PublicMessageDTO,
  toPublicMessageDTO,
} from "@modules/chat/dtos";

import {
  IMessageEngagementService,
  IMessageRepository,
} from "@modules/chat";

import { MessageDocument, PopulatedMessage } from "@shared/types";
import { Types } from "mongoose";

export class MessageEngagementService
  extends BaseService<MessageDocument, PublicMessageDTO>
  implements IMessageEngagementService {
  constructor(private readonly messageRepo: IMessageRepository) {
    super();
  }

  protected toDTO(entity: MessageDocument): PublicMessageDTO {
    // If the entity is already populated, use it directly
    if (this.isPopulatedMessage(entity)) {
      return toPublicMessageDTO(entity as unknown as PopulatedMessage);
    }
    
    // For non-populated messages, create a basic DTO
    return {
      _id: entity._id?.toString() || "",
      sender: {
        _id: "",
        username: "Unknown User",
        avatar: null
      },
      conversationId: entity.conversationId?.toString() || "",
      content: entity.content || "",
      type: entity.type,
      media: entity.media || undefined,
      mentionedUsers: [],
      reactions: [],
      seenBy: [],
      isEdited: entity.isEdited,
      isDeleted: entity.isDeleted,
      replyTo: entity.replyTo?.toString() || null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private isPopulatedMessage(entity: unknown): boolean {
    return entity !== null && typeof entity === 'object' && 'sender' in entity && 
           typeof (entity as MessageDocument).sender === 'object' && 
           'username' in (entity as MessageDocument).sender;
  }

  protected toDTOs(_: MessageDocument[]): PublicMessageDTO[] {
    return [];
  }


  async addReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.addReaction(messageId, userId, emoji);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Message not found");
    return this.mapOne(updated);
  }

  async removeReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.removeReaction(messageId, userId, emoji);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Message not found");
    return this.mapOne(updated);
  }

  async toggleReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<PublicMessageDTO | null> {
    const message = await this.messageRepo.getMessageById(messageId);
    if (!message) throw new AppError(HttpStatus.NOT_FOUND, "Message not found");

    if (!Array.isArray(message.reactions)) {
      (message).reactions = [];
    }

    const idx = message.reactions.findIndex(
      (r: { userId?: { toString: () => string } }) => r.userId?.toString() === userId
    );

    if (idx !== -1) {
      const existing = message.reactions[idx];
      if (existing.emoji === emoji) {
        message.reactions.splice(idx, 1);
      } else {
        message.reactions[idx].emoji = emoji;
      }
    } else {
      // For non-populated messages, push ObjectId
      if (!this.isPopulatedMessage(message)) {
        (message.reactions as any).push({
          userId: new Types.ObjectId(userId),
          emoji,
        });
      } else {
        // For populated messages, we need to handle this differently
        // This should ideally be done at the repository level
        throw new AppError(HttpStatus.BAD_REQUEST, "Cannot modify populated message directly");
      }
    }

    // If it's a populated message, we need to get the raw document first
    if (this.isPopulatedMessage(message)) {
      // Use repository methods instead of direct save for populated messages
      const updated = await this.messageRepo.addReaction(messageId, userId, emoji);
      return updated ? this.toDTO(updated) : null;
    }

    const saved = await this.messageRepo.save(message as any);
    return saved ? this.toDTO(saved) : null;
  }


  async markAsSeen(
    messageId: string,
    userId: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.markAsSeen(messageId, userId);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Message not found");
    return this.mapOne(updated);
  }

  async markMessagesAsSeen(conversationId: string, userId: string): Promise<void> {
    await this.messageRepo.markMessagesAsSeen(conversationId, userId);
  }
}
