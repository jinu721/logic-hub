import { Types } from "mongoose";

export interface TokenAttrs {
  userId: Types.ObjectId;
  refreshToken: string;
  accessToken: string;
  device?: string;
  ip?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TokenPayloadIF = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  ip?: string;
  device?: string;
}