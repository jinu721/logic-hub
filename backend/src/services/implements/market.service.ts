import { IMarketService } from "../interfaces/market.service.interface";
import { MarketItemIF } from "../../shared/types/market.types";
import { PublicMarketItemDTO, toPublicMarketItemDTO, toPublicMarketItemDTOs } from "../../mappers/market.dto";
import { IMarketRepository } from "../../repository/interfaces/market.repository.interface";
import { IUserRepository } from "../../repository/interfaces/user.repository.interface";

export class MarketService implements IMarketService {
  constructor(private _marketRepo: IMarketRepository,private _userRepo: IUserRepository) {}

  async createItem(data: Partial<MarketItemIF>): Promise<PublicMarketItemDTO> {
    const item = await this._marketRepo.createItem(data);
    return toPublicMarketItemDTO(item);
  }

  async getAllItems(filter?: any,page?:number,limit?:number): Promise<{marketItems:PublicMarketItemDTO[],totalItems:number}> {
    const query:any = {};
    const sort:any = {};
    const skip = ((page || 1) -1 ) * filter.limit;
    if(filter.category){
      query.category = filter.category
    }
    if(filter.searchQuery){
      query.name = { $regex: filter.searchQuery, $options: "i" };
    }
    if(filter.sortOption === "limited"){
      query.limitedTime = true
    }else if(filter.sortOption === "exclusive"){
      query.isExclusive = true
    }else if(filter.sortOption === 'price-asc'){
      sort.price = 1
    }else if(filter.sortOption === 'price-desc'){
      sort.price = -1
    }
    const items = await this._marketRepo.getAllItems(query,sort,skip,limit ?? 10);
    const totalItems = await this._marketRepo.countMarketItems(query);
    return {marketItems:toPublicMarketItemDTOs(items),totalItems};
  }

  async getItemById(id: string): Promise<PublicMarketItemDTO | null> {
    const item = await this._marketRepo.getItemById(id);
    return toPublicMarketItemDTO(item as MarketItemIF);
  }

  async updateItem(id: string, data: Partial<PublicMarketItemDTO>): Promise<PublicMarketItemDTO | null> {
    const updated = await this._marketRepo.updateItem(id, data);
    return toPublicMarketItemDTO(updated as MarketItemIF);
  }

  async deleteItem(id: string): Promise<boolean> {
    return await this._marketRepo.deleteItem(id);
  }

  async purchaseMarketItem(id: string,userId: string): Promise<PublicMarketItemDTO | null> {
    const item = await this._marketRepo.getItemById(id);
    if (!item) throw new Error("Item not found");
    const user = await this._userRepo.getUserById(userId);
    if (!user) return null;
    if (user.stats.xpPoints < item.costXP) throw new Error("Not enough XP");
    user.stats.xpPoints -= item.costXP;
    const itemId = item.itemId.toString();
    if(item.category === 'avatar'){
      user.inventory.ownedAvatars.push(itemId);
    }else if(item.category === 'banner'){
      user.inventory.ownedBanners.push(itemId);
    }else{
      user.inventory.badges.push(itemId as any);
    }
    await this._userRepo.save(user);
    return toPublicMarketItemDTO(item);
  }
}
