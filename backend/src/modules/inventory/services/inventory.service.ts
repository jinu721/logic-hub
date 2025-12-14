import { BaseService } from "@core/base.service";
import { toPublicInventoryDTO, toPublicInventoryDTOs } from "@modules/inventory/dtos";
import { IImageUploader } from "@providers";
import { InventoryDocument, PopulatedInventory } from "@shared/types";
import { IInventoryRepository } from "../interfaces";
import { IPublicInventoryDTO } from "@modules/inventory/dtos";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";

export class InventoryService
  extends BaseService<PopulatedInventory, IPublicInventoryDTO> {
  constructor(
    private readonly repo: IInventoryRepository,
    private readonly uploader: IImageUploader
  ) {
    super();
  }

  protected toDTO(entity: PopulatedInventory): IPublicInventoryDTO {
    // Mapper returns undefined only if item is null, but our PopulateInventory is strict.
    // However, mapper signature says undefined. We should ensure it returns strict DTO for BaseService.
    const dto = toPublicInventoryDTO(entity);
    if (!dto) throw new Error("Mapped inventory item is undefined");
    return dto;
  }

  protected toDTOs(entities: PopulatedInventory[]): IPublicInventoryDTO[] {
    return toPublicInventoryDTOs(entities);
  }

  private async getPopulated(id: string): Promise<PopulatedInventory> {
    const item = await this.repo.getById(id);
    if (!item) throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    return item;
  }

  async create(data: InventoryDocument) {
    // Note: data.image here is likely string (path) or file? 
    // The previous code did uploader.upload(data.image).
    // If data.image is string, upload returns ID/URL.
    // We assume input data is partial/raw. But signature says InventoryDocument.
    // I will keep logic but types might need checking (CreateInventoryInput vs InventoryDocument).
    const uploaded = await this.uploader.upload(data.image);

    const created = await this.repo.create({
      ...data,
      image: uploaded.id
    });

    return this.mapOne(await this.getPopulated(String(created._id)));
  }

  async getAll(search: string, page: number, limit: number) {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const skip = (page - 1) * limit;

    const items = await this.repo.getAll(query, skip, limit);
    return this.mapMany(items);
  }

  async getById(id: string) {
    const item = await this.repo.getById(id);
    if (!item) return null;
    return this.mapOne(item);
  }

  async update(id: string, data: Partial<InventoryDocument>) {
    const updated = await this.repo.update(id, data);
    if (!updated) return null;
    // Re-fetch Pattern
    return this.mapOne(await this.getPopulated(id));
  }

  async delete(id: string) {
    return await this.repo.delete(id);
  }
}
