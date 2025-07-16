import { PublicMembershipDTO } from "../../mappers/membership.dto";
import { MembershipIF } from "../../types/membership.types";

export interface IMembershipService {
  createPlan(data: Partial<MembershipIF>): Promise<PublicMembershipDTO>;
  getAllPlans(search: string,page:number,limit:number): Promise<{membershipPlans: PublicMembershipDTO[],totalItems:number}>;
  getTwoActivePlans(): Promise<PublicMembershipDTO[]>;
  getPlanById(id: string): Promise<PublicMembershipDTO | null>;
  updatePlan(id: string, data: Partial<PublicMembershipDTO>): Promise<PublicMembershipDTO | null>;
  deletePlan(id: string): Promise<boolean>;
}
