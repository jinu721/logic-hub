import { Types } from "mongoose";
import { Group, IGroupRepository } from "@modules/chat";
import { GroupIF } from "@shared/types";
import { BaseRepository } from "@core";


export class GroupRepository
  extends BaseRepository<GroupIF>
  implements IGroupRepository
{
  constructor() {
    super(Group);
  }
  async createGroup(data: Partial<GroupIF>): Promise<GroupIF> {
    return this.model.create(data);
  }

  async findByUser(userId: string): Promise<GroupIF[]> {
    return this.model.find({
      $or: [{ createdBy: userId }, { admins: userId }],
    });
  }

async findGroupById(groupId: string): Promise<GroupIF | null> {
  return this.model
    .findById(groupId)
    .populate({
      path: "members",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "admins",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "createdBy",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "userRequests",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "voiceRoom.host",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "voiceRoom.participants",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "voiceRoom.mutedUsers",
      populate: [{ path: "avatar" }, { path: "banner" }],
    });
}


  async getAllGroups(query: any,skip:number,limit:number): Promise<GroupIF[] | null> {
    return this.model.find(query)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "members",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "admins",
      populate: [{ path: "avatar" }, { path: "banner" }],
    })
    .populate({
      path: "createdBy",
      populate: [{ path: "avatar" }, { path: "banner" }],
    });
  }

   async countAllGroups(filter:any):Promise<number> {
    return this.model.countDocuments(filter);
   }

  async updateGroup(
    groupId: string,
    data: Partial<GroupIF>
  ): Promise<GroupIF | null> {
    return this.model.findByIdAndUpdate(groupId, data, { new: true });
  }

  async deleteGroup(groupId: string): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      { isDeleted: true},
      { new: true }
    );
  }
  

  async addMembers(groupId: string, memberIds: string[]): Promise<GroupIF | null> {
    return this.model.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: { $each: memberIds } } },
      { new: true }
    );
  }
  

  async removeMember(groupId: string, userId: string): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          members: userId,
          admins: userId,
        },
      },
      { new: true }
    );
  }
  
  async addAdmin(groupId: string, userId: string): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      { $push: { admins: userId } },
      { new: true }
    );
  }

  async removeAdmin(groupId: string, userId: string): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(groupId, {
      $pull: { admins: userId },
    });
  }

  async updateGroupDetails(
    groupId: string,
    updatedData: Partial<GroupIF>
  ): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(groupId, updatedData, {
      new: true,
    });
  }

  async getMembers(groupId: string): Promise<Types.ObjectId[] | null> {
    const group = await this.model.findById(groupId);
    return group ? group.members : null;
  }

  async saveGroup(group: GroupIF): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(group._id, group, { new: true });
  }

  async sendJoinRequest(
    groupId: string,
    userId: string
  ): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      { $push: { userRequests: userId } },
      { new: true }
    );
  }

  async acceptJoinRequest(
    groupId: string,
    userId: string
  ): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      {
        $pull: { userRequests: userId },
        $push: { members: userId },
      },
      { new: true }
    );
  }

  async leaveGroup(groupId: string, userId: string): Promise<GroupIF | null> {
    return await this.model.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    );
  }
}
