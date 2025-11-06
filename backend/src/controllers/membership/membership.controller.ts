import { Request, Response } from "express";
import { IMembershipService } from "../../services/interfaces/membership.service.interface";
import { IMembershipController } from "./membership.controller.interface";
import { HttpStatus } from "../../shared/constants/http.status";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";
import { AppError } from "../../shared/utils/application/app.error";

export class MembershipController implements IMembershipController {
  constructor(private readonly _membershipSvc: IMembershipService) {}

  createMembership = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.body) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Membership data is required");
    }

    const result = await this._membershipSvc.createPlan(req.body);
    sendSuccess(res, HttpStatus.CREATED, result, "Membership created successfully");
  });

  getAllMemberships = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const result = await this._membershipSvc.getAllPlans(search, page, limit);
    sendSuccess(res, HttpStatus.OK, result, "Memberships fetched successfully");
  });

  getTwoActiveMemberships = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this._membershipSvc.getTwoActivePlans();
    sendSuccess(res, HttpStatus.OK, result, "Active memberships fetched successfully");
  });

  getMembershipById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Membership ID is required");
    }

    const result = await this._membershipSvc.getPlanById(id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Membership fetched successfully");
  });

  updateMembership = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || !req.body) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Membership ID and data are required");
    }

    const result = await this._membershipSvc.updatePlan(id, req.body);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Membership updated successfully");
  });

  deleteMembership = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Membership ID is required");
    }

    const result = await this._membershipSvc.deletePlan(id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found");
    }

    sendSuccess(res, HttpStatus.OK, null, "Membership deleted successfully");
  });
}
