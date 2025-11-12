import { Types } from 'mongoose';
import { GroupIF } from '@shared/types';

export interface IGroupRepository {
  createGroup(data: Partial<GroupIF>): Promise<GroupIF>;
  findByUser(userId: string): Promise<GroupIF[]>;
  getAllGroups(qury: any,skip: number,limit:number): Promise<GroupIF[] | null>;
  updateGroup(groupId: string, data: Partial<GroupIF>): Promise<GroupIF | null>;
  deleteGroup(groupId: string): Promise<GroupIF | null>;
  addMembers(groupId: string, memberIds: string[]): Promise<GroupIF | null>;
  removeMember(groupId: string, userId: string): Promise<GroupIF | null>;
  addAdmin(groupId: string, userId: string): Promise<GroupIF | null>;
  removeAdmin(groupId: string, userId: string): Promise<GroupIF | null>;
  acceptJoinRequest(groupId: string, userId: string): Promise<GroupIF | null>;
  updateGroupDetails(groupId: string, updatedData: Partial<GroupIF>): Promise<GroupIF | null>;
  getMembers(groupId: string): Promise<Types.ObjectId[] | null>;
  saveGroup(group: GroupIF): Promise<GroupIF | null>;
  sendJoinRequest(groupId: string, userId: string): Promise<GroupIF | null>;
  leaveGroup(groupId: string, userId: string): Promise<GroupIF | null>;
  findGroupById(groupId: string): Promise<GroupIF | null>;
  countAllGroups(query: any): Promise<number>;
}
