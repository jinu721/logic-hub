import { UpdateQuery } from "mongoose";
import { MembershipDocument } from "@shared/types";

export interface IMembershipRepository {
  createPlan(data: Partial<MembershipDocument>): Promise<MembershipDocument>;
  getAllPlans(search:string,skip:number,limit:number): Promise<MembershipDocument[]>;
  getTwoActivePlans(): Promise<MembershipDocument[]>;
  countAllPlans(search:string): Promise<number>;
  getPlanById(id: string): Promise<MembershipDocument | null>;
  updatePlan(id: string, update: UpdateQuery<MembershipDocument>): Promise<MembershipDocument | null>;
  deletePlan(id: string): Promise<boolean>;
}
