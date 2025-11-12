import { Types } from "mongoose";
import { ChallengeModel, IChallengeRepository } from "@modules/challenge";
import { ChallengeIF } from "@shared/types";
import { BaseRepository } from "@core";

export class ChallengeRepository
  extends BaseRepository<ChallengeIF>
  implements IChallengeRepository
{
  constructor() {
    super(ChallengeModel);
  }

  async createChallenge(
    challengeData: Omit<ChallengeIF, "_id">
  ): Promise<ChallengeIF> {
    return await this.model.create(challengeData);
  }

  async getChallengeById(id: Types.ObjectId): Promise<ChallengeIF | null> {
    return await this.model.findById(id);
  }

  async getChallenges(filter: any,skip:number,limit: number): Promise<ChallengeIF[]> {
    return await this.model.find(filter).skip(skip).limit(limit).sort({ _id: -1 });
  }


  async updateChallenge(
    id: Types.ObjectId,
    updateData: Partial<ChallengeIF>
  ): Promise<ChallengeIF | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteChallenge(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllChallenges(search:string, skip:number, limit:number): Promise<ChallengeIF[]> {
    return await this.model.find({title:{$regex:search,$options:"i"}}).skip(skip).limit(limit).sort({_id:-1});
  }

  async countAllChallenges(search: string): Promise<number> {
    return await this.model.countDocuments({ title: { $regex: search, $options: "i" } });
  }

}
