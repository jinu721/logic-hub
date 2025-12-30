import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IGroupCommandService,
  IGroupRepository,
  IConversationRepository
} from "@modules/chat";
import {
  PublicGroupDTO,
  toPublicGroupDTO
} from "@modules/chat/dtos";
import { GroupIF, CreateGroupInput } from "@shared/types";
import { Types } from "mongoose";
import cloudinary from "@config/cloudinary.config";

export class GroupCommandService
  extends BaseService<GroupIF, PublicGroupDTO>
  implements IGroupCommandService
{
  constructor(
    private readonly groupRepo: IGroupRepository,
    private readonly conversationRepo: IConversationRepository
  ) {
    super();
  }

  protected toDTO(entity: GroupIF): PublicGroupDTO {
    return toPublicGroupDTO(entity);
  }

  protected toDTOs(_: GroupIF[]): PublicGroupDTO[] {
    return [];
  }

  async createGroup(data: CreateGroupInput, imageBuffer?: Buffer, userId?: string) {
    if (!userId) throw new AppError(HttpStatus.BAD_REQUEST, "userId is required");

    const createdBy = new Types.ObjectId(userId);

    if (imageBuffer) {
      const base64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
      const uploaded = await cloudinary.v2.uploader.upload(base64, { folder: "groupImages" });
      data.image = uploaded.secure_url;
    }

    const group = await this.groupRepo.createGroup({
      ...data,
      createdBy,
      admins: [createdBy],
      members: data.members ? data.members.map(id => new Types.ObjectId(id)) : [],
      userRequests: [],
      groupType: (data.groupType as 'public-open' | 'public-approval') || 'public-open',
    });

    if (!group) throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, "Group not created");

    await this.conversationRepo.createGroup([createdBy.toString()], group._id?.toString() ?? "");
    return this.mapOne(group);
  }

  async updateGroup(groupId: string, data: Partial<GroupIF>) {
    const updated = await this.groupRepo.updateGroup(groupId, data);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");
    return this.mapOne(updated);
  }

  async deleteGroup(groupId: string) {
    await this.groupRepo.deleteGroup(groupId);
    return true;
  }

  async updateGroupInfo(conversationId: string, groupId: string, data: Partial<GroupIF>) {
    const updated = await this.groupRepo.updateGroupDetails(groupId, data);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Group not found");
    return this.mapOne(updated);
  }
}
