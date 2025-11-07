import { PublicMembershipDTO } from "@modules/membership/dtos";
import { MembershipIF } from "@shared/types";

export interface IMembershipService {
  createPlan(data: Partial<MembershipIF>): Promise<PublicMembershipDTO>;
  getAllPlans(search: string,page:number,limit:number): Promise<{membershipPlans: PublicMembershipDTO[],totalItems:number}>;
  getTwoActivePlans(): Promise<PublicMembershipDTO[]>;
  getPlanById(id: string): Promise<PublicMembershipDTO | null>;
  updatePlan(id: string, data: Partial<PublicMembershipDTO>): Promise<PublicMembershipDTO | null>;
  deletePlan(id: string): Promise<boolean>;
}
