import { BaseService } from "@core"
import { IGroupQueryService, IGroupRepository } from "@modules/chat"
import { GroupIF, GroupQueryFilter } from "@shared/types"
import { PublicGroupDTO, toPublicGroupDTO, toPublicGroupDTOs } from "@modules/chat/dtos"

export class GroupQueryService
  extends BaseService<GroupIF, PublicGroupDTO>
  implements IGroupQueryService {
  constructor(private readonly groupRepo: IGroupRepository) {
    super()
  }

  protected toDTO(entity: GroupIF): PublicGroupDTO {
    return toPublicGroupDTO(entity)
  }

  protected toDTOs(entities: GroupIF[]): PublicGroupDTO[] {
    return toPublicGroupDTOs(entities)
  }

  async findByUser(userId: string): Promise<PublicGroupDTO[]> {
    const query: Record<string, unknown> = { $or: [{ createdBy: userId }, { admins: userId }] }
    const groups = await this.groupRepo.getAllGroups(query, 0, 0)
    return this.mapMany(groups || [])
  }

  async findGroupById(groupId: string): Promise<PublicGroupDTO | null> {
    const group = await this.groupRepo.findGroupById(groupId)
    return group ? this.mapOne(group) : null
  }

  async getAllGroups(filter: GroupQueryFilter): Promise<{ groups: PublicGroupDTO[]; totalItems: number }> {
    const query: GroupQueryFilter = {}
    const page = filter.page ? Number(filter.page) : 1
    const limit = filter.limit ? Number(filter.limit) : 0
    const skip = (page - 1) * limit

    if (filter.type && filter.type !== "all") {
      query.groupType = filter.type
    }

    if (filter.search) {
      query.name = { $regex: filter.search, $options: "i" }
    }

    console.log("GROUP FETCHING STARTED WITH QUERY: ", query)

    const groups = await this.groupRepo.getAllGroups(query, skip, limit)
    const totalItems = await this.groupRepo.countAllGroups(query)

    console.log("GROUP FETCHING ENDED")

    return {
      groups: this.mapMany(groups),
      totalItems,
    }
  }
}
