import { PublicReportDTO } from "@modules/report/dtos";
import { ReportDocument } from "@modules/report";
import { PublicUserDTO } from "@modules/user/dtos";

export const toPublicReportDTO = (report: ReportDocument): PublicReportDTO => {
  // If reporter is populated, it will be a user object, otherwise it's an ObjectId
  const reporterData: PublicUserDTO = (typeof report.reporter === 'object' && report.reporter !== null && 'username' in report.reporter)
    ? report.reporter as unknown as PublicUserDTO
    : {
        userId: report.reporter.toString(),
        email: "",
        username: "Unknown User",
        bio: "",
        avatar: null,
        banner: null,
        role: "user",
        loginType: "normal",
        googleId: null,
        githubId: null,
        stats: {
          xpPoints: 0,
          totalXpPoints: 0,
          level: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastSolvedDate: null,
        },
        inventory: {
          keys: 0,
          badges: [],
          ownedAvatars: [],
          ownedBanners: [],
        },
        isBanned: false,
        isVerified: false,
        isOnline: false,
        membership: undefined,
        dailyRewardDay: 0,
        lastRewardClaimDate: new Date(),
        twoFactorEnabled: false,
        lastSeen: null,
        currentUser: false,
        notifications: false,
        timestamp: new Date(),
      };

  return {
    _id: String(report._id),
    reporter: reporterData,
    reportedType: report.reportedType,
    reportedId: String(report.reportedId),
    reason: report.reason,
    description: report.description,
    status: report.status,
    createdAt: report.createdAt,
  };
};

export const toPublicReportDTOs = (reports: ReportDocument[]): PublicReportDTO[] => {
  return reports.map(toPublicReportDTO);
};
