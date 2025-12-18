import { UpdateQuery } from "mongoose";
import { BaseRepository } from "@core";
import { IMembershipRepository, MembershipModel } from "@modules/membership";
import { MembershipDocument } from "@shared/types";


export class MembershipRepository
  extends BaseRepository<MembershipDocument>
  implements IMembershipRepository
{
  constructor() {
    super(MembershipModel);
  }

  async createPlan(data: Partial<MembershipDocument>): Promise<MembershipDocument> {
    return await this.model.create(data);
  }

  async getAllPlans(search:string,skip:number,limit:number): Promise<MembershipDocument[]> {
    return await this.model.find({name:{$regex:search,$options:"i"}}).skip(skip).limit(limit).sort({ _id: -1 });
  }

  async getTwoActivePlans(): Promise<MembershipDocument[]> {
    return await this.model.find({ isActive: true }).limit(2);
  }

  async countAllPlans(search:string): Promise<number> {
    return await this.model.countDocuments({name:{$regex:search,$options:"i"}});
  }

  async getPlanById(id: string): Promise<MembershipDocument | null> {
    return await this.model.findById(id);
  }

  async updatePlan(id: string, update: UpdateQuery<MembershipDocument>): Promise<MembershipDocument | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async deletePlan(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
