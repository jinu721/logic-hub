import { InventoryIF } from "../../shared/types/inventory.types";
import { IBannerService } from "../interfaces/banner.service.interface";
import { IBannerRepository } from "../../repository/interfaces/banner.repository.interface";
import cloudinary from "../../config/cloudinary.config";
import { IPublicInventoryDTO, toPublicInventoryDTO, toPublicInventoryDTOs } from "../../mappers/inventory.dto";

export class BannerService implements IBannerService {
  constructor(private avatarRepo: IBannerRepository) {}

  async createBanner(data: InventoryIF): Promise<IPublicInventoryDTO> {
    const uploadedImage = await cloudinary.v2.uploader.upload(data.image,{
        folder:"inventory",
        type:"authenticated"
    });
    const created = await this.avatarRepo.createBanner({...data,image:uploadedImage.public_id});
    return toPublicInventoryDTO(created);
  }

  async getAllBanners(search:string,page:number,limit:number): Promise<IPublicInventoryDTO[]> {
    const query = search ? {name:{$regex:search,$options:'i'}} : {};
    const skip = (page-1) * limit;
    const banners = await this.avatarRepo.getAllBanners(query,skip,limit);
    return toPublicInventoryDTOs(banners);
  }

  async getBannerById(id: string): Promise<IPublicInventoryDTO | null> {
    const banner = await this.avatarRepo.getBannerById(id);
    return toPublicInventoryDTO(banner as InventoryIF);
  }

  async updateBanner(id: string, data: Partial<InventoryIF>): Promise<IPublicInventoryDTO | null> {
    const updated = await this.avatarRepo.updateBanner(id, data);
    return toPublicInventoryDTO(updated as InventoryIF);
  }

  async deleteBanner(id: string): Promise<boolean> {
    return await this.avatarRepo.deleteBanner(id);
  }
}
