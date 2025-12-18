import { Types } from 'mongoose';
import { GroupDocument, GroupQueryFilter } from '@shared/types';

export interface IGroupRepository {
  createGroup(data: Partial<GroupDocument>): Promise<GroupDocument>;
  findByUser(userId: string): Promise<GroupDocument[]>;
  getAllGroups(query: GroupQueryFilter, skip: number, limit: number): Promise<GroupDocument[] | null>;
  updateGroup(groupId: string, data: Partial<GroupDocument>): Promise<GroupDocument | null>;
  deleteGroup(groupId: string): Promise<GroupDocument | null>;
  addMembers(groupId: string, memberIds: string[]): Promise<GroupDocument | null>;
  removeMember(groupId: string, userId: string): Promise<GroupDocument | null>;
  addAdmin(groupId: string, userId: string): Promise<GroupDocument | null>;
  removeAdmin(groupId: string, userId: string): Promise<GroupDocument | null>;
  acceptJoinRequest(groupId: string, userId: string): Promise<GroupDocument | null>;
  updateGroupDetails(groupId: string, updatedData: Partial<GroupDocument>): Promise<GroupDocument | null>;
  getMembers(groupId: string): Promise<Types.ObjectId[] | null>;
  saveGroup(group: GroupDocument): Promise<GroupDocument | null>;
  sendJoinRequest(groupId: string, userId: string): Promise<GroupDocument | null>;
  leaveGroup(groupId: string, userId: string): Promise<GroupDocument | null>;
  findGroupById(groupId: string): Promise<GroupDocument | null>;
  countAllGroups(query: GroupQueryFilter): Promise<number>;
}
