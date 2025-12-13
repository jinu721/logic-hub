import { BaseService } from "@core/base.service";
import { toPublicInventoryDTO, toPublicInventoryDTOs } from "@modules/inventory/dtos";
import { IImageUploader } from "@providers";
import { InventoryDocument } from "@shared/types";

type InventoryPublicDTO = ReturnType<typeof toPublicInventoryDTO>;

export class InventoryService
  extends BaseService<InventoryDocument, InventoryPublicDTO> {
  constructor(
    private readonly repo: IInventoryRepository,
    private readonly uploader: IImageUploader
  ) {
    super();
  }

  protected toDTO(entity: InventoryDocument): InventoryPublicDTO {
    return toPublicInventoryDTO(entity);
  }

  protected toDTOs(entities: InventoryDocument[]): InventoryPublicDTO[] {
    return toPublicInventoryDTOs(entities);
  }

  async create(data: InventoryDocument) {
    const uploaded = await this.uploader.upload(data.image);

    const created = await this.repo.create({
      ...data,
      image: uploaded.id
    });

    return this.mapOne(created);
  }

  async getAll(search: string, page: number, limit: number) {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const skip = (page - 1) * limit;

    const items = await this.repo.getAll(query, skip, limit);
    return this.mapMany(items);
  }

  async getById(id: string) {
    const item = await this.repo.getById(id);
    return this.mapOne(item);
  }

  async update(id: string, data: Partial<InventoryDocument>) {
    const updated = await this.repo.update(id, data);
    return this.mapOne(updated);
  }

  async delete(id: string) {
    return await this.repo.delete(id);
  }
}
