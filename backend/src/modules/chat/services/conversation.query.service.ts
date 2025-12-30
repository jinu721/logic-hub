import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  PublicConversationDTO,
  toPublicConversationDTO,
  toPublicMessageDTO,
  PublicMessageDTO,
  PublicGroupDTO,
  toPublicGroupDTO,
} from "@modules/chat/dtos";
import {
  toPublicUserDTO,
  toPublicUserDTOs,
  PublicUserDTO,
} from "@modules/user/dtos";
import {
  IConversationQueryService,
  IConversationRepository,
  IGroupRepository,
} from "@modules/chat";
import {
  IUserRepository,
} from "@modules/user";

import { ConversationDocument, ConversationSearchFilter, PopulatedConversation } from "@shared/types";


export class ConversationQueryService
  extends BaseService<ConversationDocument, PublicConversationDTO>
  implements IConversationQueryService {
  constructor(
    private readonly conversationRepo: IConversationRepository,
    private readonly groupRepo: IGroupRepository,
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  protected toDTO(conv: ConversationDocument | PopulatedConversation): PublicConversationDTO {
    // If it's already populated, use the existing mapper
    if (this.isPopulatedConversation(conv)) {
      return toPublicConversationDTO(conv);
    }

    // Handle non-populated conversation
    const base = {
      _id: conv._id?.toString() || "",
      type: conv.type as 'group' | 'one-to-one',
      participants: [],
      latestMessage: null,
      isDeleted: conv.isDeleted,
      typingUsers: [],
      unreadCounts: conv.unreadCounts instanceof Map
        ? Object.fromEntries(conv.unreadCounts)
        : conv.unreadCounts || {},
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
    };

    return base;
  }

  private isPopulatedConversation(conv: ConversationDocument | PopulatedConversation): conv is PopulatedConversation {
    return conv.participants && conv.participants.length > 0 && 
           typeof conv.participants[0] === 'object' && 'username' in conv.participants[0];
  }

  protected toDTOs(convs: (ConversationDocument | PopulatedConversation)[]): PublicConversationDTO[] {
    return convs.map((c) => this.toDTO(c));
  }

  async findOneToOne(userA: string, userB: string) {
    const conv = await this.conversationRepo.findOneToOne(userA, userB);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.toDTO(conv);
  }

  async getConversationById(conversationId: string) {
    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.toDTO(conv);
  }

  async findConversation(conversationId: string, currentUserId: string) {
    if (!currentUserId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    let group: PublicGroupDTO | undefined;
    let otherUser: PublicUserDTO | undefined;

    if (conv.type === "group" && conv.groupId) {
      const found = await this.groupRepo.findGroupById(conv.groupId.toString());
      if (!found) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");
      group = toPublicGroupDTO(found);
    }

    if (conv.type === "one-to-one" && Array.isArray(conv.participants)) {
      const other = (conv.participants).find(
        (u) => u._id?.toString() !== currentUserId.toString()
      );
      if (other) {
        const user = await this.userRepo.getUserById(other._id.toString());
        if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
        otherUser = toPublicUserDTO(user);
      }
    }

    const dto = this.toDTO(conv);
    return {
      ...dto,
      group,
      otherUser,
      currentUserId,
    };
  }

  async findConversations(userId: string, search: ConversationSearchFilter) {
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const convs = await this.conversationRepo.findConversationsByUser(userId);
    if (!convs || convs.length === 0) return [];


    const result = await Promise.all(
      convs.map(async (conv: PopulatedConversation) => {
        let group: PublicGroupDTO | undefined;
        let otherUser: PublicUserDTO | undefined;

        if (conv.type === "group" && conv.groupId) {
          const found = await this.groupRepo.findGroupById(conv.groupId.toString());
          if (found) group = toPublicGroupDTO(found);
        } else if (conv.type === "one-to-one" && Array.isArray(conv.participants)) {
          const other = conv.participants.find(
            (u: unknown) => {
              if (u && typeof u === 'object' && '_id' in u) {
                return u._id?.toString() !== userId.toString();
              }
              return u?.toString() !== userId.toString();
            }
          );
          if (other) {
            const userId = other && typeof other === 'object' && '_id' in other 
              ? (other as { _id: unknown })._id?.toString() 
              : (other as string | undefined)?.toString();
            const user = await this.userRepo.getUserById(userId || "");
            if (user) otherUser = toPublicUserDTO(user);
          }
        }

        const dto = this.toDTO(conv);
        return { ...dto, group, otherUser };
      })
    );

    return result;
  }

  async findConversationByGroup(groupId: string) {
    const conv = await this.conversationRepo.findConversationByGroup(groupId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.toDTO(conv);
  }
}