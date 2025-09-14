import { PublicChallengeProgressDTO, toPublicProgressDTO, toPublicProgressDTOs } from "../../mappers/progress.dto";
import { IChallengeProgressRepository } from "../../repository/interfaces/progress.repository.interface";
import { IUserRepository } from "../../repository/interfaces/user.repository.interface";
import { ChallengeProgressIF } from "../../types/progress.types";
import { UserIF } from "../../types/user.types";
import { IChallengeProgressService } from "../interfaces/progress.service.interface";

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
    const progresses = await this._proggressRepo.getProgressByUserAndChallenge(userId,challengeId);
    return toPublicProgressDTOs(progresses);
  }

  async getProgressById(id: string): Promise<PublicChallengeProgressDTO | null> {
    const progress = await this._proggressRepo.getProgressById(id);
    return toPublicProgressDTO(progress as ChallengeProgressIF);
  }

  async getAllProgress(): Promise<PublicChallengeProgressDTO[] | null> {
    const progresses = await this._proggressRepo.getAllProgress();
    return toPublicProgressDTOs(progresses as ChallengeProgressIF[]);
  }

  async getRecentProgress(username: string): Promise<PublicChallengeProgressDTO[] | null> {
    const user:UserIF | null = await this._userRepo.getUserByName(username);
    if(!user) throw new Error("User not found");
    const userId = user._id as string || "";
    const progresses = await this._proggressRepo.getRecentProgress(userId);
    return toPublicProgressDTOs(progresses as ChallengeProgressIF[]);
  }

  async updateProgress(
    id: string,
    data: Partial<ChallengeProgressIF>
  ): Promise<PublicChallengeProgressDTO | null> {
    const progress = await this._proggressRepo.updateProgress(id, data);
    return toPublicProgressDTO(progress as ChallengeProgressIF);
  }

  async deleteProgressById(id: string): Promise<boolean> {
    return await this._proggressRepo.deleteProgressById(id);
  }

  async getAllProgressByUser(userId: string): Promise<PublicChallengeProgressDTO[]> {
    const progresses = await this._proggressRepo.getAllProgressByUser(userId);
    return toPublicProgressDTOs(progresses);
  }

  async getAllProgressByChallenge(challengeId: string): Promise<PublicChallengeProgressDTO[]> {
    const progresses = await this._proggressRepo.getAllProgressByChallenge(challengeId);
    return toPublicProgressDTOs(progresses);
  }
  async getUserHeatmapData(userId: string, year: number): Promise<{ [date: string]: number }> {
    const submissions = await this._proggressRepo.getSubmissionsByUserAndYear(userId, year);
    const heatMapData: Record<string, number>  = {};


    submissions.forEach((s)=>{
      const date = s.submittedAt.toISOString().split("T")[0];
      heatMapData[date] = (heatMapData[date] || 0) + 1;
    })

    return  heatMapData;
  }
}
