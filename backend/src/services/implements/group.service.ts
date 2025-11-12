import {  Types } from "mongoose";
import { IGroupService } from "../interfaces/group.service.interface";
import { GroupIF } from "../../shared/types/group.types";
import { ConversationIF } from "../../shared/types/conversation.types";
import cloudinary from "../../config/cloudinary.config";
import {
  PublicGroupDTO,
  toPublicGroupDTO,
  toPublicGroupDTOs,
} from "../../mappers/group.dto";
import {
  PublicConversationDTO,
  toPublicConversationDTO,
} from "../../mappers/conversation.dto";
import { IGroupRepository } from "../../repository/interfaces/group.repository.interface";
import { IConversationRepository } from "../../repository/interfaces/conversation.repository.interface";

export class GroupService implements IGroupService {
  constructor(
    private readonly _groupRepo: IGroupRepository,
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async createGroup(
    data: Partial<GroupIF>,
    imageBuffer?: Buffer,
    userId?: string
  ): Promise<PublicGroupDTO> {
    if (!userId) throw new Error("userId is required");
    const createdBy = new Types.ObjectId(userId);

    if (imageBuffer) {
      const base64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
      const uploaded = await cloudinary.v2.uploader.upload(base64, {
        folder: "groupImages",
      });
      data.image = uploaded.secure_url;
    }

    const group = await this._groupRepo.createGroup({
      ...data,
      createdBy,
      admins: [createdBy],
      members: [],
      userRequests: [],
    });

    if (!group) throw new Error("Group not created");

    await this._conversationRepo.createGroup([createdBy.toString()], group._id ? group._id.toString() : "");
    return toPublicGroupDTO(group);
  }

  async findByUser(userId: string): Promise<PublicGroupDTO[]> {
    const groups = await this._groupRepo.findByUser(userId);
    return toPublicGroupDTOs(groups);
  }

  async findGroupById(groupId: string): Promise<PublicGroupDTO | null> {
    const group = await this._groupRepo.findGroupById(groupId);
    return toPublicGroupDTO(group as GroupIF);
  }

  async getAllGroups(filter:any): Promise<{groups:PublicGroupDTO[],totalItems:number}> {
    const query:any = {};
    const page = filter.page ? filter.page : 1;
    const limit = filter.limit ? filter.limit : 0;
    const skip = (page-1) * filter.limit;

    if(filter.type && filter.type !== "all"){
      query.groupType = filter.type
    }
    if(filter.search){
      query.name = { $regex: filter.search, $options: "i" };
    }

    const groups = await this._groupRepo.getAllGroups(query,skip,limit);
    const totalItems = await this._groupRepo.countAllGroups(query);
    return {groups:toPublicGroupDTOs(groups as GroupIF[]),totalItems};
  }


  async updateGroup(
    groupId: string,
    data: Partial<GroupIF>
  ): Promise<PublicGroupDTO | null> {
    const updated = await this._groupRepo.updateGroup(groupId, data);
    return toPublicGroupDTO(updated as GroupIF);
  }

  async deleteGroup(groupId: string): Promise<PublicConversationDTO | null> {
    await this._groupRepo.deleteGroup(groupId);
    const conv = await this._conversationRepo.softDeleteByGroupId(groupId);
    return toPublicConversationDTO(conv as ConversationIF);
  }

  async addMembers(
    groupId: string,
    memberIds: string[]
  ): Promise<PublicConversationDTO | null> {
    const group = await this._groupRepo.addMembers(groupId, memberIds);
    if (!group) throw new Error("Group not found");
    const conv = await this._conversationRepo.addParticipants(
      groupId,
      group.members
    );
    return toPublicConversationDTO(conv as ConversationIF);
  }

  async removeMember(
    groupId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    await this._groupRepo.removeMember(groupId, userId);
    const conv = await this._conversationRepo.removeParticipants(groupId, [
      new Types.ObjectId(userId),
    ]);
    return toPublicConversationDTO(conv as ConversationIF);
  }

  async makeAdmin(
    conversationId: string,
    groupId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const group = await this._groupRepo.findGroupById(groupId);
    if (!group) throw new Error("Group not found");

    const memberId = new Types.ObjectId(userId);
    if (!group.members.some((m) => m.equals(memberId)))
      throw new Error("User not a member");

    group.members = group.members.filter((m) => !m.equals(memberId));
    group.admins.push(memberId);
    await this._groupRepo.saveGroup(group);

    const conv = await this._conversationRepo.findConversationById(
      conversationId
    );
    return toPublicConversationDTO(conv as ConversationIF);
  }

  async removeAdmin(
    conversationId: string,
    groupId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const group = await this._groupRepo.findGroupById(groupId);
    if (!group) throw new Error("Group not found");

    const adminId = new Types.ObjectId(userId);
    group.admins = group.admins.filter((a) => !a.equals(adminId));
    group.members.push(adminId);
    await this._groupRepo.saveGroup(group);

    const conv = await this._conversationRepo.findConversationById(
      conversationId
    );
    return toPublicConversationDTO(conv as ConversationIF);
  }

  async updateGroupInfo(
    conversationId: string,
    groupId: string,
    data: Partial<GroupIF>
  ): Promise<PublicConversationDTO | null> {
    await this._groupRepo.updateGroupDetails(groupId, data);
    const conv = await this._conversationRepo.findConversationById(
      conversationId
    );
    return toPublicConversationDTO(conv as ConversationIF);
  }

  async sendJoinRequest(
    groupId: string,
    userId: string
  ): Promise<{
    updatedConversation: PublicConversationDTO | null;
    userId: string;
    conversationId: Types.ObjectId | null;
    newGroupData: PublicGroupDTO;
  }> {
    const group = await this._groupRepo.findGroupById(groupId);
    if (!group) throw new Error("Group not found");

    const userObjectId = new Types.ObjectId(userId);

    const already = [...group.members, ...group.admins].some((u) =>
      u.equals(userObjectId)
    );

    if (already) throw new Error("User already in group");

    let updatedGroup = group;
    if (group.groupType === "public-open") {
      group.members.push(userObjectId);
      updatedGroup = (await this._groupRepo.saveGroup(group)) as GroupIF;


      const conv = await this._conversationRepo.findConversationByGroup(groupId);
      if (!conv) throw new Error("Conversation not found");
      conv.participants = Array.from(
        new Set([...conv.participants, userObjectId])
      );
      await this._conversationRepo.saveConversation(conv);

      return {
        updatedConversation: toPublicConversationDTO(conv),
        userId,
        conversationId: conv._id as Types.ObjectId,
        newGroupData: toPublicGroupDTO(updatedGroup),
      };
    }

    group.userRequests.push(userObjectId);
    updatedGroup = (await this._groupRepo.saveGroup(group)) as GroupIF;
    const conv = await this._conversationRepo.findConversationByGroup(groupId);
    if(!conv) throw new Error("Conversation not found");
    return {
      updatedConversation: null,
      userId,
      conversationId: conv._id as Types.ObjectId,
      newGroupData: toPublicGroupDTO(updatedGroup),
    };
  }

  async acceptJoinRequest(
    conversationId: string,
    groupId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const group = await this._groupRepo.findGroupById(groupId);
    if (!group) throw new Error("Group not found");

    const uid = new Types.ObjectId(userId);
    if (group.members.some((m) => m.equals(uid)))
      throw new Error("Already member");

    group.members.push(uid);
    group.userRequests = group.userRequests.filter((r) => !r.equals(uid));
    await this._groupRepo.saveGroup(group);

    const conv = await this._conversationRepo.findConversationById(
      conversationId
    );
    if (!conv) throw new Error("Conversation not found");

    if (!conv.participants.some((p) => p.equals(uid))) {
      conv.participants.push(uid);
    }
    const updatedConv = await this._conversationRepo.saveConversation(conv);
    return toPublicConversationDTO(updatedConv as ConversationIF);
  }

  async leaveGroup(
    conversationId: string,
    groupId: string,
    userId: string
  ): Promise<PublicConversationDTO | null> {
    const group = await this._groupRepo.findGroupById(groupId);
    if (!group) throw new Error("Group not found");

    const uid = new Types.ObjectId(userId);
    group.members = group.members.filter((m) => !m.equals(uid));
    group.admins = group.admins.filter((a) => !a.equals(uid));
    await this._groupRepo.saveGroup(group);

    const conv = await this._conversationRepo.removeParticipants(groupId, [uid]);
    return toPublicConversationDTO(conv as ConversationIF);
  }
}
