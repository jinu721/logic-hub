export interface PublicPurchaseDTO {
  _id: string;
  userId: string;
  planId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  status: 'Success' | 'Failed';
  startedAt: Date;
  expiresAt: Date;
}

