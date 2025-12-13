import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@config/env";
import { ITokenProvider } from "./auth.token.interface";
import { JwtPayloadBase } from "@shared/types/auth.types";

export class TokenProvider implements ITokenProvider {
  private ensurePayload(data: string | JwtPayload): JwtPayloadBase {
    if (typeof data === "string" || !data || typeof data !== "object") {
      throw new Error("Invalid token payload");
    }
    return data as JwtPayloadBase;
  }

  generateAccessToken(payload: JwtPayloadBase): string {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET!, { expiresIn: "1d" });
  }

  generateRefreshToken(payload: JwtPayloadBase): string {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
  }

  generateLinkToken(payload: JwtPayloadBase): string {
    return jwt.sign(payload, env.VERIFY_TOKEN_SECRET!, { expiresIn: "1h" });
  }

  generateResetToken(payload: JwtPayloadBase): string {
    return jwt.sign(payload, env.RESET_TOKEN_SECRET!, { expiresIn: "15m" });
  }

  verifyLinkToken(token: string): JwtPayloadBase {
    return this.ensurePayload(jwt.verify(token, env.VERIFY_TOKEN_SECRET!));
  }

  verifyAccessToken(token: string): JwtPayloadBase {
    return this.ensurePayload(jwt.verify(token, env.ACCESS_TOKEN_SECRET!));
  }

  verifyRefreshToken(token: string): JwtPayloadBase {
    return this.ensurePayload(jwt.verify(token, env.REFRESH_TOKEN_SECRET!));
  }

  decodeToken(token: string): JwtPayloadBase | null {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") return null;
    return decoded as JwtPayloadBase;
  }
}
