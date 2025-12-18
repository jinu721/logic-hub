import { Types } from "mongoose";
import { IConversationRepository, ConversationModel } from "@modules/chat";
import { BaseRepository } from "@core";
import { ConversationDocument, PopulatedConversation } from "@shared/types";


export class ConversationRepository
  extends BaseRepository<ConversationDocument>
  implements IConversationRepository {
  constructor() {
    super(ConversationModel);
  }

  async findOneToOne(
    userA: string,
    userB: string
  ): Promise<PopulatedConversation | null> {
    return await this.model.findOne({
      type: "one-to-one",
      participants: { $all: [userA, userB] },
    }).populate([
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
    ]) as unknown as PopulatedConversation;
  }

  async findConversationById(
    conversationId: string
  ): Promise<PopulatedConversation | null> {
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
    ]) as unknown as PopulatedConversation;
  }

  async findConversationsByUser(
    userId: string
  ): Promise<PopulatedConversation[] | null> {
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

    return conversation as unknown as PopulatedConversation[];
  }

  async addParticipants(groupId: string, userIds: Types.ObjectId[]) {
    return await this.model
      .findOneAndUpdate(
        { groupId },
        { $addToSet: { participants: { $each: userIds } } },
        { new: true }
      );
  }

  async removeParticipants(groupId: string, userIds: Types.ObjectId[]) {
    return await this.model
      .findOneAndUpdate(
        { groupId },
        { $pull: { participants: { $in: userIds } } },
        { new: true }
      );
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
      );
  }

  async createOneToOne(
    userA: string,
    userB: string
  ): Promise<ConversationDocument | null> {
    return await this.model.create({
      type: "one-to-one",
      participants: [userA, userB],
    });
  }

  async createGroup(
    participants: string[],
    groupId: string
  ): Promise<ConversationDocument | null> {
    return await this.model.create({
      type: "group",
      participants: participants,
      groupId: groupId,
    });
  }
  async setTypingUser(
    conversationId: string,
    userId: string
  ): Promise<ConversationDocument | null> {
    return await this.model
      .findByIdAndUpdate(
        conversationId,
        { $addToSet: { typingUsers: userId } },
        { new: true }
      ).populate("typingUsers");
  }
  async removeTypingUser(
    conversationId: string,
    userId: string
  ): Promise<ConversationDocument | null> {
    return await this.model
      .findByIdAndUpdate(
        conversationId,
        { $pull: { typingUsers: userId } },
        { new: true }
      ).populate("typingUsers");
  }
  async getTypingUsers(conversationId: string): Promise<ConversationDocument[]> {
    const conversation = await this.model
      .findById(conversationId)
      .select("typingUsers");
    return conversation?.typingUsers || [];
  }
  async softDeleteByGroupId(groupId: string): Promise<ConversationDocument | null> {
    return await this.model.findOneAndUpdate(
      { groupId },
      { isDeleted: true },
      { new: true }
    );
  }

  async saveConversation(
    conversation: ConversationDocument
  ): Promise<ConversationDocument | null> {
    return await this.model.findByIdAndUpdate(conversation._id, conversation, {
      new: true,
    });
  }

  async findConversationByGroup(
    groupId: string
  ): Promise<PopulatedConversation | null> {
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
      .populate("typingUsers") as unknown as PopulatedConversation;
  }

  async updateLastMessage(
    conversationId: string,
    messageId: string
  ): Promise<ConversationDocument | null> {
    return await this.model
      .findByIdAndUpdate(
        conversationId,
        { latestMessage: messageId },
        { new: true }
      );
  }
}
