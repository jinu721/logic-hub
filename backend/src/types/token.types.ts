import { Document } from "mongoose";

export interface TokenIF extends Document {
  userId: string;
  refreshToken: string;
  accessToken: string;
  device?: string;
  ip?: string;
  createdAt?: Date;
  updatedAr?: Date;
}

export type TokenPayloadIF = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  ip?: string;
  device?: string;
}