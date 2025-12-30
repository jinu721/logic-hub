import { Request, Response } from "express";
import { AuthRequest } from "@shared/types";
import { HttpStatus } from "@constants/http.status";
import {
  IPurchaseController,
  IPurchasePaymentService,
  IPurchaseCommandService,
  IPurchaseQueryService,

} from "@modules/purchase";
import { CreateMembershipPurchaseDto, CreateOrderDto, GetPlanHistoryByIdDto, GetPlanHistoryDto, GetUserMembershipHistoryDto } from "@modules/purchase/dtos";
import { sendSuccess, asyncHandler, AppError, toObjectId } from "@utils/application";

export class PurchaseController implements IPurchaseController {
  constructor(
    private readonly paymentSvc: IPurchasePaymentService,
    private readonly commandSvc: IPurchaseCommandService,
    private readonly querySvc: IPurchaseQueryService,
  ) { }

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const dto = CreateOrderDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const order = await this.paymentSvc.createOrder(dto.amount);
    sendSuccess(res, HttpStatus.OK, order, "Order created successfully");
  });

  createMembershipPurchase = asyncHandler(async (req: Request, res: Response) => {
    const dto = CreateMembershipPurchaseDto.from(req.body);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const userId = (req as AuthRequest).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    this.paymentSvc.verifySignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);

    const purchase = await this.commandSvc.createPlanPurchase({
      userId: toObjectId(userId),
      planId: toObjectId(dto.planId),
      amount: dto.amount,
      razorpayOrderId: dto.razorpayOrderId,
      razorpayPaymentId: dto.razorpayPaymentId,
      razorpaySignature: dto.razorpaySignature,
      status: "Success",
    });

    sendSuccess(res, HttpStatus.CREATED, purchase, "Membership purchase created successfully");
  });

  getUserMembershipHistory = asyncHandler(async (req: Request, res: Response) => {
    const dto = GetUserMembershipHistoryDto.from(req.params);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const purchases = await this.querySvc.getUserPurchases(dto.userId);
    sendSuccess(res, HttpStatus.OK, purchases, "Membership history fetched successfully");
  });

  getPlanHistoryById = asyncHandler(async (req: Request, res: Response) => {
    const dto = GetPlanHistoryByIdDto.from(req.params);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const purchase = await this.querySvc.getPlanHistoryById(dto.id);
    sendSuccess(res, HttpStatus.OK, purchase, "Membership history fetched successfully");
  });

  getPlanHistory = asyncHandler(async (req: Request, res: Response) => {
    const dto = GetPlanHistoryDto.from(req.query);
    const valid = dto.validate();
    if (!valid.valid) throw new AppError(HttpStatus.BAD_REQUEST, valid.errors.join(","));

    const page = dto.page ? Number(dto.page) : 1;
    const limit = dto.limit ? Number(dto.limit) : 10;

    const result = await this.querySvc.getPlanHistory(page, limit);
    sendSuccess(res, HttpStatus.OK, result, "Membership history fetched successfully");
  });
}
