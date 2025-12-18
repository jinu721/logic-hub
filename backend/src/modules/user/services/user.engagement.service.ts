import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IUserEngagementService,
  IUserRepository,
  PublicUserDTO,
  toPublicUserDTO,
  toPublicUserDTOs,
} from "@modules/user";
import { UserDocument, PopulatedUser } from "@shared/types";
import { IMarketService } from "@modules/market";

export class UserEngagementService
  extends BaseService<PopulatedUser, PublicUserDTO>
  implements IUserEngagementService {
  constructor(
    private readonly _userRepo: IUserRepository,
    private _marketSvc: IMarketService,
  ) {
    super();
  }

  protected toDTO(user: PopulatedUser): PublicUserDTO {
    return toPublicUserDTO(user);
  }

  protected toDTOs(users: PopulatedUser[]): PublicUserDTO[] {
    return toPublicUserDTOs(users);
  }

  private async getPopulated(userId: string): Promise<PopulatedUser> {
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");
    return user;
  }

  private hasClaimedToday(date: Date | null | undefined) {
    if (!date) return false;

    const now = new Date();
    const last = new Date(date);

    return (
      last.getDate() === now.getDate() &&
      last.getMonth() === now.getMonth() &&
      last.getFullYear() === now.getFullYear()
    );
  }

  async claimDailyReward(userId: string) {
    const rewardMap: Record<number, number> = {
      1: 50,
      2: 100,
      3: 150,
      4: 200,
      5: 250,
      6: 300,
      7: 500,
    };
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    if (this.hasClaimedToday(user.lastRewardClaimDate)) {
      throw new AppError(HttpStatus.CONFLICT, "Reward already claimed today");
    }

    const current = user.dailyRewardDay || 1;
    const next = current === 7 ? 1 : current + 1;

    let reward = rewardMap[next];

    if (user.membership?.isActive && user.membership.type === "gold") {
      reward *= 2;
    }

    const updated = await this._userRepo.updateUser(toObjectId(userId), {
      dailyRewardDay: next,
      lastRewardClaimDate: new Date(),
      stats: {
        ...user.stats,
        xpPoints: user.stats.xpPoints + reward,
        totalXpPoints: user.stats.totalXpPoints + reward,
      },
    });

    if (!updated)
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Failed to update reward",
      );

    return this.mapOne(await this.getPopulated(userId));
  }

  async cancelMembership(userId: string): Promise<boolean> {
    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    if (!user.membership) {
      throw new AppError(HttpStatus.CONFLICT, "User has no active membership");
    }

    await this._userRepo.updateUser(toObjectId(userId), {
      membership: {
        ...user.membership,
        isActive: false,
      },
    });

    return true;
  }

  async giftItem(userId: string, itemId: string, type: string) {
    const valid = {
      avatars: "inventory.ownedAvatars",
      banners: "inventory.ownedBanners",
      badges: "inventory.badges",
    } as const;

    const path = valid[type as keyof typeof valid];
    if (!path) throw new AppError(HttpStatus.BAD_REQUEST, "Invalid gift type");

    const updateQuery = {
      $push: { [path]: toObjectId(itemId) }
    };

    const updated = await this._userRepo.updateUser(toObjectId(userId), updateQuery);

    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    return this.mapOne(await this.getPopulated(userId));
  }

  async setUserOnline(userId: string, isOnline: boolean) {
    const updated = await this._userRepo.updateUser(toObjectId(userId), {
      isOnline,
      lastSeen: isOnline ? undefined : new Date(),
    });

    if (!updated) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    return this.mapOne(await this.getPopulated(userId));
  }

  async purchaseMarketItem(id: string, userId: string) {
    const item = await this._marketSvc.getItemById(id);
    if (!item) throw new AppError(HttpStatus.NOT_FOUND, "Item not found");

    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    if (user.stats.xpPoints < item.costXP) {
      throw new AppError(HttpStatus.FORBIDDEN, "Not enough XP");
    }

    // Prepare Raw Update
    const newXp = user.stats.xpPoints - item.costXP;
    const itemObjectId = toObjectId(item.itemId._id);

    // Extract current IDs from populated docs
    const ownedAvatars = user.inventory.ownedAvatars.map(d => d._id);
    const ownedBanners = user.inventory.ownedBanners.map(d => d._id);
    const badges = user.inventory.badges.map(d => d._id);

    if (item.category === "avatar") {
      ownedAvatars.push(itemObjectId);
    } else if (item.category === "banner") {
      ownedBanners.push(itemObjectId);
    } else {
      badges.push(itemObjectId);
    }

    const updateData: Partial<UserDocument> = {
      stats: {
        ...user.stats,
        xpPoints: newXp
      },
      inventory: {
        ...user.inventory,
        ownedAvatars,
        ownedBanners,
        badges
      } // UserRaw Inventory has ObjectId[]
    } as unknown as Partial<UserDocument>;
    // Cast intermediate because UserDocument extends UserRaw which has inventory: {...}. 
    // And user.inventory coming from PopulatedUser has docs. 
    // I am reconstructing it.

    await this._userRepo.updateUser(user._id, updateData);

    return item;
  }
}
