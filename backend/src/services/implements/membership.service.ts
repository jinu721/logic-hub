import { MembershipIF } from "../../shared/types/membership.types"; 
import { IMembershipService } from "../interfaces/membership.service.interface"; 
import { PublicMembershipDTO, toPublicMembershipDTO, toPublicMembershipDTOs } from "../../mappers/membership.dto";
import { IMembershipRepository } from "../../repository/interfaces/membership.repository.interface";

export class MembershipService implements IMembershipService {
  constructor(private readonly _membershipRepo: IMembershipRepository) {}

  async createPlan(data: Partial<MembershipIF>): Promise<PublicMembershipDTO> {
    const plan = await this._membershipRepo.createPlan(data);
    return toPublicMembershipDTO(plan);
  }

  async getAllPlans(search: string,page:number,limit:number): Promise<{membershipPlans: PublicMembershipDTO[],totalItems:number}> {
    const skip = (page-1) * limit;
    const plans = await this._membershipRepo.getAllPlans(search,skip,limit);
    const totalItems = await this._membershipRepo.countAllPlans(search);
    return {membershipPlans:toPublicMembershipDTOs(plans),totalItems};
  }

  async getTwoActivePlans(): Promise<PublicMembershipDTO[]> {
    const plans = await this._membershipRepo.getTwoActivePlans();
    return toPublicMembershipDTOs(plans);
  }

  async getPlanById(id: string): Promise<PublicMembershipDTO | null> {
    const plan = await this._membershipRepo.getPlanById(id);
    if(!plan) throw new Error("Error getting plan");
    return toPublicMembershipDTO(plan );
  }

  async updatePlan(id: string, data: Partial<PublicMembershipDTO>): Promise<PublicMembershipDTO | null> {
    const isExist = await this._membershipRepo.findOne({name:data.name,_id:{$ne:id}});
    if(isExist){
      throw new Error("Membership Already Exist");
    }
    const updated =  await this._membershipRepo.updatePlan(id, data);
    if(!updated) throw new Error("Error updating plan");
    return toPublicMembershipDTO(updated);
  }

  async deletePlan(id: string): Promise<boolean> {
    const delted = await this._membershipRepo.deletePlan(id);
    return delted;
  }
}
