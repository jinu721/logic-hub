import { BaseService } from "@core/base.service";
import { toPublicInventoryDTO, toPublicInventoryDTOs } from "@modules/inventory/dtos";
import { IImageUploader } from "@providers";
import { InventoryIF } from "@shared/types";

type InventoryPublicDTO = ReturnType<typeof toPublicInventoryDTO>;

export class InventoryService
  extends BaseService<InventoryIF, InventoryPublicDTO>
{
  constructor(
    private readonly repo: any,
    private readonly uploader: IImageUploader
  ) {
    super();
  }

  protected toDTO(entity: InventoryIF): InventoryPublicDTO {
    return toPublicInventoryDTO(entity);
  }

  protected toDTOs(entities: InventoryIF[]): InventoryPublicDTO[] {
    return toPublicInventoryDTOs(entities);
  }

  async create(data: InventoryIF) {
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

  async update(id: string, data: Partial<InventoryIF>) {
    const updated = await this.repo.update(id, data);
    return this.mapOne(updated);
  }

  async delete(id: string) {
    return await this.repo.delete(id);
  }
}
