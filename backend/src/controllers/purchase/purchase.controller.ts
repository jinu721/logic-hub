import { Request, Response } from "express";
import { HttpStatus } from "../../shared/constants/http.status";
import { IPurchaseController } from "./purchase.controller.interface";
import { razorpay } from "../../config/razorpay.config";
import { env } from "../../config/env";
import { IPurchaseService } from "../../services/interfaces/purchase.service.interface";
import { sendSuccess } from "../../shared/utils/application/response.util";
import { asyncHandler } from "../../shared/utils/application/async.handler";
import { AppError } from "../../shared/utils/application/app.error";

export class PurchaseController implements IPurchaseController {
  constructor(private readonly _purchaseSvc: IPurchaseService) {}

  createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { amount } = req.body;
    if (!amount) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Amount is required");
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);

    sendSuccess(
      res,
      HttpStatus.OK,
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: env.RAZORPAY_KEY_ID,
      },
      "Order created successfully"
    );
  });

  createMembershipPurchase = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { planId, amount, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!planId || !amount || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new AppError(HttpStatus.BAD_REQUEST, "All fields are required");
    }

    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const purchase = await this._purchaseSvc.createPlanPurchase({
      userId,
      planId,
      razorpayOrderId,
      razorpayPaymentId,
      amount,
      razorpaySignature,
      status: "Success",
    });

    sendSuccess(res, HttpStatus.CREATED, purchase, "Membership purchase created successfully");
  });

  getUserMembershipHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required");
    }

    const purchases = await this._purchaseSvc.getUserPurchases(userId);
    sendSuccess(res, HttpStatus.OK, purchases, "Membership history fetched successfully");
  });

  getPlanHistoryById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Purchase ID is required");
    }

    const purchase = await this._purchaseSvc.getPlanHistoryById(id);
    sendSuccess(res, HttpStatus.OK, purchase, "Membership history fetched successfully");
  });

  getPlanHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const purchases = await this._purchaseSvc.getPlanHistory(page, limit);
    sendSuccess(res, HttpStatus.OK, purchases, "Membership history fetched successfully");
  });
}
