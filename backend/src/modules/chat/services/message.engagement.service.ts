
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

import { MessageDocument } from "@shared/types";
import { Types } from "mongoose";

export class MessageEngagementService
  extends BaseService<MessageDocument, PublicMessageDTO>
  implements IMessageEngagementService {
  constructor(private readonly messageRepo: IMessageRepository) {
    super();
  }

  protected toDTO(entity: MessageDocument): PublicMessageDTO {
    return toPublicMessageDTO(entity);
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
      (message.reactions).push({
        userId: new Types.ObjectId(userId),
        emoji,
      });
    }

    const saved = await this.messageRepo.save(message);
    return this.mapOne(saved);
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
