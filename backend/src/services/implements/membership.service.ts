import { MembershipIF } from "../../types/membership.types"; 
import { MembershipRepository } from "../../repository/implements/membership.repository";
import { IMembershipService } from "../interfaces/membership.service.interface"; 
import { PublicMembershipDTO, toPublicMembershipDTO, toPublicMembershipDTOs } from "../../mappers/membership.dto";

export class MembershipService implements IMembershipService {
  constructor(private planRepo: MembershipRepository) {}

  async createPlan(data: Partial<MembershipIF>): Promise<PublicMembershipDTO> {
    const plan = await this.planRepo.createPlan(data);
    return toPublicMembershipDTO(plan);
  }

  async getAllPlans(search: string,page:number,limit:number): Promise<{membershipPlans: PublicMembershipDTO[],totalItems:number}> {
    const skip = (page-1) * limit;
    const plans = await this.planRepo.getAllPlans(search,skip,limit);
    const totalItems = await this.planRepo.countAllPlans(search);
    return {membershipPlans:toPublicMembershipDTOs(plans),totalItems};
  }

  async getTwoActivePlans(): Promise<PublicMembershipDTO[]> {
    const plans = await this.planRepo.getTwoActivePlans();
    return toPublicMembershipDTOs(plans);
  }

  async getPlanById(id: string): Promise<PublicMembershipDTO | null> {
    const plan = await this.planRepo.getPlanById(id);
    if(!plan) throw new Error("Error getting plan");
    return toPublicMembershipDTO(plan );
  }

  async updatePlan(id: string, data: Partial<PublicMembershipDTO>): Promise<PublicMembershipDTO | null> {
    const isExist = await this.planRepo.findOne({name:data.name,_id:{$ne:id}});
    if(isExist){
      throw new Error("Membership Already Exist");
    }
    const updated =  await this.planRepo.updatePlan(id, data);
    if(!updated) throw new Error("Error updating plan");
    return toPublicMembershipDTO(updated);
  }

  async deletePlan(id: string): Promise<boolean> {
    const delted = await this.planRepo.deletePlan(id);
    return delted;
  }
}
