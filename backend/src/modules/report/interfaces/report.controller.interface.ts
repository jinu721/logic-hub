import { NextFunction, Request, Response } from "express";

export interface IReportController {
  createReport(req: Request, res: Response,next: NextFunction): Promise<void>;
  getAllReports(req: Request, res: Response,next: NextFunction): Promise<void>;
  getReportById(req: Request, res: Response,next: NextFunction): Promise<void>;
  updateReportStatus(req: Request, res: Response,next: NextFunction): Promise<void>;
}
