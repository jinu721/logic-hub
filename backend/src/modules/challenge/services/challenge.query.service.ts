import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  PublicChallengeDTO,
  toPublicChallengeDTO,
  toPublicChallengeDTOs
} from "@modules/challenge/dtos";
import {
  IChallengeQueryService,
  IChallengeRepository,
  ISubmissionRepository
} from "@modules/challenge/interfaces";
import { ChallengeDBQuery, ChallengeQueryFilter, ChallengeDocument } from "@shared/types";

export class ChallengeQueryService
  extends BaseService<ChallengeDocument, PublicChallengeDTO>
  implements IChallengeQueryService {
  constructor(
    private readonly _challengeRepo: IChallengeRepository,
    private readonly _submissionRepo: ISubmissionRepository
  ) {
    super();
  }

  protected toDTO(challenge: ChallengeDocument): PublicChallengeDTO {
    return toPublicChallengeDTO(challenge);
  }

  protected toDTOs(challenges: ChallengeDocument[]): PublicChallengeDTO[] {
    return toPublicChallengeDTOs(challenges);
  }

  async findChallengeById(id: string): Promise<PublicChallengeDTO | null> {
    const challenge = await this._challengeRepo.getChallengeById(toObjectId(id));
    return this.mapOne(challenge);
  }

  async getChallengeById(id: string, userId?: string): Promise<PublicChallengeDTO & { userId?: string }> {
    const challenge = await this._challengeRepo.getChallengeById(toObjectId(id));
    if (!challenge) throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");

    return {
      ...this.mapOne(challenge),
      userId
    };
  }

  async getChallenges(filter: ChallengeQueryFilter, userId: string) {
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const limit = filter.limit || 10;
    const page = filter.page || 1;
    const skip = (page - 1) * limit || 0;

    const query: ChallengeDBQuery = {};


    if (filter.type) query.type = filter.type;
    if (filter.isPremium) query.isPremium = filter.isPremium;
    if (filter.level) query.level = filter.level;
    if (filter.tags) query.tags = { $in: filter.tags };
    if (filter.searchQuery) query.title = { $regex: filter.searchQuery, $options: "i" };

    const challenges = await this._challengeRepo.getChallenges(query, skip, limit);
    const totalItems = await this._challengeRepo.countAllChallenges("");

    return {
      challenges: this.mapMany(challenges),
      totalItems
    };
  }

  async getAllChallenges(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const challenges = await this._challengeRepo.getAllChallenges(search, skip, limit);
    const totalItems = await this._challengeRepo.countAllChallenges(search);

    return {
      challenges: this.mapMany(challenges),
      totalItems
    };
  }

  async getUserHomeChallenges(
    filter: ChallengeQueryFilter,
    userId: string
  ): Promise<{
    challenges: PublicChallengeDTO[];
    popularChallange: PublicChallengeDTO | null;
  }> {




    const query: ChallengeDBQuery = {};


    if (filter.type) {
      query.type = filter.type;
    }
    if (filter.isPremium) {
      query.isPremium = filter.isPremium;
    }
    if (filter.level) {
      query.level = filter.level;
    }
    if (filter.tags) {
      query.tags = { $in: filter.tags };
    }
    if (filter.searchQuery) {
      query.title = { $regex: filter.searchQuery, $options: "i" };
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const popularChallangeId =
      await this._submissionRepo.getMostCompletedChallengeOfWeek(
        oneWeekAgo
      );



    let popularChallange = null;

    if (popularChallangeId) {
      popularChallange = await this._challengeRepo.getChallengeById(popularChallangeId);
    }

    if (!userId)
      return {
        challenges: [],
        popularChallange: popularChallange ? this.mapOne(popularChallange) : null,
      };

    const challenges = await this._challengeRepo.getChallenges(query, 0, 20);

    const submissionList =
      await this._submissionRepo.getAllSubmissions();
    const userSubmissionList =
      await this._submissionRepo.getAllSubmissionsByUser(toObjectId(userId));

    const userSubmissionMap = new Map();
    userSubmissionList.forEach((p) =>
      userSubmissionMap.set(p.challengeId.toString(), p)
    );

    const challengeSubmissionMap = new Map<
      string,
      { total: number; completed: number }
    >();

    if (submissionList && submissionList.length !== 0) {
      for (const p of submissionList) {
        const id = p.challengeId._id.toString();
        if (!challengeSubmissionMap.has(id)) {
          challengeSubmissionMap.set(id, { total: 0, completed: 0 });
        }
        const stats = challengeSubmissionMap.get(id)!;
        stats.total += 1;
        if (p.status === "completed") stats.completed += 1;
      }
    }

    const challengesData = challenges.map((challenge) => {
      const challengeId = challenge._id ? challenge._id.toString() : "";
      const progress = userSubmissionMap.get(challengeId);
      if (!progress) return challenge;
      let userStatus = "not attempted";
      if (progress) userStatus = progress.status;

      const stats = challengeSubmissionMap.get(challengeId);
      const totalAttempts = stats?.total || 0;
      const completedUsers = stats?.completed || 0;
      const successRate =
        totalAttempts > 0
          ? Math.round((completedUsers / totalAttempts) * 100)
          : 0;

      return {
        ...toPublicChallengeDTO(challenge),
        userStatus,
        completedUsers,
        successRate,
      };
    });

    if (popularChallange) {
      const popId = popularChallange._id ? popularChallange._id.toString() : "";
      const progress = userSubmissionMap.get(popId);
      let userStatus = "not attempted";
      if (progress) userStatus = progress.status;

      const stats = challengeSubmissionMap.get(popId);
      const totalAttempts = stats?.total || 0;
      const completedUsers = stats?.completed || 0;
      const successRate =
        totalAttempts > 0
          ? Math.round((completedUsers / totalAttempts) * 100)
          : 0;

      popularChallange = {
        ...popularChallange.toObject(),
        userStatus,
        completedUsers,
        successRate,
      };
    }

    return {
      challenges: challengesData as PublicChallengeDTO[],
      popularChallange: popularChallange as PublicChallengeDTO,
    };
  }


}
