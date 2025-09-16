import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { ITokenProvider } from "./auth.token.interface";

export class TokenProvider implements ITokenProvider {
  generateAccessToken(payload: any): string {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
  }
  generateRefreshToken(payload: any): string {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
  }
  generateLinkToken(payload: any): string {
    return jwt.sign(payload, env.VERIFY_TOKEN_SECRET!, { expiresIn: "1h" });
  }
  generateResetToken(payload: any): string {
    return jwt.sign(payload, env.RESET_TOKEN_SECRET!, { expiresIn: "15m" });
  }
  verifyToken(token: string): any {
    return jwt.verify(token, env.ACCESS_TOKEN_SECRET!);
  }
}
