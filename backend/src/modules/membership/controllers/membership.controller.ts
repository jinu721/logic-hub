import { Request, Response } from "express";
import { IMembershipService, IMembershipController } from "@modules/membership";
import { CreateMembershipDto, DeleteMembershipDto, GetAllMembershipsDto, GetMembershipDto, UpdateMembershipDto } from "@modules/membership/dtos";
import { HttpStatus } from "@constants/http.status";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";


export class MembershipController implements IMembershipController {
  constructor(private readonly _membershipSvc: IMembershipService) { }

  createMembership = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = CreateMembershipDto.from(req.body);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", ") || "Validation failed");
    }

    const result = await this._membershipSvc.createPlan(dto);
    sendSuccess(res, HttpStatus.CREATED, result, "Membership created successfully");
  });

  getAllMemberships = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetAllMembershipsDto.from(req.query);
    const validation = dto.validate();
    if (!validation.valid) {
      const errors = (validation as any).errors || [];
      throw new AppError(HttpStatus.BAD_REQUEST, errors.join(", ") || "Validation failed");
    }

    const search = dto.search || "";
    const page = dto.page ? Number(dto.page) : 1;
    const limit = dto.limit ? Number(dto.limit) : 10;

    const result = await this._membershipSvc.getAllPlans(search, page, limit);
    sendSuccess(res, HttpStatus.OK, result, "Memberships fetched successfully");
  });

  getTwoActiveMemberships = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this._membershipSvc.getTwoActivePlans();
    sendSuccess(res, HttpStatus.OK, result, "Active memberships fetched successfully");
  });

  getMembershipById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = GetMembershipDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", ") || "Validation failed");
    }

    const result = await this._membershipSvc.getPlanById(dto.id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Membership fetched successfully");
  });

  updateMembership = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = UpdateMembershipDto.from({ id: req.params.id, ...req.body });
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", ") || "Validation failed");
    }

    const result = await this._membershipSvc.updatePlan(dto.id, dto);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found");
    }

    sendSuccess(res, HttpStatus.OK, result, "Membership updated successfully");
  });

  deleteMembership = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const dto = DeleteMembershipDto.from(req.params);
    const validation = dto.validate();
    if (!validation.valid) {
      throw new AppError(HttpStatus.BAD_REQUEST, validation.errors?.join(", ") || "Validation failed");
    }

    const result = await this._membershipSvc.deletePlan(dto.id);
    if (!result) {
      throw new AppError(HttpStatus.NOT_FOUND, "Membership not found");
    }

    sendSuccess(res, HttpStatus.OK, null, "Membership deleted successfully");
  });
}
