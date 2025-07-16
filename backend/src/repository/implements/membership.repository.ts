import { UpdateQuery } from "mongoose";
import { BaseRepository } from "../base.repository";
import { IMembershipRepository } from "../interfaces/membership.repository.interface";
import { PremiumPlan } from "../../models/membership.model";
import { MembershipIF } from "../../types/membership.types";
export class MembershipRepository
  extends BaseRepository<MembershipIF>
  implements IMembershipRepository
{
  constructor() {
    super(PremiumPlan);
  }

  async createPlan(data: Partial<MembershipIF>): Promise<MembershipIF> {
    return await this.model.create(data);
  }

  async getAllPlans(search:string,skip:number,limit:number): Promise<MembershipIF[]> {
    return await this.model.find({name:{$regex:search,$options:"i"}}).skip(skip).limit(limit).sort({ _id: -1 });
  }

  async getTwoActivePlans(): Promise<MembershipIF[]> {
    return await this.model.find({ isActive: true }).limit(2);
  }

  async countAllPlans(search:string): Promise<number> {
    return await this.model.countDocuments({name:{$regex:search,$options:"i"}});
  }

  async getPlanById(id: string): Promise<MembershipIF | null> {
    return await this.model.findById(id);
  }

  async updatePlan(id: string, update: UpdateQuery<MembershipIF>): Promise<MembershipIF | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deletePlan(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
