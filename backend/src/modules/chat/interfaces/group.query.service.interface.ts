import { PublicGroupDTO } from "@modules/chat/dtos"

export interface IGroupQueryService {
  findByUser(userId: string): Promise<PublicGroupDTO[]>
  findGroupById(groupId: string): Promise<PublicGroupDTO | null>
  getAllGroups(filter: any): Promise<{ groups: PublicGroupDTO[]; totalItems: number }>
}
