import { PublicChallengeProgressDTO, toPublicProgressDTO, toPublicProgressDTOs } from "../../mappers/progress.dto";
import { ChallengeProgressRepository } from "../../repository/implements/progress.repository";
import { UserRepository } from "../../repository/implements/user.repository";
import { ChallengeProgressIF } from "../../types/progress.types";
import { UserIF } from "../../types/user.types";
import { IChallengeProgressService } from "../interfaces/progress.service.interface";

export class ChallengeProgressService implements IChallengeProgressService {
  private challengeProgressRepository: ChallengeProgressRepository;
  private userRepository: UserRepository;

  constructor(
    challengeProgressRepository: ChallengeProgressRepository,
    userRepository: UserRepository
  ) {
    this.challengeProgressRepository = challengeProgressRepository;
    this.userRepository = userRepository; 
  }

  async createProgress(data: ChallengeProgressIF): Promise<PublicChallengeProgressDTO> {
    const progress = await this.challengeProgressRepository.createProgress(data);
    return toPublicProgressDTO(progress);
  }

  async getProgressByUserAndChallenge(data: {
    userId: string;
    challengeId: string;
  }): Promise<PublicChallengeProgressDTO[]> {
    const progresses = await this.challengeProgressRepository.getProgressByUserAndChallenge(data);
    return toPublicProgressDTOs(progresses);
  }

  async getProgressById(id: string): Promise<PublicChallengeProgressDTO | null> {
    const progress = await this.challengeProgressRepository.getProgressById(id);
    return toPublicProgressDTO(progress as ChallengeProgressIF);
  }

  async getAllProgress(): Promise<PublicChallengeProgressDTO[] | null> {
    const progresses = await this.challengeProgressRepository.getAllProgress();
    return toPublicProgressDTOs(progresses as ChallengeProgressIF[]);
  }

  async getRecentProgress(username: string): Promise<PublicChallengeProgressDTO[] | null> {
    const user:UserIF | null = await this.userRepository.getUserByName(username);
    if(!user) throw new Error("User not found");
    const userId = user._id as string || "";
    const progresses = await this.challengeProgressRepository.getRecentProgress(userId);
    return toPublicProgressDTOs(progresses as ChallengeProgressIF[]);
  }

  async updateProgress(
    id: string,
    data: Partial<ChallengeProgressIF>
  ): Promise<PublicChallengeProgressDTO | null> {
    const progress = await this.challengeProgressRepository.updateProgress(id, data);
    return toPublicProgressDTO(progress as ChallengeProgressIF);
  }

  async deleteProgressById(id: string): Promise<boolean> {
    return await this.challengeProgressRepository.deleteProgressById(id);
  }

  async getAllProgressByUser(userId: string): Promise<PublicChallengeProgressDTO[]> {
    const progresses = await this.challengeProgressRepository.getAllProgressByUser(userId);
    return toPublicProgressDTOs(progresses);
  }

  async getAllProgressByChallenge(challengeId: string): Promise<PublicChallengeProgressDTO[]> {
    const progresses = await this.challengeProgressRepository.getAllProgressByChallenge(challengeId);
    return toPublicProgressDTOs(progresses);
  }
  async getUserHeatmapData(username: string, year: number): Promise<{ [date: string]: number }> {
    const submissions = await this.challengeProgressRepository.getSubmissionsByUserAndYear(username, year);
    const heatMapData: Record<string, number>  = {};


    submissions.forEach((s)=>{
      const date = s.submittedAt.toISOString().split("T")[0];
      heatMapData[date] = (heatMapData[date] || 0) + 1;
    })

    return  heatMapData;
  }
}
