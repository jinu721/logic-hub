import { Request, Response } from "express";

export interface IReportController {
  createReport(req: Request, res: Response): Promise<void>;
  getAllReports(req: Request, res: Response): Promise<void>;
  getReportById(req: Request, res: Response): Promise<void>;
  updateReportStatus(req: Request, res: Response): Promise<void>;
}
