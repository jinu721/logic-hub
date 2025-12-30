import { Types, Document } from "mongoose";

export interface TokenAttrs {
  userId: Types.ObjectId;
  refreshToken: string;
  accessToken: string;
  device?: string;
  ip?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TokenDocument extends TokenAttrs, Document {}

export type TokenPayloadIF = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  ip?: string;
  device?: string;
}

// Legacy interface name for backward compatibility
export interface TokenIF extends TokenDocument { }