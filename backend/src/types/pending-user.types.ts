import { Document } from "mongoose";

export interface PendingUserIF extends Document {
  username: string;
  email: string;
  password: string;
  otp: number;
  createdAt: Date;
  expiresAt: Date;
}