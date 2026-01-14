"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicReportDTOs = exports.toPublicReportDTO = void 0;
const toPublicReportDTO = (report) => {
    // If reporter is populated, it will be a user object, otherwise it's an ObjectId
    const reporterData = (typeof report.reporter === 'object' && report.reporter !== null && 'username' in report.reporter)
        ? report.reporter
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
exports.toPublicReportDTO = toPublicReportDTO;
const toPublicReportDTOs = (reports) => {
    return reports.map(exports.toPublicReportDTO);
};
exports.toPublicReportDTOs = toPublicReportDTOs;
