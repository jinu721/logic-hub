import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/custom.request";
import { verifyAccessToken } from "../utils/verify.token";
import redisClient from "../config/redis.config";


const whitelist = ["/auth/logout", "/auth/refresh-token"];

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    if (whitelist.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log("No token provided");
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const isBlacklisted = await redisClient.get(`blacklist_${token}`);
    if (isBlacklisted) {
      console.log("Token is blacklisted");
      res.status(403).json({ message: "Token is blacklisted" });
      return;
    }

    const user = verifyAccessToken(token);

    if (!user) {
      console.log("Invalid or expired token");
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }

    (req as CustomRequest).user = user;

    next();
  } catch (err) {
    res
      .status(403)
      .json({ message: err instanceof Error ? err.message : "Forbidden" });
    return;
  }
};
