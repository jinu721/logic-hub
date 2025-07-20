import { IMessageService } from "../interfaces/message.service.interface";
import { IMessageRepository } from "../../repository/interfaces/message.repository.interface";
import { MessageIF } from "../../types/message.types";
import { verifyAccessToken } from "../../utils/verify.token";
import { Types } from "mongoose";
import {
  PublicMessageDTO,
  toPublicMessageDTO,
  toPublicMessageDTOs,
} from "../../mappers/message.dto";
import { toPublicUserDTO } from "../../mappers/user.dto";

export class MessageService implements IMessageService {
  private messageRepo: IMessageRepository;

  constructor(messageRepo: IMessageRepository) {
    this.messageRepo = messageRepo;
  }

  async createMessage(
    data: MessageIF & { replyTo?: string },
    accessToken: string | null
  ): Promise<PublicMessageDTO> {
    const SYSTEM_USER_ID = new Types.ObjectId("000000000000000000000000");

    let sender;

    if (accessToken) {
      const user = verifyAccessToken(accessToken) as any;
      if (!user) throw new Error("Unauthorized");
      sender = new Types.ObjectId(user.userId);
    } else {
      sender = SYSTEM_USER_ID;
    }

    const message = await this.messageRepo.createMessage({ ...data, sender });
    return toPublicMessageDTO(message);
  }

  async getMessages(limit: number, query: any): Promise<PublicMessageDTO[]> {
    const messages = await this.messageRepo.getMessages(limit, query);
    // const safedUser = toPublicUserDTOs(messages.sender);
    return toPublicMessageDTOs(messages);
  }

  async editMessage(
    messageId: string,
    newText: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.editMessage(messageId, newText);
    return updated ? toPublicMessageDTO(updated) : null;
  }

  async deleteMessage(messageId: string): Promise<PublicMessageDTO | null> {
    const deleted = await this.messageRepo.deleteMessage(messageId);
    return deleted ? toPublicMessageDTO(deleted) : null;
  }

  async addReaction(
    messageId: string,
    userId: string,
    reaction: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.addReaction(
      messageId,
      userId,
      reaction
    );
    return updated ? toPublicMessageDTO(updated) : null;
  }

  async removeReaction(
    messageId: string,
    userId: string,
    reaction: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.removeReaction(
      messageId,
      userId,
      reaction
    );
    return updated ? toPublicMessageDTO(updated) : null;
  }

  async toggleReaction(messageId: string, userId: string, emoji: string) {
    const message = await this.messageRepo.getMessageById(messageId);
    if (!message) throw new Error("Message not found");

    if (!Array.isArray(message.reactions)) {
      message.reactions = [];
    }

    const existingIndex = message.reactions.findIndex(
      (r: { userId: string; emoji: string }) => r.userId.toString() === userId
    );

    if (existingIndex !== -1) {
      const existingReaction = message.reactions[existingIndex];

      if (existingReaction.emoji === emoji) {
        message.reactions.splice(existingIndex, 1);
      } else {
        message.reactions[existingIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({ userId, emoji });
    }

    await this.messageRepo.save(message);
    return toPublicMessageDTO(message);
  }

  async markAsSeen(
    messageId: string,
    userId: string
  ): Promise<PublicMessageDTO | null> {
    const updated = await this.messageRepo.markAsSeen(messageId, userId);
    return updated ? toPublicMessageDTO(updated) : null;
  }

  async getMessageById(messageId: string): Promise<PublicMessageDTO | null> {
    const message = await this.messageRepo.getMessageById(messageId);
    return message ? toPublicMessageDTO(message) : null;
  }

  async markMessagesAsSeen(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await this.messageRepo.markMessagesAsSeen(conversationId, userId);
  }
}
