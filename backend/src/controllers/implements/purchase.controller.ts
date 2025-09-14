import { Request, Response } from "express";
import { HttpStatus } from "../../constants/http.status";
import { IPurchaseController } from "../interfaces/purchase.controller.interface";
import { razorpay } from "../../config/razorpay.config";
import { env } from "../../config/env";
import { IPurchaseService } from "../../services/interfaces/purchase.service.interface";

export class PurchaseController implements IPurchaseController {
  constructor(private _purchaseSvc: IPurchaseService) {}

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { amount } = req.body;
      
      
      if (!amount) {
          res.status(HttpStatus.BAD_REQUEST).json({ message: "Amount is required" });
          return;
        }
        
        const options = {
            amount: Number(amount) * 100, 
            currency:"INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };
        
        const order = await razorpay.orders.create(options);
        console.log(order)

      res.status(HttpStatus.OK).json({
        message: "Order created successfully",
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key:env.RAZORPAY_KEY_ID
      });
    } catch (err) {
      console.error(err);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error Creating Razorpay Order" });
    }
  }

  async createMembershipPurchase(req: Request, res: Response) {
    try {
      const {
        planId,
        amount,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      } = req.body;

      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const purchase = await this._purchaseSvc.createPlanPurchase({
        userId,
        planId,
        razorpayOrderId,
        razorpayPaymentId,
        amount,
        razorpaySignature,
        status:"Success",
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Membership purchase created successfully",
        data: purchase,
      });
    } catch (err: any) {
        console.log(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message || "Failed to create membership purchase",
      });
    }
  }

  async getUserMembershipHistory(req: Request, res: Response) {
    try {
      const userId = req.params.userId;

      const purchases = await this._purchaseSvc.getUserPurchases(userId);

      res.status(HttpStatus.OK).json({
        success: true,
        data: purchases,
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Failed to fetch membership history",
      });
    }
  }

  async getPlanHistoryById(req: Request, res: Response): Promise<void> {
    try {
        const {id} = req.params;
  
        const purchase = await this._purchaseSvc.getPlanHistoryById(id);
  
        res.status(HttpStatus.OK).json({
          success: true,
          purchase,
        });
      } catch (error: any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || "Failed to fetch membership history",
        });
      }
  }
  async getPlanHistory(req: Request, res: Response): Promise<void> {
    try {
       const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const purchases = await this._purchaseSvc.getPlanHistory(page,limit);
  
        res.status(HttpStatus.OK).json({
          success: true,
          purchases,
        });
      } catch (error: any) {
        console.log(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: error.message || "Failed to fetch membership history",
        });
      }
  }
}
