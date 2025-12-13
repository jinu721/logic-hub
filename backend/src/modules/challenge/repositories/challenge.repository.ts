import { Types } from "mongoose";
import { ChallengeDocument, ChallengeModel, IChallengeRepository } from "@modules/challenge";
import { BaseRepository } from "@core";
import { ChallengeDBQuery, CreateChallengeInput } from "@shared/types";

export class ChallengeRepository
  extends BaseRepository<ChallengeDocument>
  implements IChallengeRepository
{
  constructor() {
    super(ChallengeModel);
  }

  async createChallenge(
    challengeData: CreateChallengeInput
  ): Promise<ChallengeDocument> {
    return await this.model.create(challengeData);
  }

  async getChallengeById(id: Types.ObjectId): Promise<ChallengeDocument | null> {
    return await this.model.findById(id);
  }

  async getChallenges(query: ChallengeDBQuery,skip:number,limit: number): Promise<ChallengeDocument[]> {
    return await this.model.find(query).skip(skip).limit(limit).sort({ _id: -1 });
  }


  async updateChallenge(
    id: Types.ObjectId,
    updateData: Partial<ChallengeDocument>
  ): Promise<ChallengeDocument | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteChallenge(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllChallenges(search:string, skip:number, limit:number): Promise<ChallengeDocument[]> {
    return await this.model.find({title:{$regex:search,$options:"i"}}).skip(skip).limit(limit).sort({_id:-1});
  }

  async countAllChallenges(search: string): Promise<number> {
    return await this.model.countDocuments({ title: { $regex: search, $options: "i" } });
  }

}
