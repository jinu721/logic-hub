import "express";

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
        xpPoints?: number;
        totalXpPoints?: number;
        level?: number;
        currentStreak?: number;
        longestStreak?: number;
        lastSolvedDate?: Date;
      };
      inventory?: {
        keys?: number;
        badges?: [Types.ObjectId];
        ownedAvatars?: [Types.ObjectId];
        ownedBanners?: [Types.ObjectId];
      };
      timestamp?: Date;
      [key: string]: unknown;
    }

    interface Request {
      user?: User;
    }
  }
}
