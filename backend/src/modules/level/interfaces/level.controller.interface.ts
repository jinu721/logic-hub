
import { NextFunction, Request, Response } from "express";

export interface ILevelController {
    updateUserLevel(req: Request, res: Response, next: NextFunction): Promise<void>;
    createLevel(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllLevels(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLevelById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateLevel(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteLevel(req: Request, res: Response, next: NextFunction): Promise<void>;
}
