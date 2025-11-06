import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IChallengeStatsService,
  IChallengeRepository,
  ISubmissionRepository,
  ILevelRepository,
  IUserRepository
} from "@modules/challenge/interfaces";
import { ChallengeIF } from "@shared/types";

export class ChallengeStatsService
  extends BaseService<ChallengeIF, any>
  implements IChallengeStatsService
{
  constructor(
    private readonly challengeRepo: IChallengeRepository,
    private readonly submissionRepo: ISubmissionRepository,
    private readonly userRepo: IUserRepository,
    private readonly levelRepo: ILevelRepository
  ) {
    super();
  }

  protected toDTO(entity: any): any {
    return entity;
  }

  protected toDTOs(entities: any[]): any[] {
    return entities;
  }

  async applySubmissionEffects(data: any, userId: string) {
    const { challengeId, passed, results, language } = data;

    const challenge = await this.challengeRepo.getChallengeById(challengeId);
    if (!challenge) throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");

    const user = await this.userRepo.getUserById(userId);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const existing = await this.submissionRepo.findOne({
      challengeId: challenge._id,
      userId: user._id,
      passed: true
    });

    const alreadyCompleted = !!existing;

    let xpGained = 0;
    let newXP = user.stats.xpPoints || 0;
    let newLevel = user.stats.level || 1;

    if (passed && !alreadyCompleted) {
      xpGained = challenge.xpRewards || 0;
      newXP += xpGained;

      while (true) {
        const nextLevel = await this.levelRepo.getLevelByLevel(newLevel + 1);
        if (!nextLevel || newXP < nextLevel.requiredXP) break;

        newXP -= nextLevel.requiredXP;
        newLevel = nextLevel.levelNumber;
      }

      user.stats.xpPoints = newXP;
      user.stats.totalXpPoints = (user.stats.totalXpPoints || 0) + xpGained;
      user.stats.level = newLevel;
    }

    await this.userRepo.save(user);

    const progressData: any = {
      challengeId: toObjectId(challengeId),
      userId: toObjectId(userId),
      passed,
      xpGained,
      level: challenge.level,
      type: challenge.type,
      tags: challenge.tags || [],
      submittedAt: new Date(),
      execution: {
        language,
        resultOutput: results
      }
    };

    await this.submissionRepo.createSubmission(progressData);

    return {
      passed,
      xpGained,
      newLevel: newLevel > user.stats.level ? newLevel : undefined
    };
  }

  async getPopularChallenge() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const popular = await this.submissionRepo.getMostCompletedChallengeOfWeek(oneWeekAgo);
    return popular;
  }

  async getChallengeSuccessRate(challengeId: string) {
    const list = await this.submissionRepo.getAllSubmissionsByChallenge(challengeId);
    const total = list.length;
    const completed = list.filter(x => x.status === "completed").length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }
}
