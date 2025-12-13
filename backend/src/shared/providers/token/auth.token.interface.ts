import { JwtPayloadBase } from "@shared/types";

export interface ITokenProvider {
  generateAccessToken(payload: JwtPayloadBase): string;
  generateRefreshToken(payload: JwtPayloadBase): string;
  generateLinkToken(payload: JwtPayloadBase): string;
  generateResetToken(payload: JwtPayloadBase): string;
  verifyLinkToken(token: string): JwtPayloadBase;
  verifyAccessToken(token: string): JwtPayloadBase;
  verifyRefreshToken(token: string): JwtPayloadBase;
  decodeToken(token: string): JwtPayloadBase | null;
}