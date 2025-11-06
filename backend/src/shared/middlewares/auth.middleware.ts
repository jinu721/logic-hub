import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token/verify.token";
import redisClient from "../../config/redis.config";
import { AppError } from "@utils/application/app.error";

const whitelist = ["/auth/logout", "/auth/refresh-token"];

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    if (whitelist.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw new AppError(401, "No token provided");
    }

    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) {
      throw new AppError(403, "Token is blacklisted");
    }

    const user = verifyAccessToken(token);
    if (!user) {
      throw new AppError(401, "Invalid or expired token");
    }

    req.user = user;
    next();

  } catch (err) {
    next(err); 
  }
};
