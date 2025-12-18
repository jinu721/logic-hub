import { PublicMembershipDTO } from "@modules/membership/dtos";
import { MembershipDocument } from "@shared/types";

export interface IMembershipService {
  createPlan(data: Partial<MembershipDocument>): Promise<PublicMembershipDTO>;
  getAllPlans(search: string,page:number,limit:number): Promise<{items: PublicMembershipDTO[],totalItems:number}>;
  getTwoActivePlans(): Promise<PublicMembershipDTO[]>;
  getPlanById(id: string): Promise<PublicMembershipDTO | null>;
  updatePlan(id: string, data: Partial<PublicMembershipDTO>): Promise<PublicMembershipDTO | null>;
  deletePlan(id: string): Promise<boolean>;
}
