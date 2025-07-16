import { Request, Response } from "express";
import { IChallengeProgressController } from "../interfaces/progress.controller.interface";
import { HttpStatus } from "../../constants/http.status";
import { ChallengeProgressService } from "../../services/implements/progress.service";

export class ChallengeProgressController
  implements IChallengeProgressController
{
  private challengeProgressService: ChallengeProgressService;

  constructor(challengeProgressService: ChallengeProgressService) {
    this.challengeProgressService = challengeProgressService;
  }

  async createProgress(req: Request, res: Response): Promise<void> {
    const progressData = req.body;

    try {
      const createdProgress =
        await this.challengeProgressService.createProgress(progressData);
      res
        .status(HttpStatus.CREATED)
        .json({ message: "Progress created successfully", createdProgress });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error ? err.message : "Error creating progress",
        });
    }
  }

  async getProgressByUserAndChallenge(
    req: Request,
    res: Response
  ): Promise<void> {
    const { userId, challengeId } = req.params;

    try {
      const progress =
        await this.challengeProgressService.getProgressByUserAndChallenge({
          userId,
          challengeId,
        });
      res.status(HttpStatus.OK).json(progress);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error ? err.message : "Error retrieving progress",
        });
    }
  }

  async getProgressById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const progress = await this.challengeProgressService.getProgressById(id);
      res.status(HttpStatus.OK).json(progress);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error ? err.message : "Error retrieving progress",
        });
    }
  }
  async getAllProgress(req: Request, res: Response): Promise<void> {
    try {
      const progresses = await this.challengeProgressService.getAllProgress();
      res.status(HttpStatus.OK).json(progresses);
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error ? err.message : "Error retrieving progress",
        });
    }
  }

  async getRecentProgress(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.username;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      let progress = await this.challengeProgressService.getRecentProgress(
        req.params.input === "me" ? (userId as string) : req.params.input
      );

      res.status(HttpStatus.OK).json(progress);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error
              ? err.message
              : "Error retrieving user progress",
        });
    }
  }

  async updateProgress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const progressData = req.body;

    try {
      const updatedProgress =
        await this.challengeProgressService.updateProgress(id, progressData);
      res
        .status(HttpStatus.OK)
        .json({ message: "Progress updated successfully", updatedProgress });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error ? err.message : "Error updating progress",
        });
    }
  }

  async deleteProgress(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const result = await this.challengeProgressService.deleteProgressById(id);

      res
        .status(HttpStatus.OK)
        .json({ message: "Progress deleted successfully" });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error ? err.message : "Error deleting progress",
        });
    }
  }

  async getAllProgressByUser(req: Request, res: Response): Promise<void> {
    const currentUserId = (req as any).user?.userId;

    if (!currentUserId) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
      return;
    }

    let userId = req.params.userId ? req.params.userId : currentUserId;

    try {
      const progress = await this.challengeProgressService.getAllProgressByUser(
        userId as string
      );
      res.status(HttpStatus.OK).json(progress);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error
              ? err.message
              : "Error retrieving user progress",
        });
    }
  }

  async getAllProgressByChallenge(req: Request, res: Response): Promise<void> {
    const { challengeId } = req.params;

    try {
      const progress =
        await this.challengeProgressService.getAllProgressByChallenge(
          challengeId
        );
      res.status(HttpStatus.OK).json(progress);
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error
              ? err.message
              : "Error retrieving progress by challenge",
        });
    }
  }
  async getHeatmap(req: Request, res: Response): Promise<void> {
    try {
      const year = req.query.year || "2025";

      if(!year){
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Year is required" });
        return;
      }
  
      const username = req.params.username === "me" ? (req.user as any).username : req.params.username;

      if(!username){
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Username is required" });
        return;
      } 

      const progress = await this.challengeProgressService.getUserHeatmapData(
        username,
        Number(year)
      );

      console.log("Progress: ", progress);

      res.status(HttpStatus.OK).json(progress);
    } catch (err) {
        console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message:
            err instanceof Error
              ? err.message
              : "Error retrieving progress by challenge",
        });
    }
  }
}
