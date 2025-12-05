"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getUserAnalytics, getLeaderboardAnalytics } from "@/services/client/clientServices";
import Spinner from "@/components/shared/CustomLoader";

import StatsGrid from "./StatsGrid";
import ChartsGrid from "./ChartsGrid";
import PerformanceGrid from "./PerformanceGrid";

type UsersData = {
  totalUsers: number;
  activeUsersToday: number;
  newUsersLast7Days: number;
};

type PublicUserStats = {
  xpPoints?: number;
  totalXpPoints?: number;
  level?: number;
  currentStreak?: number;
  longestStreak?: number;
};

type PublicUser = {
  _id: string;
  username: string;
  email?: string;
  stats?: PublicUserStats;
};

type LeaderboardRow = {
  rank: number;
  user: PublicUser;
  avgTimeTaken: number;
  avgMemoryUsed: number;
  avgCpuTime: number;
  totalXp: number;
  totalScore: number;
  submissionsCount: number;
};

type Statistics = {
  totalSubmissions: number;
  totalUsers: number;
  completionRate: number;
  successRate: number;
  topCompletedChallenges: {
    name: string;
    completions: number;
  }[];
};

type LeaderboardData = {
  users: LeaderboardRow[];
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    sortBy: string;
    sortField: string;
    order: string;
    period: string;
    category: string;
  };
  statistics: Statistics;
};

const AdminAnalyticsDashboard: React.FC = () => {
  const [userData, setUserData] = useState<UsersData | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const [userRes, leaderboardRes] = await Promise.all([
          getUserAnalytics(),
          getLeaderboardAnalytics("txp", "all", "week", "desc", 1, 20),
        ]);

        const userPayload = userRes?.data?.data || userRes?.data || userRes;
        const leaderboardPayload = leaderboardRes?.data?.data || leaderboardRes?.data || leaderboardRes;

        setUserData(userPayload as UsersData);
        setLeaderboardData(leaderboardPayload as LeaderboardData);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setUserData(null);
        setLeaderboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // -------- Top performers (for PerformanceGrid + summary) ----------
  const topPerformers = useMemo(() => {
    if (!leaderboardData?.users?.length) {
      return null;
    }

    const rows = leaderboardData.users;

    const topEarner = rows.reduce((prev, current) =>
      (prev.totalXp || 0) > (current.totalXp || 0) ? prev : current
    );

    const longestStreakAgg = rows.reduce((prev, current) => {
      const prevStreak = prev.user.stats?.longestStreak ?? 0;
      const currStreak = current.user.stats?.longestStreak ?? 0;
      return prevStreak > currStreak ? prev : current;
    });

    return {
      topEarner: {
        username: topEarner.user.username,
        totalXP: topEarner.totalXp || 0,
      },
      longestStreakAgg: {
        username: longestStreakAgg.user.username,
        stats: {
          longestStreak: longestStreakAgg.user.stats?.longestStreak ?? 0,
        },
      },
    };
  }, [leaderboardData]);

  // -------- XP distribution for ChartsGrid ----------
  const xpDistributionData = useMemo(() => {
    if (!leaderboardData?.users?.length) return [];

    // take top 8 users for chart
    return leaderboardData.users.slice(0, 8).map((row) => ({
      name: row.user.username,
      currentXP: row.totalXp || 0,
      totalXP: row.totalScore || row.totalXp || 0,
    }));
  }, [leaderboardData]);

  // -------- Challenge type / challenge completion distribution ----------
  const typeDistribution = useMemo(() => {
    if (!leaderboardData?.statistics?.topCompletedChallenges?.length) {
      return [];
    }
    const topChallenges = leaderboardData.statistics.topCompletedChallenges;
    const total = topChallenges.reduce((sum, c) => sum + c.completions, 0) || 1;

    return topChallenges.map((c) => ({
      name: c.name,
      count: c.completions,
      percentage: Math.round((c.completions / total) * 100),
    }));
  }, [leaderboardData]);

  const typeDistributionColors = [
    "#8b5cf6",
    "#06b6d4",
    "#f97316",
    "#22c55e",
    "#eab308",
  ];

  // -------- Submission trend data (fake for now, based on stats) ----------
  const submissionData = useMemo(() => {
    if (!leaderboardData?.statistics) return [];

    const total = leaderboardData.statistics.totalSubmissions || 0;
    // simple synthetic weekly trend
    return [
      { name: "Mon", solved: Math.round(total * 0.12), total: total },
      { name: "Tue", solved: Math.round(total * 0.15), total: total },
      { name: "Wed", solved: Math.round(total * 0.2), total: total },
      { name: "Thu", solved: Math.round(total * 0.18), total: total },
      { name: "Fri", solved: Math.round(total * 0.16), total: total },
      { name: "Sat", solved: Math.round(total * 0.1), total: total },
      { name: "Sun", solved: Math.round(total * 0.09), total: total },
    ];
  }, [leaderboardData]);

  // -------- Leaderboard slice for PerformanceGrid ----------
  const performanceLeaderboardData = useMemo(() => {
    if (!leaderboardData?.users?.length) return [];

    return leaderboardData.users.slice(0, 10).map((row) => ({
      id: row.user._id,
      rank: row.rank,
      username: row.user.username,
      solvedCount: row.submissionsCount || 0,
      stats: {
        xpPoints: row.totalXp || 0,
        level: row.user.stats?.level || 1,
        currentStreak: row.user.stats?.currentStreak || 0,
        longestStreak: row.user.stats?.longestStreak,
      },
    }));
  }, [leaderboardData]);

  // -------- Data for StatsGrid ----------
  const statsGridDashboardData = useMemo(
    () => ({
      stats: {
        completionRate: leaderboardData?.statistics?.completionRate || 0,
        weeklyActivity: {
          growth: 12, // fake growth for now, until you track this on backend
        },
      },
    }),
    [leaderboardData]
  );

  const chartsDashboardData = useMemo(
    () => ({
      stats: {
        typeDistribution,
      },
    }),
    [typeDistribution]
  );

  const performanceDashboardData = useMemo(
    () => ({
      leaderboardData: performanceLeaderboardData,
      topPerformers: topPerformers || {
        topEarner: { username: "-", totalXP: 0 },
        longestStreakAgg: { username: "-", stats: { longestStreak: 0 } },
      },
      stats: {
        totalSubmissions: leaderboardData?.statistics?.totalSubmissions || 0,
      },
    }),
    [performanceLeaderboardData, topPerformers, leaderboardData]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Admin Analytics
              </h1>
              <p className="text-gray-400 mt-1">
                Overview of platform health, user growth, and challenge performance
              </p>
            </div>
          </div>

          {/* Top KPI cards */}
          {userData && leaderboardData && (
            <StatsGrid userData={userData} dashboardData={statsGridDashboardData} />
          )}

          {/* Charts: XP distribution + challenge type distribution */}
          {leaderboardData && (
            <ChartsGrid
              xpDistributionData={xpDistributionData}
              dashboardData={chartsDashboardData}
              typeDistributionColors={typeDistributionColors}
            />
          )}

          {/* Performance section: submission trend + top performers */}
          {leaderboardData && (
            <PerformanceGrid
              submissionData={submissionData}
              dashboardData={performanceDashboardData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAnalyticsDashboard;
