import { BaseService } from "@core";
import { AppError } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  IChallengeQueryService,
  PublicChallengeDTO,
  toPublicChallengeDTO,
  toPublicChallengeDTOs
} from "@modules/challenge/dtos";
import {
  IChallengeRepository,
  IChallengeProgressRepository
} from "@modules/challenge/interfaces";
import { ChallengeDomainIF } from "@shared/types";

export class ChallengeQueryService
  extends BaseService<ChallengeDomainIF, PublicChallengeDTO>
  implements IChallengeQueryService
{
  constructor(
    private readonly challengeRepo: IChallengeRepository,
    private readonly progressRepo: IChallengeProgressRepository
  ) {
    super();
  }

  protected toDTO(challenge: ChallengeDomainIF): PublicChallengeDTO {
    return toPublicChallengeDTO(challenge);
  }

  protected toDTOs(challenges: ChallengeDomainIF[]): PublicChallengeDTO[] {
    return toPublicChallengeDTOs(challenges);
  }

  async findChallengeById(id: string) {
    const challenge = await this.challengeRepo.getChallengeById(id);
    return challenge;
  }

  async getChallengeById(id: string, userId?: string) {
    const challenge = await this.challengeRepo.getChallengeById(id);
    if (!challenge) throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");

    // HERE: only minimal data (we keep execution detail for ExecutionService)
    return {
      ...this.mapOne(challenge),
      userId
    };
  }

  async getChallenges(filter: any, userId: string) {
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");

    const limit = filter.limit || 10;
    const page = filter.page || 1;
    const skip = (page - 1) * limit || 0;

    const query: any = {};

    if (filter.type) query.type = filter.type;
    if (filter.isPremium) query.isPremium = filter.isPremium;
    if (filter.level) query.level = filter.level;
    if (filter.tags) query.tags = { $in: filter.tags };
    if (filter.searchQuery) query.title = { $regex: filter.searchQuery, $options: "i" };

    const challenges = await this.challengeRepo.getChallenges(query, skip, limit);
    const totalItems = await this.challengeRepo.countAllChallenges("");

    return {
      challenges: this.mapMany(challenges),
      popularChallange: null,
      totalItems
    };
  }

  async getAllChallenges(search: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const challenges = await this.challengeRepo.getAllChallenges(search, skip, limit);
    const totalItems = await this.challengeRepo.countAllChallenges(search);

    return {
      challenges: this.mapMany(challenges),
      totalItems
    };
  }

  async getChallengesByStatus(status: "active" | "inactive" | "draft" | "archived") {
    const challenges = await this.challengeRepo.getChallengesByStatus(status);
    return this.mapMany(challenges);
  }

  async getChallengesByTags(tags: string[]) {
    const challenges = await this.challengeRepo.getChallengesByTags(tags);
    return this.mapMany(challenges);
  }

  async getChallengesByDifficulty(difficulty: "novice" | "adept" | "master") {
    const challenges = await this.challengeRepo.getChallengesByDifficulty(difficulty);
    return this.mapMany(challenges);
  }
}
