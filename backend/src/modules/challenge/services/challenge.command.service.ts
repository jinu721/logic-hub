import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  PublicChallengeDTO,
  toPublicChallengeDTO,
  toPublicChallengeDTOs,
} from "@modules/challenge/dtos";
import {
  IChallengeCommandService,
  IChallengeRepository,
} from "@modules/challenge/interfaces";
import { ChallengeIF } from "@shared/types";
import { Types } from "mongoose";

export class ChallengeCommandService
  extends BaseService<ChallengeIF, PublicChallengeDTO>
  implements IChallengeCommandService
{
  constructor(private readonly challengeRepo: IChallengeRepository) {
    super();
  }

  protected toDTO(challenge: ChallengeIF): PublicChallengeDTO {
    return toPublicChallengeDTO(challenge);
  }

  protected toDTOs(challenges: ChallengeIF[]): PublicChallengeDTO[] {
    return toPublicChallengeDTOs(challenges);
  }

  private parseValue(value: any) {
    if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
      return value;
    }
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }

  private normalizeTestCases(testCases: any[]) {
    return testCases.map((tc) => ({
      ...tc,
      input: this.parseValue(tc.input),
      output: this.parseValue(tc.output),
    }));
  }

  async createChallenge(data: Omit<ChallengeIF, "_id">) {
    if (data.testCases) {
      data.testCases = this.normalizeTestCases(data.testCases);
    }
    const created = await this.challengeRepo.createChallenge(data);
    return this.mapOne(created);
  }

  async updateChallenge(
    id: Types.ObjectId | string,
    data: Partial<ChallengeIF>
  ) {
    if (data.testCases) {
      data.testCases = this.normalizeTestCases(data.testCases);
    }
    const updated = await this.challengeRepo.updateChallenge(
      typeof id === "string" ? toObjectId(id) : id,
      data
    );
    if (!updated)
      throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");
    return this.mapOne(updated);
  }

  async deleteChallenge(id: Types.ObjectId | string) {
    const success = await this.challengeRepo.deleteChallenge(
      typeof id === "string" ? toObjectId(id) : id
    );
    if (!success)
      throw new AppError(HttpStatus.NOT_FOUND, "Challenge not found");
    return true;
  }
}
