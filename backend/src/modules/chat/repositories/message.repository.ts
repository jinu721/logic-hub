import { Types } from "mongoose";
import { MessageModel, IMessageRepository } from "@modules/chat";
import { MessageDocument, PopulatedMessage, MessageQueryFilter } from "@shared/types";
import { BaseRepository } from "@core";


export class MessageRepository
  extends BaseRepository<MessageDocument>
  implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }
  async createMessage(
    data: MessageDocument & { replyTo?: string }
  ): Promise<MessageDocument> {
    return await this.model.create(data);
  }

  async editMessage(
    messageId: string,
    newText: string
  ): Promise<MessageDocument | null> {
    return await this.model
      .findByIdAndUpdate(
        messageId,
        { content: newText, isEdited: true },
        { new: true }
      );
  }
  async getMessages(limit: number, query: MessageQueryFilter): Promise<PopulatedMessage[]> {
    return await this.model
      .find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean()
      .populate([
        {
          path: "sender",
          select: "username avatar banner membership stats",
          populate: [{ path: "avatar" }, { path: "banner" }],
        },
        {
          path: "replyTo",
          populate: {
            path: "sender",
            select: "username avatar banner",
            populate: [{ path: "avatar" }, { path: "banner" }],
          },
        },
        {
          path: "reactions.userId",
          select: "username avatar banner",
          populate: [{ path: "avatar" }, { path: "banner" }],
        },
        {
          path: "seenBy",
          select: "username avatar banner isOnline",
          populate: [{ path: "avatar" }, { path: "banner" }],
        },
      ]) as unknown as PopulatedMessage[];
  }
  async deleteMessage(messageId: string): Promise<MessageDocument | null> {
    return await this.model.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true }
    );
  }
  async addReaction(
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<MessageDocument | null> {
    const message = await this.model.findOne({
      _id: messageId,
      "reactions.userId": userId,
    });

    const query = message
      ? this.model.findOneAndUpdate(
        { _id: messageId, "reactions.userId": userId },
        { $set: { "reactions.$.emoji": emoji } },
        { new: true }
      )
      : this.model.findByIdAndUpdate(
        messageId,
        { $push: { reactions: { userId, emoji } } },
        { new: true }
      );

    return await query;
  }

  async removeReaction(
    messageId: string,
    userId: string,
    reaction: string
  ): Promise<MessageDocument | null> {
    return await this.model
      .findByIdAndUpdate(
        messageId,
        { $pull: { reactions: { userId, emoji: reaction } } },
        { new: true }
      );
  }

  async markAsSeen(
    messageId: string,
    userId: string
  ): Promise<MessageDocument | null> {
    return await this.model.findByIdAndUpdate(messageId, {
      $push: { seenBy: { userId } },
    });
  }

  async getMessageById(messageId: string): Promise<PopulatedMessage | null> {
    return this.model.findById(messageId).populate([
      {
        path: "sender",
        select: "username avatar banner",
        populate: [{ path: "avatar" }, { path: "banner" }],
      },
      {
        path: "replyTo",
        populate: {
          path: "sender",
          select: "username avatar banner",
          populate: [{ path: "avatar" }, { path: "banner" }],
        },
      },
    ]) as unknown as PopulatedMessage;
  }
  async findMessageById(messageId: string): Promise<PopulatedMessage | null> {
    return this.model.findById(messageId).populate([
      {
        path: "sender",
        select: "username avatar banner",
        populate: [{ path: "avatar" }, { path: "banner" }],
      },
      {
        path: "replyTo",
        populate: {
          path: "sender",
          select: "username avatar banner",
          populate: [{ path: "avatar" }, { path: "banner" }],
        },
      },
    ]) as unknown as PopulatedMessage;
  }

  async save(message: MessageDocument): Promise<MessageDocument | null> {
    return message.save();
  }

  async closePoll(pollId: string): Promise<MessageDocument | null> {
    return this.model.findByIdAndUpdate(
      pollId,
      { isOpen: false },
      { new: true }
    );
  }

  async markMessagesAsSeen(
    conversationId: string,
    userId: string
  ): Promise<void> {
    await this.model.updateMany(
      {
        conversationId: new Types.ObjectId(conversationId),
        sender: { $ne: new Types.ObjectId(userId) },
        seenBy: { $ne: new Types.ObjectId(userId) },
      },
      {
        $addToSet: { seenBy: new Types.ObjectId(userId) },
      }
    );
  }
}
