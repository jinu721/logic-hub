import { BaseRepository } from "../base.repository";
import User from "../../models/user.model";
import { UserIF } from "../../types/user.types";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { Types } from "mongoose";
import { populateUser } from "../../utils/database/user.populate";
import {
  toLean,
  toLeanMany,
  populateAndLean,
  populateAndLeanMany,
} from "../../utils/database/query.utils";

export class UserRepository
  extends BaseRepository<UserIF>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async createUser(user: Partial<UserIF>): Promise<UserIF | null> {
    const newUser = new this.model(user);
    return toLean<UserIF>(newUser.save());
  }

  async getByEmailOrUsername(value: string): Promise<UserIF | null> {
    return populateAndLean<UserIF>(
      this.model.findOne({ $or: [{ email: value }, { username: value }] }),
      populateUser
    );
  }

  async getAllByRole(role: string): Promise<UserIF[]> {
    return toLeanMany<UserIF>(this.model.find({ role }));
  }



  async getUserByName(username: string): Promise<UserIF | null> {
    return populateAndLean<UserIF>(
      this.model.findOne({ username }),
      populateUser
    );
  }

  async verifyAccount(email: string): Promise<UserIF | null> {
    return toLean<UserIF>(
      this.model.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      )
    );
  }

  async findUserRank(userId: string): Promise<number> {
    const user = await toLean<UserIF>(this.model.findById(userId));
    if (!user) return 0;

    const userXp = user.stats.totalXpPoints;
    const usersWithMoreXp = await this.model.countDocuments({
      "stats.totalXpPoints": { $gt: userXp },
    });
    return usersWithMoreXp + 1;
  }

  async updateUser(
    userId: Types.ObjectId,
    updateData: Partial<UserIF>
  ): Promise<UserIF | null> {
    return toLean<UserIF>(
      this.model.findByIdAndUpdate(userId, updateData, { new: true })
    );
  }

  async save(user: UserIF): Promise<UserIF> {
    return await new this.model(user).save();
  }

  async findAllUsers(
    search: string,
    skip: number,
    limit: number
  ): Promise<UserIF[]> {
    return populateAndLeanMany<UserIF>(
      this.model
        .find({ username: { $regex: search || "", $options: "i" } })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      populateUser
    );
  }

  async countAllUsers(search: string): Promise<number> {
    return this.model.countDocuments({
      username: { $regex: search || "", $options: "i" },
    });
  }

  async searchUsers(search: string): Promise<UserIF[]> {
    return populateAndLeanMany<UserIF>(
      this.model
        .find({
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        })
        .sort({ _id: -1 }),
      populateUser
    );
  }

  async getUserById(userId: string): Promise<UserIF | null> {
    return populateAndLean<UserIF>(
      this.model.findById(userId),
      populateUser
    );
  }

  async findUsersByIds(userIds: Types.ObjectId[]): Promise<UserIF[]> {
    return populateAndLeanMany<UserIF>(
      this.model.find({ _id: { $in: userIds } }),
      populateUser
    );
  }


  async cancelMembership(userId: Types.ObjectId): Promise<UserIF | null> {
    return toLean<UserIF>(
      this.model.findByIdAndUpdate(
        userId,
        { "membership.isActive": false },
        { new: true }
      )
    );
  }

  async updateUserLevel(userId: string, level: number): Promise<UserIF | null> {
    return toLean<UserIF>(
      this.model.findByIdAndUpdate(
        userId,
        { "stats.level": level },
        { new: true }
      )
    );
  }

  async updateUserXP(userId: string, xp: number): Promise<UserIF | null> {
    return toLean<UserIF>(
      this.model.findByIdAndUpdate(
        userId,
        { "stats.totalXpPoints": xp },
        { new: true }
      )
    );
  }
}
