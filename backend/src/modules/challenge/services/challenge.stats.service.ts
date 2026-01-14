import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IChallengeStatsService,
  IChallengeRepository,
  ISubmissionRepository,
} from "@modules/challenge";
import { IUserRepository } from "@modules/user";
import { ILevelRepository } from "@modules/level";

import { PublicChallengeDTO, toPublicChallengeDTO, toPublicChallengeDTOs } from "@modules/challenge/dtos";
import { ChallengeDocument, LevelDocument, SubmissionAttrs, SubmissionEffectsData, SubmissionEffectsResult } from "@shared/types";
import { Types } from "mongoose";

export class ChallengeStatsService
  extends BaseService<ChallengeDocument, PublicChallengeDTO>
  implements IChallengeStatsService {
  constructor(
    private readonly challengeRepo: IChallengeRepository,
    private readonly submissionRepo: ISubmissionRepository,
    private readonly userRepo: IUserRepository,
    private readonly levelRepo: ILevelRepository
  ) {
    super();
  }

  protected toDTO(entity: ChallengeDocument): PublicChallengeDTO {
    return toPublicChallengeDTO(entity);
  }

  protected toDTOs(entities: ChallengeDocument[]): PublicChallengeDTO[] {
    return toPublicChallengeDTOs(entities);
  }

  async applySubmissionEffects(
    data: SubmissionEffectsData,
    userId: string
  ): Promise<SubmissionEffectsResult> {
    const { challengeId, passed } = data;

    const challenge = await this.challengeRepo.getChallengeById(toObjectId(challengeId as string));
    if (!challenge) throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");

    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const existing = await this.submissionRepo.getSubmissions({
      userId: user._id,
      challengeId: toObjectId(challengeId),
      passed: true,
      submittedAt: { $gte: startOfWeek }
    });

    const alreadyCompletedThisWeek = existing.length > 1;

    let xpGained = 0;
    let newXP = user.stats.xpPoints;
    let newLevel = user.stats.level;

    if (passed && !alreadyCompletedThisWeek) {
      xpGained = challenge.xpRewards;
      newXP += xpGained;

      while (true) {
        const nextLevel: LevelDocument | null = await this.levelRepo.getLevelByLevel(newLevel + 1);
        if (!nextLevel || newXP < nextLevel.requiredXP) break;

        newXP -= nextLevel.requiredXP;
        newLevel = nextLevel.levelNumber;
      }

      user.stats.xpPoints = newXP;
      user.stats.totalXpPoints += xpGained;
      user.stats.level = newLevel;
      const updateData = {
        $set: {
          "stats.xpPoints": newXP,
          "stats.level": newLevel,
        },
        $inc: {
          "stats.totalXpPoints": xpGained,
        },
      };

      await this.userRepo.updateUser(user._id, updateData);

    }




    return {
      passed,
      xpGained,
      newLevel: newLevel > user.stats.level ? newLevel : undefined,
    };
  }

  async getPopularChallenge(): Promise<Types.ObjectId | null> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.submissionRepo.getMostCompletedChallengeOfWeek(oneWeekAgo);
  }

  async getChallengeSuccessRate(challengeId: string): Promise<number> {
    const list: SubmissionAttrs[] = await this.submissionRepo.getAllSubmissionsByChallenge(
      toObjectId(challengeId)
    );

    const total = list.length;
    const completed = list.filter((x) => x.status === "completed").length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}
