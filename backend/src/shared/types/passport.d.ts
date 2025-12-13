import { UserDocument } from "@modules/user";

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
