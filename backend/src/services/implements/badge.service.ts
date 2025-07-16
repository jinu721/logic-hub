import { InventoryIF } from "../../types/inventory.types";
import { IBadgeService } from "../interfaces/badge.service.interface";
import { IBadgeRepository } from "../../repository/interfaces/badge.repository.interface";
import cloudinary from "../../config/cloudinary.config";
import { IPublicInventoryDTO, toPublicInventoryDTO, toPublicInventoryDTOs } from "../../mappers/inventory.dto";

export class BadgeService implements IBadgeService {
  constructor(private badgeRepo: IBadgeRepository) {}

  async createBadge(data: InventoryIF): Promise<IPublicInventoryDTO> {
    const uploadedImage = await cloudinary.v2.uploader.upload(data.image,{
        folder:"inventory",
        type:"authenticated"
    });
    const created = await this.badgeRepo.createBadges({...data,image:uploadedImage.public_id});
    return toPublicInventoryDTO(created);
  }

  async getAllBadges(search:string,page:number,limit:number): Promise<IPublicInventoryDTO[]> {
    const query = search ? {name:{$regex:search,$options:'i'}} : {};
    const skip = (page-1) * limit;
    const badges = await this.badgeRepo.getAllBadges(query,skip,limit);
    return toPublicInventoryDTOs(badges);
  }

  async getBadgeById(id: string): Promise<IPublicInventoryDTO | null> {
    const badge = await this.badgeRepo.getBadgeById(id);
    return toPublicInventoryDTO(badge as InventoryIF);
  }

  async updateBadge(id: string, data: Partial<InventoryIF>): Promise<IPublicInventoryDTO | null> {
    const updated = await this.badgeRepo.updateBadge(id, data);
    return toPublicInventoryDTO(updated as InventoryIF);
  }

  async deleteBadge(id: string): Promise<boolean> {
    return await this.badgeRepo.deleteBadge(id);
  }
}
