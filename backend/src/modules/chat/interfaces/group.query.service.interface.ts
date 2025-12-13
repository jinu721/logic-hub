import { PublicGroupDTO } from "@modules/chat/dtos"
import { GroupAllInput } from "@shared/types"

export interface IGroupQueryService {
  findByUser(userId: string): Promise<PublicGroupDTO[]>
  findGroupById(groupId: string): Promise<PublicGroupDTO | null>
  getAllGroups(filter: GroupAllInput): Promise<{ groups: PublicGroupDTO[]; totalItems: number }>
}
