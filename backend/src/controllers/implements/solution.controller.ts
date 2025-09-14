import { Request, Response } from "express";
import { ISolutionController } from "../interfaces/solution.controller.interface";
import { HttpStatus } from "../../constants/http.status";
import { ISolutionService } from "../../services/interfaces/solution.service.interface";

export class SolutionController implements ISolutionController {
  constructor(private readonly _solutionSvc: ISolutionService) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await this._solutionSvc.addSolution({
        ...req.body,
        user: userId,
      });
      res.status(HttpStatus.CREATED).json({ success: true, data: result });
    } catch (error) {
      console.error("Create Solution Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to create solution" });
    }
  }

  async getByChallenge(req: Request, res: Response): Promise<void> {
    try {
      const {
        search = "",
        page = "1",
        limit = "10",
        sortBy = "likes",
      } = req.query;

      const result = await this._solutionSvc.getSolutionsByChallenge(
        req.params.challengeId,
        search.toString(),
        parseInt(page.toString()),
        parseInt(limit.toString()),
        sortBy.toString()
      );

      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Get By Challenge Error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch solutions by challenge",
      });
    }
  }

  async getByUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._solutionSvc.getSolutionsByUser(req.params.userId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Get By User Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to fetch solutions by user" });
    }
  }

  async like(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await this._solutionSvc.like(req.params.solutionId, userId);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Like Solution Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to like solution" });
    }
  }

  async comment(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const result = await this._solutionSvc.comment(userId, req.body.data);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Comment Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to add comment" });
    }
  }

  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._solutionSvc.deleteComment(
        req.params.solutionId,
        req.params.commentId
      );
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Delete Comment Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to delete comment" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._solutionSvc.update(req.params.solutionId, req.body);
      res.status(HttpStatus.OK).json({ success: true, data: result });
    } catch (error) {
      console.error("Update Solution Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to update solution" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      await this._solutionSvc.delete(req.params.solutionId);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      console.error("Delete Solution Error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Failed to delete solution" });
    }
  }
}
