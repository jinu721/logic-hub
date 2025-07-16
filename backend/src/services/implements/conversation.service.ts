import { IConversationService } from "../interfaces/conversation.service.interface";
import { ConversationRepository } from "../../repository/implements/conversation.repository";
import { GroupRepository } from "../../repository/implements/group.repository";
import { UserRepository } from "../../repository/implements/user.repository";
import {
  PublicConversationDTO,
  toPublicConversationDTO,
} from "../../mappers/conversation.dto";
import { ConversationIF } from "../../types/conversation.types";
import { toPublicGroupDTO } from "../../mappers/group.dto";
import { toPublicUserDTO, toPublicUserDTOs } from "../../mappers/user.dto";

export class ConversationService implements IConversationService {
  private conversationRepo: ConversationRepository;
  private groupRepo: GroupRepository;
  private userRepo: UserRepository;

  constructor(
    conversationRepo: ConversationRepository,
    groupRepo: GroupRepository,
    userRepo: UserRepository
  ) {
    this.conversationRepo = conversationRepo;
    this.groupRepo = groupRepo;
    this.userRepo = userRepo;
  }

  async findOneToOne(
    userA: string,
    userB: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this.conversationRepo.findOneToOne(userA, userB);
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async findConversation(
    conversationId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    if (!userId) throw new Error("Invalid Token");

    const conversation = await this.conversationRepo.findConversationById(
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
      const group = await this.groupRepo.findGroupById(
        conversation.groupId ? conversation.groupId.toString() : ""
      );
      if (!group) throw new Error("Group not found");
      responseData.group = toPublicGroupDTO(group);
    } else if (conversation.type === "one-to-one") {
      const otherUser = conversation.participants.find(
        (user: any) => user._id.toString() !== userId.toString()
      );

      const user = await this.userRepo.getUserById(
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

    const query:any = {}

    if(search.search){
      query.name = { $regex: search.search, $options: "i" };
    }

    const conversations = await this.conversationRepo.findConversationsByUser(
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
          const group = await this.groupRepo.findGroupById(
            conv.groupId.toString()
          );
          if (group) {
            baseData.group = toPublicGroupDTO(group);
          }
        } else if (conv.type === "one-to-one") {
          const otherUser = conv.participants.find(
            (user: any) => user._id.toString() !== userId.toString()
          );
          const user = await this.userRepo.getUserById(
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
    const existing = await this.conversationRepo.findOneToOne(userA, userB);
    if (existing) {
      return existing._id ? existing._id.toString() : "";
    }
    const created = await this.conversationRepo.createOneToOne(userA, userB);
    return created?._id ? created?._id.toString() ?? null : null;
  }

  async setTypingUser(
    conversationId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this.conversationRepo.setTypingUser(
      conversationId,
      userId
    );

    if (!conversation) throw new Error("Conversation Not Found");

    const typingUserIds = conversation.typingUsers || [];
    const typingUsers = await this.userRepo.findUsersByIds(typingUserIds);

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
    const conversation = await this.conversationRepo.removeTypingUser(
      conversationId,
      userId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async getTypingUsers(conversationId: string): Promise<any[]> {
    return this.conversationRepo.getTypingUsers(conversationId);
  }

  async addUnreadCountsForUsers(
    conversationId: string,
    userIds: string[]
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this.conversationRepo.addUnreadCountsForUsers(
      conversationId,
      userIds
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async markAsRead(
    conversationId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this.conversationRepo.markRead(
      conversationId,
      userId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async findConversationByGroup(
    groupId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this.conversationRepo.findConversationByGroup(
      groupId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }

  async updateLastMessage(
    conversationId: string,
    messageId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this.conversationRepo.updateLastMessage(
      conversationId,
      messageId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }
  async getConversationById(
    conversationId: string
  ): Promise<PublicConversationDTO | null> {
    const conversation = await this.conversationRepo.findConversationById(
      conversationId
    );
    return toPublicConversationDTO(conversation as ConversationIF);
  }
}
