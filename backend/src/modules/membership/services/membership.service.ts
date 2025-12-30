import { MembershipIF, DiscountIF } from "@shared/types";
import {
  IMembershipService,
  PublicMembershipDTO,
  toPublicMembershipDTO,
  toPublicMembershipDTOs,
  IMembershipRepository,
  CreateMembershipDto,
  UpdateMembershipDto
} from "@modules/membership";
import { HttpStatus } from "@constants";
import { AppError} from "@utils/application";
import { BaseService } from "@core";

export class MembershipService
  extends BaseService<MembershipIF, PublicMembershipDTO>
  implements IMembershipService
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

  async createPlan(data: CreateMembershipDto) {
    // Convert DTO to document data
    const planData = {
      name: data.name,
      price: data.price,
      description: data.description,
      type: data.type as "silver" | "gold",
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      features: data.features,
      discount: data.discount as DiscountIF
    };
    
    const plan = await this.membershipRepo.createPlan(planData)
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

  async updatePlan(id: string, data: UpdateMembershipDto) {
    if (data.name) {
      const exists = await this.membershipRepo.findOne({
        name: data.name,
        _id: { $ne: id }
      })

      if (exists) {
        throw new AppError(HttpStatus.CONFLICT, "Membership already exists")
      }
    }

    // Convert DTO to document data with proper type handling
    const updateData = {
      ...(data.name && { name: data.name }),
      ...(data.price && { price: data.price }),
      ...(data.description && { description: data.description }),
      ...(data.type && { type: data.type as "silver" | "gold" }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
      ...(data.features && { features: data.features }),
      ...(data.discount !== undefined && { discount: data.discount || undefined })
    };

    const updated = await this.membershipRepo.updatePlan(id, updateData)
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
