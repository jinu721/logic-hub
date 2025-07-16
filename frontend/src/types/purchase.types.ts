import { MembershipPlanIF } from "./membership.types";
import { UserIF } from "./user.types";

export interface PurchaseIF {
  _id?: string;
  userId: UserIF;
  planId: MembershipPlanIF;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  status: 'Success' | 'Failed';
  startedAt: Date;
  expiresAt: Date;
}