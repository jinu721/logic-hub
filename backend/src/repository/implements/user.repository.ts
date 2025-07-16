import { BaseRepository } from "../base.repository";
import User from "../../models/user.model";
import { UserIF } from "../../types/user.types";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { Types } from "mongoose";

export class UserRepository
  extends BaseRepository<UserIF>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async getByEmailOrUsername(value: string): Promise<UserIF | null> {
    return User.findOne({ $or: [{ email: value }, { username: value }] })
      .populate("avatar")
      .populate("banner")
      .populate("inventory.ownedAvatars")
      .populate("inventory.ownedBanners")
      .populate("inventory.badges")
      .populate("membership.planId");
  }

  async getAllByRole(role: string): Promise<UserIF[]> {
    return this.model.find({ role });
  }
  async getUserByName(usermame: string): Promise<UserIF | null> {
    return this.model
      .findOne({ username: usermame })
      .populate("avatar")
      .populate("banner")
      .populate("inventory.ownedAvatars")
      .populate("inventory.ownedBanners")
      .populate("inventory.badges")
      .populate("membership.planId");
  }

  async verifyAccount(email: string): Promise<UserIF | null> {
    return this.model.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
  }

  async findUserRank(userId: string): Promise<number> {
    const user = await this.model.findById(userId);
    if (!user) return 0;
    const userXp = user.stats.totalXpPoints;
    const usersWithMoreXp = await this.model.countDocuments({
      "stats.totalXpPoints": { $gt: userXp },
    });
    return usersWithMoreXp + 1;
  }

  async updateUser(
    userId: string,
    updateData: Partial<UserIF>
  ): Promise<UserIF | null> {
    return this.model.findByIdAndUpdate(userId, updateData, { new: true });
  }
  async save(user: any) {
    return await user.save();
  }
  async findAllUsers(
    search: string,
    skip: number,
    limit: number
  ): Promise<UserIF[] | null> {
    return this.model
      .find({ username: { $regex: search || "", $options: "i" } })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .populate("avatar")
      .populate("banner")
      .populate("inventory.ownedAvatars")
      .populate("inventory.ownedBanners")
      .populate("inventory.badges")
      .populate("membership.planId");
  }
  async countAllUsers(search: string): Promise<number> {
    return this.model.countDocuments({
      username: { $regex: search || "", $options: "i" },
    });
  }

  async searchUsers(search: string): Promise<UserIF[] | null> {
    return this.model
      .find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      })
      .sort({ _id: -1 })
      .populate("avatar")
      .populate("banner")
      .populate("inventory.ownedAvatars")
      .populate("inventory.ownedBanners")
      .populate("inventory.badges")
      .populate("membership.planId");
  }

  async getUserById(userId: string): Promise<UserIF | null> {
    return this.model
      .findById(userId)
      .populate("avatar")
      .populate("banner")
      .populate("inventory.ownedAvatars")
      .populate("inventory.ownedBanners")
      .populate("inventory.badges")
      .populate("membership.planId");
  }

  async findUsersByIds(userIds: Types.ObjectId[]): Promise<UserIF[]> {
    return this.model
      .find({ _id: { $in: userIds } })
      .populate("avatar")
      .populate("banner")
      .populate("inventory.ownedAvatars")
      .populate("inventory.ownedBanners")
      .populate("inventory.badges")
      .populate("membership.planId");
  }

  async setUserOnline(userId: string, data: any) {
    return await this.model.findByIdAndUpdate(userId, data);
  }

  async cancelMembership(userId: string): Promise<UserIF | null> {
    return this.model.findByIdAndUpdate(
      userId,
      { "membership.isActive": false },
      { new: true }
    );
  }

  async updateUserLevel(userId: string, level: number): Promise<UserIF | null> {
    return this.model.findByIdAndUpdate(
      userId,
      { "stats.level": level },
      { new: true }
    );
  }

  async updateUserXP(userId: string, xp: number): Promise<UserIF | null> {
    return this.model.findByIdAndUpdate(
      userId,
      { "stats.totalXpPoints": xp },
      { new: true }
    );
  }
}
