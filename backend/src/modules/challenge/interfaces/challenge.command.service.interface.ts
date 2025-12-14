import { PublicChallengeDTO } from "@modules/challenge/dtos";
import {  CreateChallengeInput, UpdateChallengePayload } from "@shared/types";
import { Types } from "mongoose";

export interface IChallengeCommandService {
  createChallenge(data: CreateChallengeInput): Promise<PublicChallengeDTO>;
  updateChallenge(
    id: Types.ObjectId | string,
    data: UpdateChallengePayload
  ): Promise<PublicChallengeDTO | null>;
  deleteChallenge(id: Types.ObjectId | string): Promise<boolean>;
}
