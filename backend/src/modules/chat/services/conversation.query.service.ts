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

import { ConversationIF } from "@shared/types";


export class ConversationQueryService
  extends BaseService<ConversationIF, PublicConversationDTO>
  implements IConversationQueryService
{
  constructor(
    private readonly conversationRepo: IConversationRepository,
    private readonly groupRepo: IGroupRepository,
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  protected toDTO(conv: ConversationIF): PublicConversationDTO {
    const base = toPublicConversationDTO(conv);

    const participants = Array.isArray(conv.participants)
      ? toPublicUserDTOs(conv.participants as any)
      : [];

    const typingUsers = Array.isArray(conv.typingUsers)
      ? toPublicUserDTOs(conv.typingUsers as any)
      : [];

    const latestMessage = conv.latestMessage
      ? (toPublicMessageDTO(conv.latestMessage as any) as PublicMessageDTO)
      : undefined;

    return {
      ...base,
      participants,
      typingUsers,
      latestMessage,
    };
  }

  protected toDTOs(convs: ConversationIF[]): PublicConversationDTO[] {
    return convs.map((c) => this.toDTO(c));
  }

  async findOneToOne(userA: string, userB: string) {
    const conv = await this.conversationRepo.findOneToOne(userA, userB);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(conv);
  }

  async getConversationById(conversationId: string) {
    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
    return this.mapOne(conv);
  }

  async findConversation(conversationId: string, currentUserId: string) {
    if (!currentUserId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    // enrich for group / one-to-one “other side” details using strict DTOs
    let group: PublicGroupDTO | undefined;
    let otherUser: PublicUserDTO | undefined;

    if (conv.type === "group" && conv.groupId) {
      const found = await this.groupRepo.findGroupById(conv.groupId.toString());
      if (!found) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");
      group = toPublicGroupDTO(found);
    }

    if (conv.type === "one-to-one" && Array.isArray(conv.participants)) {
      const other = (conv.participants as any[]).find(
        (u) => u._id?.toString() !== currentUserId.toString()
      );
      if (other) {
        const user = await this.userRepo.getUserById(other._id.toString());
        if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
        otherUser = toPublicUserDTO(user);
      }
    }

    const dto = this.mapOne(conv);
    return {
      ...dto,
      group,
      otherUser,
      currentUserId,
    };
  }

  async findConversations(userId: string, search: any) {
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const convs = await this.conversationRepo.findConversationsByUser(userId);
    if (!convs || convs.length === 0) return [];

    
    const result = await Promise.all(
      convs.map(async (conv: any) => {
        let group: PublicGroupDTO | undefined;
        let otherUser: PublicUserDTO | undefined;

        if (conv.type === "group" && conv.groupId) {
          const found = await this.groupRepo.findGroupById(conv.groupId.toString());
          if (found) group = toPublicGroupDTO(found);
        } else if (conv.type === "one-to-one" && Array.isArray(conv.participants)) {
          const other = conv.participants.find(
            (u: any) => u._id?.toString() !== userId.toString()
          );
          if (other) {
            const user = await this.userRepo.getUserById(other._id.toString());
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
    return this.mapOne(conv);
  }
}
