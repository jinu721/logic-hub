import { InventoryIF } from "../../types/inventory.types";
import { IAvatarService } from "../interfaces/avatar.service.interface";
import { IAvatarRepository } from "../../repository/interfaces/avatar.repository.interface";
import cloudinary from "../../config/cloudinary.config";
import {
  IPublicInventoryDTO,
  toPublicInventoryDTO,
  toPublicInventoryDTOs,
} from "../../mappers/inventory.dto";

export class AvatarService implements IAvatarService {
  constructor(private avatarRepo: IAvatarRepository) {}

  async createAvatar(data: InventoryIF): Promise<IPublicInventoryDTO> {
    const uploadedImage = await cloudinary.v2.uploader.upload(data.image, {
      folder: "inventory",
      type: "authenticated",
    });
    const created = await this.avatarRepo.createAvatar({
      ...data,
      image:uploadedImage.public_id,
    });
    return toPublicInventoryDTO(created);
  }

  async getAllAvatars(search:string,page:number,limit:number): Promise<IPublicInventoryDTO[]> {
    const query = search ? {name:{$regex:search,$options:'i'}} : {};
    const skip = (page-1) * limit;
    const avatars = await this.avatarRepo.getAllAvatars(query,skip,limit);
    return toPublicInventoryDTOs(avatars);
  }

  async getAvatarById(id: string): Promise<IPublicInventoryDTO | null> {
    const avatar = await this.avatarRepo.getAvatarById(id);
    return toPublicInventoryDTO(avatar as InventoryIF);
  }

  async updateAvatar(
    id: string,
    data: Partial<InventoryIF>
  ): Promise<IPublicInventoryDTO | null> {
    const updated = await this.avatarRepo.updateAvatar(id, data);
    return toPublicInventoryDTO(updated as InventoryIF);
  }

  async deleteAvatar(id: string): Promise<boolean> {
    return await this.avatarRepo.deleteAvatar(id);
  }
}
