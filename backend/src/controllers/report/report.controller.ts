import { IReportController } from "./report.controller.interface";
import { IReportService } from "../../services/interfaces/report.service.interface";
import { Request, Response } from "express";
import { HttpStatus } from "../../shared/constants/http.status";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";
import { AppError } from "../../shared/utils/application/app.error";

export class ReportController implements IReportController {
  constructor(private readonly _reportSvc: IReportService) {}

  createReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const report = await this._reportSvc.createReport({
      reporter: userId,
      ...req.body,
    });

    sendSuccess(res, HttpStatus.CREATED, report, "Report created successfully");
  });

  getAllReports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filter = {
      reportedType: req.query.reportedType,
      status: req.query.status,
    };
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const reports = await this._reportSvc.getAllReports(filter as any, page, limit);
    sendSuccess(res, HttpStatus.OK, reports, "Reports fetched successfully");
  });

  getReportById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Report ID is required");
    }

    const report = await this._reportSvc.getReportById(id);
    if (!report) {
      throw new AppError(HttpStatus.NOT_FOUND, "Report not found");
    }

    sendSuccess(res, HttpStatus.OK, report, "Report fetched successfully");
  });

  updateReportStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Report ID is required");
    }
    if (!status) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Status is required");
    }

    const updatedReport = await this._reportSvc.updateReportStatus(id, status);
    sendSuccess(res, HttpStatus.OK, updatedReport, "Report status updated successfully");
  });
}
