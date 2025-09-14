import { IReportController } from "../interfaces/report.controller.interface";
import { IReportService } from "../../services/interfaces/report.service.interface";
import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";

export class ReportController implements IReportController {
  constructor(private readonly _reportSvc: IReportService) {}

  async createReport(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const report = await this._reportSvc.createReport({
        reporter: userId,
        ...req.body,
      });
      res.status(HttpStatus.OK).json(report);
    } catch (err) {
        console.log(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to create report" });
    }
  }

  async getAllReports(req: Request, res: Response): Promise<void> {
    try {
      const filter = {reportedType: req.query.reportedType, status: req.query.status};
      const page = req.query.page;
      const limit = req.query.limit;
      const reports = await this._reportSvc.getAllReports(filter as any,Number(page),Number(limit));
      res.status(HttpStatus.OK).json(reports);
    } catch (err) {
        console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch reports" });
    }
  }

  async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const report = await this._reportSvc.getReportById(req.params.id);
      if (!report) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Report not found" });
        return;
      }
      res.status(HttpStatus.OK).json(report);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch report" });
    }
  }

  async updateReportStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const updatedReport = await this._reportSvc.updateReportStatus(req.params.id, status);
      if (!updatedReport) {
        res.status(HttpStatus.NOT_FOUND).json({ message: "Report not found" });
        return;
      }
      res.status(HttpStatus.OK).json(updatedReport);
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to update report status" });
    }
  }
}
