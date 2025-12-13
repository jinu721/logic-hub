import { Request, Response } from "express";
import { IReportController, IReportService } from "@modules/report";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";
import { CreateReportDto, GetAllReportsDto, GetReportDto, UpdateReportStatusDto } from "@modules/report/dtos";


export class ReportController implements IReportController {
  constructor(private readonly _reportSvc: IReportService) { }

  createReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const dto = CreateReportDto.from({
      reporter: userId,
      ...req.body,
    });

    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));


    const report = await this._reportSvc.createReport(dto as any);
    sendSuccess(res, HttpStatus.CREATED, report, "Report created successfully");
  });

  getAllReports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetAllReportsDto.from(req.query);

    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));


    const reports = await this._reportSvc.getAllReports(dto as any);
    sendSuccess(res, HttpStatus.OK, reports, "Reports fetched successfully");
  });

  getReportById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetReportDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));

    const report = await this._reportSvc.getReportById(dto.id);
    if (!report) {
      throw new AppError(HttpStatus.NOT_FOUND, "Report not found");
    }

    sendSuccess(res, HttpStatus.OK, report, "Report fetched successfully");
  });

  updateReportStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateReportStatusDto.from({ id: req.params.id, ...req.body });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", "));
    }

    const updatedReport = await this._reportSvc.updateReportStatus(dto.id, dto.status);
    sendSuccess(res, HttpStatus.OK, updatedReport, "Report status updated successfully");
  });
}
