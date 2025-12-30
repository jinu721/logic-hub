import { Types } from "mongoose";
import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IGroupMemberService,
  IGroupRepository,
  IConversationRepository
} from "@modules/chat";
import {
  PublicConversationDTO,
  toPublicConversationDTO,
  PublicGroupDTO,
  toPublicGroupDTO
} from "@modules/chat/dtos";
import { ConversationDocument, PopulatedConversation } from "@shared/types";

export class GroupMemberService
  extends BaseService<ConversationDocument, PublicConversationDTO>
  implements IGroupMemberService {
  constructor(
    private readonly groupRepo: IGroupRepository,
    private readonly conversationRepo: IConversationRepository
  ) {
    super();
  }

  protected toDTO(conv: ConversationDocument | PopulatedConversation): PublicConversationDTO {
    if (this.isPopulatedConversation(conv)) {
      return toPublicConversationDTO(conv);
    }
    
    // Handle non-populated conversation
    return {
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
  }

  private isPopulatedConversation(conv: unknown): conv is PopulatedConversation {
    return conv !== null && typeof conv === 'object' && 'participants' in conv && 
           Array.isArray((conv as PopulatedConversation).participants) && 
           (conv as PopulatedConversation).participants.length > 0 && 
           typeof (conv as PopulatedConversation).participants[0] === 'object' && 
           'username' in (conv as PopulatedConversation).participants[0];
  }

  protected toDTOs(_: ConversationDocument[]): PublicConversationDTO[] {
    return [];
  }

  async addMembers(groupId: string, memberIds: string[]) {
    const group = await this.groupRepo.addMembers(groupId, memberIds);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const conv = await this.conversationRepo.addParticipants(groupId, group.members);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.toDTO(conv);
  }

  async removeMember(groupId: string, userId: string) {
    const removed = await this.groupRepo.removeMember(groupId, userId);
    if (!removed) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const conv = await this.conversationRepo.removeParticipants(groupId, [
      new Types.ObjectId(userId),
    ]);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.toDTO(conv);
  }

  async makeAdmin(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);
    const isMember = group.members.some((m) => (m._id || m).toString() === userId);
    if (!isMember) throw new AppError(HttpStatus.BAD_REQUEST, "User not a member");

    group.members = group.members.filter((m) => (m._id || m).toString() !== userId);

    const isAdmin = group.admins.some((a) => (a._id || a).toString() === userId);
    if (!isAdmin) {
      group.admins.push(uid);
    }

    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.toDTO(conv);
  }

  async removeAdmin(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);

    group.admins = group.admins.filter((a) => (a._id || a).toString() !== userId);

    const isMember = group.members.some((m) => (m._id || m).toString() === userId);
    if (!isMember) {
      group.members.push(uid);
    }

    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.toDTO(conv);
  }

  async sendJoinRequest(groupId: string, userId: string): Promise<{
    updatedConversation: PublicConversationDTO | null;
    userId: string;
    conversationId: string;
    newGroupData: PublicGroupDTO;
  }> {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);
    const alreadyIn = [...group.members, ...group.admins].some((u) => (u._id || u).toString() === userId);
    if (alreadyIn) throw new AppError(HttpStatus.CONFLICT, "User already in group");

    let updatedGroup = group;

    if (group.groupType === "public-open") {
      group.members.push(uid);
      updatedGroup = (await this.groupRepo.saveGroup(group))!;

      const conv = await this.conversationRepo.findConversationByGroup(groupId);
      if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

      // Handle participants properly - check if it's populated or not
      if (this.isPopulatedConversation(conv)) {
        // For populated conversation, we need to add the user ID to the participants array
        // This is a type issue - we can't directly add ObjectId to PopulatedUser[]
        // We need to refetch the conversation after adding the participant
        await this.conversationRepo.addParticipants(groupId, [uid]);
        const refreshedConv = await this.conversationRepo.findConversationById(conv._id.toString());
        if (!refreshedConv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
        
        return {
          updatedConversation: this.toDTO(refreshedConv),
          userId,
          conversationId: refreshedConv._id.toString(),
          newGroupData: toPublicGroupDTO(updatedGroup),
        };
      } else {
        // For non-populated conversation, handle participants as ObjectId[]
        const nonPopulatedConv = conv as ConversationDocument;
        const currentParticipants = nonPopulatedConv.participants as Types.ObjectId[];
        nonPopulatedConv.participants = Array.from(new Set([...currentParticipants.map(p => p.toString()), uid.toString()])).map(id => new Types.ObjectId(id));
        const saved = await this.conversationRepo.saveConversation(nonPopulatedConv);

        return {
          updatedConversation: saved ? this.toDTO(saved) : null,
          userId,
          conversationId: saved?._id?.toString() || "",
          newGroupData: toPublicGroupDTO(updatedGroup),
        };
      }
    }

    group.userRequests.push(uid);
    updatedGroup = (await this.groupRepo.saveGroup(group))!;

    const conv = await this.conversationRepo.findConversationByGroup(groupId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return {
      updatedConversation: null,
      userId,
      conversationId: conv._id.toString(),
      newGroupData: toPublicGroupDTO(updatedGroup),
    };
  }

  async acceptJoinRequest(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);
    if (group.members.some((m) => (m._id || m).toString() === userId))
      throw new AppError(HttpStatus.CONFLICT, "Already a member");

    group.members.push(uid);
    group.userRequests = group.userRequests.filter((r) => (r._id || r).toString() !== userId);
    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    // Handle participants properly
    if (this.isPopulatedConversation(conv)) {
      // For populated conversation, use the repository method to add participants
      await this.conversationRepo.addParticipants(conversationId, [uid]);
      const refreshedConv = await this.conversationRepo.findConversationById(conversationId);
      if (!refreshedConv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");
      return this.toDTO(refreshedConv);
    } else {
      // For non-populated conversation, handle participants as ObjectId[]
      const nonPopulatedConv = conv as ConversationDocument;
      const currentParticipants = nonPopulatedConv.participants as Types.ObjectId[];
      if (!currentParticipants.some((p) => p.toString() === userId)) {
        currentParticipants.push(uid);
      }
      const saved = await this.conversationRepo.saveConversation(nonPopulatedConv);
      return saved ? this.toDTO(saved) : this.toDTO(nonPopulatedConv);
    }
  }

  async leaveGroup(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);
    group.members = group.members.filter((m) => (m._id || m).toString() !== userId);
    group.admins = group.admins.filter((a) => (a._id || a).toString() !== userId);
    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.removeParticipants(groupId, [uid]);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.toDTO(conv);
  }
}
