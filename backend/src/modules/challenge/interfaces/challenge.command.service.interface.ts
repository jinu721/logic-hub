import { PublicChallengeDTO } from "@modules/challenge/dtos";
import { ChallengeIF } from "@shared/types";
import { Types } from "mongoose";

export interface IChallengeCommandService {
  createChallenge(data: Omit<ChallengeIF, "_id">): Promise<PublicChallengeDTO>;
  updateChallenge(
    id: Types.ObjectId,
    data: Partial<ChallengeIF>
  ): Promise<PublicChallengeDTO | null>;
  deleteChallenge(id: Types.ObjectId): Promise<boolean>;
}
