import { IOrderResult } from "@shared/types";

export interface IPurchasePaymentService {
  createOrder(amount: number): Promise<IOrderResult>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}