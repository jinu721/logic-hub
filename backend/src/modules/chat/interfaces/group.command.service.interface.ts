import { PublicGroupDTO } from "@modules/chat/dtos"
import { CreateGroupInput, UpdateGroupInput, UpdateGroupInfoInput } from "@shared/types"

export interface IGroupCommandService {
  createGroup(data: CreateGroupInput, imageBuffer?: Buffer, userId?: string): Promise<PublicGroupDTO>
  updateGroup(groupId: string, data: UpdateGroupInput): Promise<PublicGroupDTO | null>
  deleteGroup(groupId: string): Promise<boolean>
  updateGroupInfo(conversationId: string, groupId: string, data: UpdateGroupInfoInput): Promise<PublicGroupDTO | null>
}
