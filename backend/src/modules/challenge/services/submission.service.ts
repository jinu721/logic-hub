import { BaseService } from "@core";
import { AppError, toObjectId } from "@utils/application";
import { HttpStatus } from "@constants";
import {
  PublicSubmissionDTO,
  toPublicSubmissionDTO,
  toPublicSubmissionDTOs
} from "@modules/challenge/dtos";
import {
  ISubmissionService,
  ISubmissionRepository,
} from "@modules/challenge";
import {
  IUserRepository
} from "@modules/user";
import { SubmissionIF } from "@shared/types";
import { UserIF } from "@shared/types/user.types";
import { Types } from "mongoose";

export class SubmissionService
  extends BaseService<SubmissionIF, PublicSubmissionDTO>
  implements ISubmissionService
{
  constructor(
    private readonly submissionRepo: ISubmissionRepository,
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  protected toDTO(entity: SubmissionIF): PublicSubmissionDTO {
    return toPublicSubmissionDTO(entity);
  }

  protected toDTOs(entities: SubmissionIF[]): PublicSubmissionDTO[] {
    return toPublicSubmissionDTOs(entities);
  }

  async createSubmission(data: SubmissionIF) {
    const submission = await this.submissionRepo.createSubmission(data);
    return this.mapOne(submission);
  }

  async getSubmissionsByUserAndChallenge(data: { userId: string; challengeId: string }) {
    const { userId, challengeId } = data;
    const submissions = await this.submissionRepo.getSubmissionsByUserAndChallenge(
      toObjectId(userId),
      toObjectId(challengeId)
    );
    return this.mapMany(submissions);
  }

  async getSubmissionById(id: string) {
    const submission = await this.submissionRepo.getSubmissionById(toObjectId(id));
    if (!submission) throw new AppError(HttpStatus.NOT_FOUND, "Submission not found");
    return this.mapOne(submission);
  }

  async getAllSubmissions() {
    const submissions = await this.submissionRepo.getAllSubmissions();
    return this.mapMany(submissions);
  }

  async getRecentSubmissions(username: string) {
    const user: UserIF | null = await this.userRepo.getUserByName(username);
    if (!user) throw new AppError(HttpStatus.NOT_FOUND, "User not found");

    const submissions = await this.submissionRepo.getRecentSubmissions(user._id as Types.ObjectId);
    return this.mapMany(submissions);
  }

  async updateSubmission(id: string, data: Partial<SubmissionIF>) {
    const submission = await this.submissionRepo.updateSubmission(toObjectId(id), data);
    if (!submission) throw new AppError(HttpStatus.NOT_FOUND, "Submission not found");
    return this.mapOne(submission);
  }

  async deleteSubmissionById(id: string) {
    const success = await this.submissionRepo.deleteSubmissionById(toObjectId(id));
    if (!success) throw new AppError(HttpStatus.NOT_FOUND, "Progress not found");
    return true;
  }

  async getAllSubmissionsByUser(userId: string) {
    const submissions = await this.submissionRepo.getAllSubmissionsByUser(toObjectId(userId));
    return this.mapMany(submissions);
  }

  async getAllSubmissionsByChallenge(challengeId: string) {
    const submissions = await this.submissionRepo.getAllSubmissionsByChallenge(toObjectId(challengeId));
    return this.mapMany(submissions);
  }

  async getUserHeatmapData(userId: string, year: number) {
    const submissions = await this.submissionRepo.getSubmissionsByUserAndYear(toObjectId(userId), year);

    const map: Record<string, number> = {};

    if (!submissions || submissions.length === 0) return map;

    submissions.forEach((s) => {
      const date = s.submittedAt.toISOString().split("T")[0];
      map[date] = (map[date] || 0) + 1;
    });

    return map;
  }
}
