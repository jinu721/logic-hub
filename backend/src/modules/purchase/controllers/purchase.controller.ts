import { Request, Response } from "express";
import { HttpStatus } from "@constants/http.status";
import { 
  IPurchaseController, 
  IPurchasePaymentService,
  IPurchaseCommandService,
  IPurchaseQueryService,

} from "@modules/purchase";
import { sendSuccess, asyncHandler, AppError } from "@utils/application";

export class PurchaseController implements IPurchaseController {
  constructor(
    private readonly paymentSvc: IPurchasePaymentService,
    private readonly commandSvc: IPurchaseCommandService,
    private readonly querySvc: IPurchaseQueryService,
  ) {}

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { amount } = req.body
    if (!amount) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Amount is required")
    }

    const order = await this.paymentSvc.createOrder(amount)

    sendSuccess(res, HttpStatus.OK, order, "Order created successfully")
  })

  createMembershipPurchase = asyncHandler(async (req: Request, res: Response) => {
    const { planId, amount, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body

    if (!planId || !amount || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new AppError(HttpStatus.BAD_REQUEST, "All fields are required")
    }

    const userId = (req as any).user?.userId
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Unauthorized")
    }

    this.paymentSvc.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    const purchase = await this.commandSvc.createPlanPurchase({
      userId,
      planId,
      amount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: "Success",
    })

    sendSuccess(res, HttpStatus.CREATED, purchase, "Membership purchase created successfully")
  })

  getUserMembershipHistory = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    if (!userId) {
      throw new AppError(HttpStatus.BAD_REQUEST, "User ID is required")
    }

    const purchases = await this.querySvc.getUserPurchases(userId)
    sendSuccess(res, HttpStatus.OK, purchases, "Membership history fetched successfully")
  })

  getPlanHistoryById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    if (!id) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Purchase ID is required")
    }

    const purchase = await this.querySvc.getPlanHistoryById(id)
    sendSuccess(res, HttpStatus.OK, purchase, "Membership history fetched successfully")
  })

  getPlanHistory = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    const result = await this.querySvc.getPlanHistory(page, limit)
    sendSuccess(res, HttpStatus.OK, result, "Membership history fetched successfully")
  })
}
