import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  PublicMarketItemDTO,
  toPublicMarketItemDTO,
  toPublicMarketItemDTOs,
  IMarketService,
  IMarketRepository
} from "@modules/market";

import {
  IUserRepository
} from "@modules/user";

import { MarketItemDocument, MarketItemFilter, MongoSortOptions } from "@shared/types";

export class MarketService
  extends BaseService<MarketItemDocument, PublicMarketItemDTO>
  implements IMarketService {
  constructor(
    private readonly marketRepo: IMarketRepository,
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  protected toDTO(item: MarketItemDocument): PublicMarketItemDTO {
    return toPublicMarketItemDTO(item);
  }

  protected toDTOs(items: MarketItemDocument[]): PublicMarketItemDTO[] {
    return toPublicMarketItemDTOs(items);
  }

  async createItem(data: Partial<MarketItemDocument>) {
    const created = await this.marketRepo.createItem(data);
    return this.mapOne(created);
  }

  async getAllItems(filter: MarketItemFilter = {}, page: number = 1, limit: number = 10) {
    const query: Record<string, unknown> = {};
    const sort: MongoSortOptions = {};

    if (filter.category) query.category = filter.category;
    if (filter.searchQuery) query.name = { $regex: filter.searchQuery, $options: "i" };

    if (filter.sortOption === "limited") query.limitedTime = true;
    else if (filter.sortOption === "exclusive") query.isExclusive = true;
    else if (filter.sortOption === "price-asc") sort.costXP = 1;
    else if (filter.sortOption === "price-desc") sort.costXP = -1;

    const skip = (page - 1) * limit;

    const items = await this.marketRepo.getAllItems(query, sort, skip, limit);
    const totalItems = await this.marketRepo.countMarketItems(query);

    return { marketItems: this.mapMany(items), totalItems };
  }

  async getItemById(id: string) {
    const item = await this.marketRepo.getItemById(id);
    if (!item) throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    return this.mapOne(item);
  }

  async updateItem(id: string, data: Partial<MarketItemDocument>) {
    const updated = await this.marketRepo.updateItem(id, data);
    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    return this.mapOne(updated);
  }

  async deleteItem(id: string) {
    const deleted = await this.marketRepo.deleteItem(id);
    if (!deleted) throw new AppError(HttpStatus.NOT_FOUND, "Item not found");
    return true;
  }

}
