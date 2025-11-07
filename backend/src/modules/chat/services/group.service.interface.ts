import { GroupIF } from "../../shared/types/group.types";
import { Types } from "mongoose";
import { PublicGroupDTO } from "../../mappers/group.dto";
import { PublicConversationDTO } from "../../mappers/conversation.dto";

export interface IGroupService {
  createGroup(data: Partial<GroupIF>, imageBuffer?: Buffer, userId?: string): Promise<PublicGroupDTO>;
  findByUser(userId: string): Promise<PublicGroupDTO[]>;
  findGroupById(groupId: string): Promise<PublicGroupDTO | null>;
  getAllGroups(ilter:any): Promise<{groups:PublicGroupDTO[],totalItems:number}>;
  updateGroup(groupId: string, data: Partial<GroupIF>): Promise<PublicGroupDTO | null>;
  deleteGroup(groupId: string): Promise<PublicConversationDTO | null>;

  addMembers(groupId: string, memberIds: string[]): Promise<PublicConversationDTO | null>;
  removeMember(groupId: string, userId: string): Promise<PublicConversationDTO | null>;

  makeAdmin(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>;
  removeAdmin(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>;
  updateGroupInfo(conversationId: string, groupId: string, data: Partial<GroupIF>): Promise<PublicConversationDTO | null>;

  sendJoinRequest(groupId: string, userId: string): Promise<{
    updatedConversation: PublicConversationDTO | null;
    userId: string;
    conversationId: Types.ObjectId | null;
    newGroupData: PublicGroupDTO;
  }>;

  acceptJoinRequest(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>;
  leaveGroup(conversationId: string, groupId: string, userId: string): Promise<PublicConversationDTO | null>;
}
