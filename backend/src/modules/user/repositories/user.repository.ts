import { Types } from "mongoose";
import { BaseRepository } from "@core";
import { UserModel, IUserRepository } from "@modules/user";
import {
  populateUser,
  toLean,
  toLeanMany,
  populateAndLean,
  populateAndLeanMany,
} from "@utils/database";
import { UserDocument } from "@modules/user";

export class UserRepository
  extends BaseRepository<UserDocument>
  implements IUserRepository {
  constructor() {
    super(UserModel);
  }

  async createUser(data: Partial<UserDocument>): Promise<UserDocument> {
    return await this.model.create(data);
  }

  async getByEmailOrUsername(value: string): Promise<UserDocument | null> {
    return populateAndLean<UserDocument>(
      this.model.findOne({ $or: [{ email: value }, { username: value }] }),
      populateUser
    );
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return populateAndLean<UserDocument>(
      this.model.findOne({ email }),
      populateUser
    );
  }

  async getAllByRole(role: string): Promise<UserDocument[]> {
    return toLeanMany<UserDocument>(this.model.find({ role }));
  }

  async getUserByName(username: string): Promise<UserDocument | null> {
    return populateAndLean<UserDocument>(
      this.model.findOne({ username }),
      populateUser
    );
  }

  async verifyAccount(email: string): Promise<UserDocument | null> {
    return toLean<UserDocument>(
      this.model.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      )
    );
  }

  async findUserRank(userId: string): Promise<number> {
    const user = await toLean<UserDocument>(this.model.findById(userId));
    if (!user) return 0;

    const userXp = user.stats.totalXpPoints;
    const usersWithMoreXp = await this.model.countDocuments({
      "stats.totalXpPoints": { $gt: userXp },
    });
    return usersWithMoreXp + 1;
  }

  async updateUser(
    userId: Types.ObjectId,
    updateData: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    return toLean<UserDocument>(
      this.model.findByIdAndUpdate(userId, updateData, { new: true })
    );
  }

  async saveUser(user: UserDocument): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate(user._id, user, { new: true });
  }

  async findAllUsers(
    search: string,
    skip: number,
    limit: number
  ): Promise<UserDocument[]> {
    return populateAndLeanMany<UserDocument>(
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

  async searchUsers(search: string): Promise<UserDocument[]> {
    return populateAndLeanMany<UserDocument>(
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

  async getUserById(userId: string): Promise<UserDocument | null> {
    return populateAndLean<UserDocument>(this.model.findById(userId), populateUser);
  }

  async findUsersByIds(userIds: Types.ObjectId[]): Promise<UserDocument[]> {
    return populateAndLeanMany<UserDocument>(
      this.model.find({ _id: { $in: userIds } }),
      populateUser
    );
  }

  async cancelMembership(userId: Types.ObjectId): Promise<UserDocument | null> {
    return toLean<UserDocument>(
      this.model.findByIdAndUpdate(
        userId,
        { "membership.isActive": false },
        { new: true }
      )
    );
  }

  async updateUserLevel(userId: string, level: number): Promise<UserDocument | null> {
    return toLean<UserDocument>(
      this.model.findByIdAndUpdate(
        userId,
        { "stats.level": level },
        { new: true }
      )
    );
  }

  async updateUserXP(userId: string, xp: number): Promise<UserDocument | null> {
    return toLean<UserDocument>(
      this.model.findByIdAndUpdate(
        userId,
        { "stats.totalXpPoints": xp },
        { new: true }
      )
    );
  }
}
