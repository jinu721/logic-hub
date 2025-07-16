import { IConversationRepository } from "../interfaces/conversation.repository.interface";
import { Conversation } from "../../models/conversation.model";
import { BaseRepository } from "../base.repository";
import { ConversationIF } from "../../types/conversation.types";
import { ObjectId, Types } from "mongoose";

export class ConversationRepository
  extends BaseRepository<ConversationIF>
  implements IConversationRepository
{
  constructor() {
    super(Conversation);
  }

  async findOneToOne(
    userA: string,
    userB: string
  ): Promise<ConversationIF | null> {
    return await this.model.findOne({
      type: "one-to-one",
      participants: { $all: [userA, userB] },
    });
  }

  async findConversationById(
    conversationId: string
  ): Promise<ConversationIF | null> {
    return await this.model.findById(conversationId).populate([
      {
        path: "participants",
        select: "username bio avatar banner isOnline lastSeen",
        populate: [
          {
            path: "avatar",
            select: "url",
          },
          {
            path: "banner",
            select: "url",
          },
        ],
      },
      {
        path: "typingUsers",
        select: "username avatar",
        populate: {
          path: "avatar",
          select: "url",
        },
      },
      {
        path: "latestMessage",
        populate: [
          {
            path: "sender",
            select: "username avatar",
            populate: {
              path: "avatar",
              select: "url",
            },
          },
          {
            path: "replyTo",
            populate: {
              path: "sender",
              select: "username avatar",
              populate: {
                path: "avatar",
                select: "url",
              },
            },
          },
          {
            path: "media",
            select: "url type",
          },
        ],
      },
    ]);
  }

  async findConversationsByUser(
    userId: string
  ): Promise<ConversationIF[] | null> {
    const objectId = new Types.ObjectId(userId);
    const conversation = await this.model
      .find({ participants: objectId })
      .populate([
        {
          path: "participants",
          select: "username bio avatar banner isOnline lastSeen",
          populate: [
            {
              path: "avatar",
              select: "url",
            },
            {
              path: "banner",
              select: "url",
            },
          ],
        },
        {
          path: "typingUsers",
          select: "username avatar",
          populate: {
            path: "avatar",
            select: "url",
          },
        },
        {
          path: "latestMessage",
          populate: [
            {
              path: "sender",
              select: "username avatar",
              populate: {
                path: "avatar",
                select: "url",
              },
            },
            {
              path: "replyTo",
              populate: {
                path: "sender",
                select: "username avatar",
                populate: {
                  path: "avatar",
                  select: "url",
                },
              },
            },
            {
              path: "media",
              select: "url type",
            },
          ],
        },
      ]);

    return conversation;
  }

  async addParticipants(groupId: string, userIds: Types.ObjectId[]) {
    return await this.model
      .findOneAndUpdate(
        { groupId },
        { $addToSet: { participants: { $each: userIds } } },
        { new: true }
      )
      .populate({
        path: "participants",
        select: "username bio avatar banner",
        populate: [
          { path: "avatar", select: "image" },
          { path: "banner", select: "image" },
        ],
      })
      .populate("latestMessage")
      .populate("typingUsers");
  }

  async removeParticipants(groupId: string, userIds: Types.ObjectId[]) {
    return await this.model
      .findOneAndUpdate(
        { groupId },
        { $pull: { participants: { $in: userIds } } },
        { new: true }
      )
      .populate({
        path: "participants",
        select: "username bio avatar banner",
        populate: [
          { path: "avatar", select: "image" },
          { path: "banner", select: "image" },
        ],
      })
      .populate("latestMessage")
      .populate("typingUsers");
  }

  async addUnreadCountsForUsers(conversationId: string, userIds: string[]) {
    const incObject: Record<string, number> = {};

    userIds.forEach((userId) => {
      incObject[`unreadCounts.${userId}`] = 1;
    });

    return await this.model.findByIdAndUpdate(
      conversationId,
      { $inc: incObject },
      { new: true }
    );
  }

  async markRead(conversationId: string, userId: string) {
    return await this.model
      .findByIdAndUpdate(
        conversationId,
        { $unset: { [`unreadCounts.${userId}`]: "" } },
        { new: true }
      )
      .populate({
        path: "participants",
        select: "username bio avatar banner",
        populate: [
          { path: "avatar", select: "image" },
          { path: "banner", select: "image" },
        ],
      })
      .populate("latestMessage")
      .populate("typingUsers");
  }

  async createOneToOne(
    userA: string,
    userB: string
  ): Promise<ConversationIF | null> {
    return await this.model.create({
      type: "one-to-one",
      participants: [userA, userB],
    });
  }

  async createGroup(
    participants: string[],
    groupId: string
  ): Promise<ConversationIF | null> {
    return await this.model.create({
      type: "group",
      participants: participants,
      groupId: groupId,
    });
  }
  async setTypingUser(
    conversationId: string,
    userId: string
  ): Promise<ConversationIF | null> {
    return await this.model
      .findByIdAndUpdate(
        conversationId,
        { $addToSet: { typingUsers: userId } },
        { new: true }
      )
      .populate({
        path: "typingUsers",
        select: "avatar username _id",
        populate: {
          path: "avatar",
          model: "Avatar",
          select: "image name",
        },
      });
  }
  async removeTypingUser(
    conversationId: string,
    userId: string
  ): Promise<ConversationIF | null> {
    return await this.model
      .findByIdAndUpdate(
        conversationId,
        { $pull: { typingUsers: userId } },
        { new: true }
      )
      .populate({
        path: "typingUsers",
        select: "avatar username _id",
        populate: {
          path: "avatar",
          model: "Avatar",
          select: "image name",
        },
      });
  }
  async getTypingUsers(conversationId: string): Promise<any[]> {
    const conversation = await this.model
      .findById(conversationId)
      .select("typingUsers");
    return conversation?.typingUsers || [];
  }
  async softDeleteByGroupId(groupId: string): Promise<ConversationIF | null> {
    return await this.model.findOneAndUpdate(
      { groupId },
      { isDeleted: true },
      { new: true }
    );
  }

  async saveConversation(
    conversation: ConversationIF
  ): Promise<ConversationIF | null> {
    return await this.model.findByIdAndUpdate(conversation._id, conversation, {
      new: true,
    });
  }

  async findConversationByGroup(
    groupId: string
  ): Promise<ConversationIF | null> {
    return this.model
      .findOne({ groupId })
      .populate([
        {
          path: "participants",
          select: "username bio avatar banner",
          populate: [
            {
              path: "avatar",
              select: "url",
            },
            {
              path: "banner",
              select: "url",
            },
          ],
        },
        {
          path: "latestMessage",
          populate: {
            path: "sender",
            select: "username avatar",
            populate: {
              path: "avatar",
              select: "url",
            },
          },
        },
      ])
      .populate("latestMessage")
      .populate("typingUsers");
  }

  async updateLastMessage(
    conversationId: string,
    messageId: string
  ): Promise<ConversationIF | null> {
    return await this.model
      .findByIdAndUpdate(
        conversationId,
        { latestMessage: messageId },
        { new: true }
      )
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username avatar",
          populate: {
            path: "avatar",
            select: "url",
          },
        },
      });
  }
}
