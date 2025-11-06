import { UpdateQuery } from "mongoose";
import { MembershipIF } from "../../shared/types/membership.types";

export interface IMembershipRepository {
  createPlan(data: Partial<MembershipIF>): Promise<MembershipIF>;
  getAllPlans(search:string,skip:number,limit:number): Promise<MembershipIF[]>;
  getTwoActivePlans(): Promise<MembershipIF[]>;
  countAllPlans(search:string): Promise<number>;
  getPlanById(id: string): Promise<MembershipIF | null>;
  updatePlan(id: string, update: UpdateQuery<MembershipIF>): Promise<MembershipIF | null>;
  deletePlan(id: string): Promise<boolean>;
}
