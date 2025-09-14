import { IConversationService } from "../interfaces/conversation.service.interface";
import {
  PublicConversationDTO,
  toPublicConversationDTO,
} from "../../mappers/conversation.dto";
import { ConversationIF } from "../../types/conversation.types";
import { toPublicGroupDTO } from "../../mappers/group.dto";
import { toPublicUserDTO, toPublicUserDTOs } from "../../mappers/user.dto";
import { IConversationRepository } from "../../repository/interfaces/conversation.repository.interface";
import { IGroupRepository } from "../../repository/interfaces/group.repository.interface";
import { IUserRepository } from "../../repository/interfaces/user.repository.interface";

export class ConversationService implements IConversationService {
  constructor(
    private readonly _conversationRepo: IConversationRepository,
    private readonly _groupRepo: IGroupRepository,
    private readonly _userRepo: IUserRepository
  ) {}

  async findOneToOne(
    userA: string,
    userB: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.findOneToOne(
      userA,
      userB
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async findConversation(
    conversationId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    if (!userId) throw new Error("Invalid Token");

    const conversation = await this._conversationRepo.findConversationById(
      conversationId
    );

    console.log("Conversation", conversation);

    if (!conversation) throw new Error("Conversation Not Found");

    const responseData: any = {
      _id: conversation._id,
      type: conversation.type,
      participants: conversation.participants,
      isDeleted: conversation.isDeleted,
      latestMessage: conversation.latestMessage,
      unreadCounts: conversation.unreadCounts,
      currentUserId: userId,
    };

    if (conversation.type === "group") {
      const group = await this._groupRepo.findGroupById(
        conversation.groupId ? conversation.groupId.toString() : ""
      );
      if (!group) throw new Error("Group not found");
      responseData.group = toPublicGroupDTO(group);
    } else if (conversation.type === "one-to-one") {
      const otherUser = conversation.participants.find(
        (user: any) => user._id.toString() !== userId.toString()
      );

      const user = await this._userRepo.getUserById(
        otherUser ? otherUser._id.toString() : ""
      );
      if (!user) throw new Error("User not found");

      responseData.otherUser = toPublicUserDTO(user);
    }

    return responseData;
  }

  async findConversations(
    userId: string,
    search: any
  ): Promise<PublicConversationDTO[] | null> {
    const query: any = {};

    if (search.search) {
      query.name = { $regex: search.search, $options: "i" };
    }

    const conversations = await this._conversationRepo.findConversationsByUser(
      userId
    );

    if (!conversations) throw new Error("Conversations Not Found");

    const responseData = await Promise.all(
      conversations.map(async (conv: any) => {
        const baseData: any = {
          _id: conv._id,
          type: conv.type,
          latestMessage: conv.latestMessage,
          unreadCounts: conv.unreadCounts,
          isDeleted: conv.isDeleted,
          typingUsers: conv.typingUsers || [],
        };

        if (conv.type === "group" && conv.groupId) {
          const group = await this._groupRepo.findGroupById(
            conv.groupId.toString()
          );
          if (group) {
            baseData.group = toPublicGroupDTO(group);
          }
        } else if (conv.type === "one-to-one") {
          const otherUser = conv.participants.find(
            (user: any) => user._id.toString() !== userId.toString()
          );
          const user = await this._userRepo.getUserById(
            otherUser ? otherUser._id.toString() : ""
          );
          if (!user) throw new Error("User not found");
          baseData.otherUser = toPublicUserDTO(user);
        }

        return baseData;
      })
    );

    return responseData;
  }

  async createOneToOne(userA: string, userB: string): Promise<string | null> {
    const existing = await this._conversationRepo.findOneToOne(userA, userB);
    if (existing) {
      return existing._id ? existing._id.toString() : "";
    }
    const created = await this._conversationRepo.createOneToOne(userA, userB);
    return created?._id ? created?._id.toString() ?? null : null;
  }

  async setTypingUser(
    conversationId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.setTypingUser(
      conversationId,
      userId
    );

    if (!conversation) throw new Error("Conversation Not Found");

    const typingUserIds = conversation.typingUsers || [];
    const typingUsers = await this._userRepo.findUsersByIds(typingUserIds);

    const publicTypingUsers = toPublicUserDTOs(typingUsers);

    const publicConversation = toPublicConversationDTO(
      conversation,
      publicTypingUsers
    );

    return publicConversation;
  }

  async removeTypingUser(
    conversationId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.removeTypingUser(
      conversationId,
      userId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async getTypingUsers(conversationId: string): Promise<any[]> {
    return this._conversationRepo.getTypingUsers(conversationId);
  }

  async addUnreadCountsForUsers(
    conversationId: string,
    userIds: string[]
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.addUnreadCountsForUsers(
      conversationId,
      userIds
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async markAsRead(
    conversationId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.markRead(
      conversationId,
      userId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async findConversationByGroup(
    groupId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.findConversationByGroup(
      groupId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async updateLastMessage(
    conversationId: string,
    messageId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.updateLastMessage(
      conversationId,
      messageId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }
  async getConversationById(
    conversationId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this._conversationRepo.findConversationById(
      conversationId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }
}
