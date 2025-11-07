import { MembershipIF } from "@shared/types";
import {
  IMembershipService,
  PublicMembershipDTO,
  toPublicMembershipDTO,
  toPublicMembershipDTOs,
  IMembershipRepository
} from "@modules/membership";
import { HttpStatus } from "@constants";
import { AppError} from "@utils/application";
import { BaseService } from "@core";

export class MembershipService
  extends BaseService<MembershipIF, PublicMembershipDTO>
{
  constructor(private readonly membershipRepo: IMembershipRepository) {
    super()
  }

  protected toDTO(plan: MembershipIF): PublicMembershipDTO {
    return toPublicMembershipDTO(plan)
  }

  protected toDTOs(plans: MembershipIF[]): PublicMembershipDTO[] {
    return toPublicMembershipDTOs(plans)
  }

  async createPlan(data: Partial<MembershipIF>) {
    const plan = await this.membershipRepo.createPlan(data)
    return this.mapOne(plan)
  }

  async getAllPlans(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit

    const plans  = await this.membershipRepo.getAllPlans(search, skip, limit)
    const totalItems = await this.membershipRepo.countAllPlans(search)

    return { items: this.mapMany(plans), totalItems }
  }

  async getTwoActivePlans() {
    const plans = await this.membershipRepo.getTwoActivePlans()
    return this.mapMany(plans)
  }

  async getPlanById(id: string) {
    const plan = await this.membershipRepo.getPlanById(id)
    if (!plan) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found")
    }
    return this.mapOne(plan)
  }

  async updatePlan(id: string, data: Partial<MembershipIF>) {
    const exists = await this.membershipRepo.findOne({
      name: data.name,
      _id: { $ne: id }
    })

    if (exists) {
      throw new AppError(HttpStatus.CONFLICT, "Membership already exists")
    }

    const updated = await this.membershipRepo.updatePlan(id, data)
    if (!updated) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found")
    }

    return this.mapOne(updated)
  }

  async deletePlan(id: string) {
    const deleted = await this.membershipRepo.deletePlan(id)
    if (!deleted) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found")
    }
    return true
  }
}
