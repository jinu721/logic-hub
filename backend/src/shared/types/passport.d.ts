import { UserDocument } from "@modules/user";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      _id?: unknown;
      userId?: string;
      username: string;
      email: string;
      role: string;
      isBanned: boolean;
      isVerified: boolean;
      loginType: string;
      googleId?: string;
      githubId?: string;
      inventory?: {
        keys?: number;
        badges?: Types.ObjectId[];
        ownedAvatars?: Types.ObjectId[];
        ownedBanners?: Types.ObjectId[];
      };
      stats?: {
        totalXP?: number;
        totalScore?: number;
        totalSubmissions?: number;
        totalDomains?: number;
        totalChallenges?: number;
        longestStreak?: number;
      };
      timestamp?: Date;
      [key: string]: unknown;
    }
  }
}
