import { Request, Response } from "express";
import { ILevelService } from "../../services/interfaces/level.service.interface";
import { ILevelController } from "../interfaces/level.controller.interface";
import { HttpStatus } from "../../constants/http.status";

export class LevelController implements ILevelController {

  constructor(private readonly _levelSvc: ILevelService) {}

  async updateUserLevel(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    const xp = req.body.xpPoints;

    try {
      const userLevel = await this._levelSvc.updateUserLevel(userId, xp);
      if (!userLevel) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: "User level could not be updated" });
        return;
      }
      res
        .status(HttpStatus.OK)
        .json({ message: "User level updated successfully", userLevel });
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error" });
    }
  }

  async createLevel(req: Request, res: Response): Promise<void> {
    const levelData = req.body;

    try {
      const level = await this._levelSvc.createLevel(levelData);
      res
        .status(HttpStatus.CREATED)
        .json({ message: "Level created successfully", level });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: err instanceof Error ? err.message : "Error Creating Level",
        });
    }
  }

  async getAllLevels(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page;
      const limit = req.query.limit;
      const levels = await this._levelSvc.getAllLevels(Number(page),Number(limit));
      res.status(HttpStatus.OK).json(levels);
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: err instanceof Error ? err.message : "Error Getting Level",
        });
    }
  }

  async getLevelById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const level = await this._levelSvc.getLevelById(id);
      if (!level) {
        res.status(404).json({ message: "Level not found" });
        return;
      }
      res.status(200).json(level);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: error instanceof Error ? error.message : "Error get Level",
        });
    }
  }

  async updateLevel(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const levelData = req.body;

    try {
      const level = await this._levelSvc.updateLevel(id, levelData);
      if (!level) {
        res.status(404).json({ message: "Level not found" });
        return;
      }
      res.status(200).json({ message: "Level updated successfully", level });
    } catch (err) {
      console.log(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          message: err instanceof Error ? err.message : "Error Updating Level",
        });
    }
  }

  async deleteLevel(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const level = await this._levelSvc.deleteLevel(id);
      if (!level) {
        res.status(404).json({ message: "Level not found" });
        return;
      }
      res.status(200).json({ message: "Level deleted successfully", level });
    } catch (error:any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
