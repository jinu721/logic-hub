import jwt from "jsonwebtoken";
import { env } from "../../../config/env";

export interface AccessTokenPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  isBanned: boolean;
};

export interface RefreshTokenPayload {
  userId: string;
  role: string;
};

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET as string
    ) as AccessTokenPayload;

    return decoded;
  } catch (err) {
    console.error("Access Token verification failed:", err);
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      env.REFRESH_TOKEN_SECRET as string
    ) as RefreshTokenPayload;

    return decoded;
  } catch (err) {
    console.error("Refresh Token verification failed:", err);
    return null;
  }
};

export const verifyLinkToken = (token: string): AccessTokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      env.VERIFY_TOKEN_SECRET as string
    ) as AccessTokenPayload;

    return decoded;
  } catch (err) {
    console.error("Link Token verification failed:", err);
    return null;
  }
};
