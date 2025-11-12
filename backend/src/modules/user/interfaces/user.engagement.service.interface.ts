import { PublicMarketItemDTO } from "@modules/market";
import { PublicUserDTO } from "@modules/user/dtos";

export interface IUserEngagementService {
  claimDailyReward(userId: string): Promise<PublicUserDTO>;
  cancelMembership(userId: string): Promise<boolean>;
  giftItem(userId: string, itemId: string, type: string): Promise<PublicUserDTO>;
  setUserOnline(userId: string, isOnline: boolean): Promise<PublicUserDTO>;
  purchaseMarketItem(id: string,userId:string): Promise<PublicMarketItemDTO | null>;
}
