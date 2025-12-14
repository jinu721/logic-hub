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
  PublicGroupDTO
} from "@modules/chat/dtos";
import { ConversationDocument } from "@shared/types";

export class GroupMemberService
  extends BaseService<ConversationDocument, PublicConversationDTO>
  implements IGroupMemberService
{
  constructor(
    private readonly groupRepo: IGroupRepository,
    private readonly conversationRepo: IConversationRepository
  ) {
    super();
  }

  protected toDTO(conv: ConversationDocument): PublicConversationDTO {
    return toPublicConversationDTO(conv);
  }

  protected toDTOs(_: ConversationDocument[]): PublicConversationDTO[] {
    return [];
  }

  async addMembers(groupId: string, memberIds: string[]) {
    const group = await this.groupRepo.addMembers(groupId, memberIds);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const conv = await this.conversationRepo.addParticipants(groupId, group.members);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.mapOne(conv);
  }

  async removeMember(groupId: string, userId: string) {
    const removed = await this.groupRepo.removeMember(groupId, userId);
    if (!removed) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const conv = await this.conversationRepo.removeParticipants(groupId, [
      new Types.ObjectId(userId),
    ]);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.mapOne(conv);
  }

  async makeAdmin(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);
    const isMember = group.members.some(m => m.equals(uid));
    if (!isMember) throw new AppError(HttpStatus.BAD_REQUEST, "User not a member");

    group.members = group.members.filter(m => !m.equals(uid));
    group.admins.push(uid);

    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.mapOne(conv);
  }

  async removeAdmin(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);

    group.admins = group.admins.filter(a => !a.equals(uid));
    group.members.push(uid);

    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.mapOne(conv);
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
    const alreadyIn = [...group.members, ...group.admins].some(u => u.equals(uid));
    if (alreadyIn) throw new AppError(HttpStatus.CONFLICT, "User already in group");

    let updatedGroup = group;

    if (group.groupType === "public-open") {
      group.members.push(uid);
      updatedGroup = (await this.groupRepo.saveGroup(group))!;

      const conv = await this.conversationRepo.findConversationByGroup(groupId);
      if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

      conv.participants = Array.from(new Set([...conv.participants, uid])) as any;
      const saved = await this.conversationRepo.saveConversation(conv);

      return {
        updatedConversation: this.mapOne(saved),
        userId,
        conversationId: saved?._id,
        newGroupData: updatedGroup, 
      };
    }

    group.userRequests.push(uid);
    updatedGroup = (await this.groupRepo.saveGroup(group))!;

    const conv = await this.conversationRepo.findConversationByGroup(groupId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return {
      updatedConversation: null,
      userId,
      conversationId: conv._id as any,
      newGroupData: updatedGroup as any,
    };
  }

  async acceptJoinRequest(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);
    if (group.members.some(m => m.equals(uid)))
      throw new AppError(HttpStatus.CONFLICT, "Already a member");

    group.members.push(uid);
    group.userRequests = group.userRequests.filter(r => !r.equals(uid));
    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.findConversationById(conversationId);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    if (!conv.participants.some(p => p.equals(uid))) {
      (conv.participants as any).push(uid);
    }

    const saved = await this.conversationRepo.saveConversation(conv);
    return this.mapOne(saved );
  }

  async leaveGroup(conversationId: string, groupId: string, userId: string) {
    const group = await this.groupRepo.findGroupById(groupId);
    if (!group) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");

    const uid = new Types.ObjectId(userId);
    group.members = group.members.filter((m: Types.ObjectId) => !m.equals(uid));
    group.admins  = group.admins.filter((a: Types.ObjectId) => !a.equals(uid));
    await this.groupRepo.saveGroup(group);

    const conv = await this.conversationRepo.removeParticipants(groupId, [uid]);
    if (!conv) throw new AppError(HttpStatus.NOT_FOUND, "Conversation not found");

    return this.mapOne(conv);
  }
}
