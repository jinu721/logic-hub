
import { HttpStatus } from "@constants";
import * as crypto from "crypto";
import { AppError } from "@utils/application";
import { IPurchasePaymentService } from "@modules/purchase";
import { env } from "@config/env";
import Razorpay from "razorpay";

export class PurchasePaymentService implements IPurchasePaymentService {
  constructor(private razorpayInstance: Razorpay, private secretKey: string) { }

  async createOrder(amount: number) {
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await this.razorpayInstance.orders.create(options);

    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      key: env.RAZORPAY_KEY_ID
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string) {
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", this.secretKey)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new AppError(HttpStatus.UNAUTHORIZED, "Invalid payment signature");
    }

    return true;
  }
}
