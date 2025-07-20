import { Types } from "mongoose";
import { Message } from "../../models/message.model";
import { MessageIF } from "../../types/message.types";
import { BaseRepository } from "../base.repository";
import { IMessageRepository } from "../interfaces/message.repository.interface";

export class MessageRepository
  extends BaseRepository<MessageIF>
  implements IMessageRepository
{
  constructor() {
    super(Message);
  }
  async createMessage(
    data: MessageIF & { replyTo?: string }
  ): Promise<MessageIF> {
    const message = await this.model.create(data);

    return await message.populate([
      {
        path: "sender",
        select: "username avatar banner membership stats",
        populate: [{ path: "avatar" }, { path: "banner" }],
      },
      {
        path: "replyTo",
        populate: {
          path: "sender",
          select: "username avatar banner membership stats",
          populate: [{ path: "avatar" }, { path: "banner" }],
        },
      },
      {
        path: "reactions.userId",
        select: "username avatar banner membership stats",
        populate: [{ path: "avatar" }, { path: "banner" }],
      },
      {
        path: "seenBy",
        select: "username avatar banner isOnline",
        populate: [{ path: "avatar" }, { path: "banner" }],
      },
    ]);
  }

  async editMessage(
    messageId: string,
    newText: string
  ): Promise<MessageIF | null> {
    return await this.model
      .findByIdAndUpdate(
        messageId,
        { content: newText, isEdited: true },
        { new: true }
      )
      .populate([
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
      ]);
  }
  async getMessages(limit: number, query: any): Promise<MessageIF[]> {
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
      ]);
  }
  async deleteMessage(messageId: string): Promise<MessageIF | null> {
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
  ): Promise<MessageIF | null> {
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

    return await query.populate([
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
    ]);
  }

  async removeReaction(
    messageId: string,
    userId: string,
    reaction: string
  ): Promise<MessageIF | null> {
    return await this.model
      .findByIdAndUpdate(
        messageId,
        { $pull: { reactions: { userId, emoji: reaction } } },
        { new: true }
      )
      .populate([
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
      ]);
  }

  async markAsSeen(
    messageId: string,
    userId: string
  ): Promise<MessageIF | null> {
    return await this.model.findByIdAndUpdate(messageId, {
      $push: { seenBy: { userId } },
    });
  }

  async getMessageById(messageId: string): Promise<MessageIF | null> {
    return this.model.findById(messageId);
  }
  async findMessageById(messageId: string) {
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
    ]);
  }

  async save(message: any) {
    return message.save();
  }

  async closePoll(pollId: string) {
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
