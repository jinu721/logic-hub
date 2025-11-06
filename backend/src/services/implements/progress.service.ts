import { Types } from "mongoose";
import { PublicChallengeProgressDTO, toPublicProgressDTO, toPublicProgressDTOs } from "../../mappers/progress.dto";
import { IChallengeProgressRepository } from "../../repository/interfaces/progress.repository.interface";
import { IUserRepository } from "../../repository/interfaces/user.repository.interface";
import { ChallengeProgressIF } from "../../shared/types/submission.types";
import { UserIF } from "../../shared/types/user.types";
import { IChallengeProgressService } from "../interfaces/progress.service.interface";
import { toObjectId } from "../../shared/utils/application/objectId.convertion";

export class ChallengeProgressService implements IChallengeProgressService {

  constructor(
   private readonly  _proggressRepo: IChallengeProgressRepository,
   private readonly _userRepo: IUserRepository
  ) {}

  async createProgress(data: ChallengeProgressIF): Promise<PublicChallengeProgressDTO> {
    const progress = await this._proggressRepo.createProgress(data);
    return toPublicProgressDTO(progress);
  }

  async getProgressByUserAndChallenge(data: {
    userId: string;
    challengeId: string;
  }): Promise<PublicChallengeProgressDTO[]> {
    const {userId,challengeId} = data;
    const progresses = await this._proggressRepo.getProgressByUserAndChallenge(toObjectId(userId),toObjectId(challengeId));
    return toPublicProgressDTOs(progresses);
  }

  async getProgressById(id: string): Promise<PublicChallengeProgressDTO | null> {
    const progress = await this._proggressRepo.getProgressById(toObjectId(id));
    return toPublicProgressDTO(progress as ChallengeProgressIF);
  }

  async getAllProgress(): Promise<PublicChallengeProgressDTO[] | null> {
    const progresses = await this._proggressRepo.getAllProgress();
    return toPublicProgressDTOs(progresses as ChallengeProgressIF[]);
  }

  async getRecentProgress(username: string): Promise<PublicChallengeProgressDTO[] | null> {
    console.log("Fetching recent progress for username: ", username);
    const user:UserIF | null = await this._userRepo.getUserByName(username);
    if(!user) throw new Error("User not found");
    const progresses = await this._proggressRepo.getRecentProgress(user._id as Types.ObjectId);
    console.log("Recent progresses: ", progresses);
    return toPublicProgressDTOs(progresses as ChallengeProgressIF[]);
  }

  async updateProgress(
    id: string,
    data: Partial<ChallengeProgressIF>
  ): Promise<PublicChallengeProgressDTO | null> {
    const progress = await this._proggressRepo.updateProgress(toObjectId(id), data);
    return toPublicProgressDTO(progress as ChallengeProgressIF);
  }

  async deleteProgressById(id: string): Promise<boolean> {
    return await this._proggressRepo.deleteProgressById(toObjectId(id));
  }

  async getAllProgressByUser(userId: string): Promise<PublicChallengeProgressDTO[]> {
    const progresses = await this._proggressRepo.getAllProgressByUser(toObjectId(userId));
    return toPublicProgressDTOs(progresses);
  }

  async getAllProgressByChallenge(challengeId: string): Promise<PublicChallengeProgressDTO[]> {
    const progresses = await this._proggressRepo.getAllProgressByChallenge(toObjectId(challengeId));
    return toPublicProgressDTOs(progresses);
  }
  async getUserHeatmapData(userId: string, year: number): Promise<{ [date: string]: number }> {
    const submissions = await this._proggressRepo.getSubmissionsByUserAndYear(toObjectId(userId), year);
    const heatMapData: Record<string, number>  = {};

    if(!submissions || submissions.length ===0){
      return heatMapData;
    }

    submissions.forEach((s)=>{
      const date = s.submittedAt.toISOString().split("T")[0];
      heatMapData[date] = (heatMapData[date] || 0) + 1;
    })

    return  heatMapData;
  }
}
