import { ChallengeDomain } from "../../models/challange.model";
import { BaseRepository } from "../base.repository";
import { IChallengeRepository } from "../interfaces/challange.repository.interface";
import { ChallengeDomainIF } from "../../types/challenge.types";
import { Types } from "mongoose";

export class ChallengeRepository
  extends BaseRepository<ChallengeDomainIF>
  implements IChallengeRepository
{
  constructor() {
    super(ChallengeDomain);
  }

  async createChallenge(
    challengeData: Omit<ChallengeDomainIF, "_id">
  ): Promise<ChallengeDomainIF> {
    return await this.model.create(challengeData);
  }

  async getChallengeById(id: string): Promise<ChallengeDomainIF | null> {
    return await this.model.findById(id);
  }

  async getChallenges(filter: any): Promise<ChallengeDomainIF[]> {
    return await this.model.find(filter);
  }


  async updateChallenge(
    id: Types.ObjectId,
    updateData: Partial<ChallengeDomainIF>
  ): Promise<ChallengeDomainIF | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteChallenge(id: Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  async getChallengesByStatus(
    status: "active" | "inactive" | "draft" | "archived"
  ): Promise<ChallengeDomainIF[]> {
    return await this.model.find({ status });
  }

  async getAllChallenges(search:string, skip:number, limit:number): Promise<ChallengeDomainIF[]> {
    return await this.model.find({title:{$regex:search,$options:"i"}}).skip(skip).limit(limit).sort({_id:-1});
  }


  async countAllChallenges(search: string): Promise<number> {
    return await this.model.countDocuments({ title: { $regex: search, $options: "i" } });
  }

  async getChallengesByTags(tags: string[]): Promise<ChallengeDomainIF[]> {
    return await this.model.find({ tags: { $in: tags } });
  }

  async getChallengesByDifficulty(
    difficulty: "novice" | "adept" | "master"
  ): Promise<ChallengeDomainIF[]> {
    return await this.model.find({ level: difficulty });
  }
}
