"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { downloadPDF } from "@/utils/download.pdf";
import StatGrid from "./StatGrid";
import ChartsGrid from "./ChartGrid";
import PerformanceGrid from "./PerformanceGrid";
import {
  getUserAnalytics,
  getLeaderboardAnalytics,
} from "@/services/client/clientServices";
import Spinner from "@/components/shared/CustomLoader";

type UserStats = {
  xpPoints: number;
  totalXpPoints: number;
  level: number;
  currentStreak: number;
  longestStreak?: number;
};

type LeaderboardUser = {
  id: string | number;
  rank: number;
  username: string;
  solvedCount: number;
  submissions: number;
  stats: UserStats;
};

type TopPerformers = {
  topEarner: {
    username: string;
    totalXP: number;
  };
  longestStreakAgg: {
    username: string;
    stats: {
      longestStreak: number;
    };
  };
};

type DashboardStats = {
  totalSubmissions: number;
  completionRate: number;
  weeklyActivity: {
    growth: number;
  };
  typeDistribution: {
    name: string;
    count: number;
    percentage: number;
  }[];
};

type DashboardData = {
  leaderboardData: LeaderboardUser[];
  topPerformers: TopPerformers;
  stats: DashboardStats;
};

type UsersData = {
  totalUsers: number;
  activeUsersToday: number;
  newUsersLast7Days: number;
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UsersData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [userRes, leaderboardRes] = await Promise.all([
          getUserAnalytics(),
          getLeaderboardAnalytics(),
        ]);
        setUserData(userRes.data);
        setDashboardData(leaderboardRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const xpDistributionData = dashboardData
    ? dashboardData.leaderboardData.map((user) => ({
        name: user.username,
        currentXP: user.stats.xpPoints,
        totalXP: user.stats.totalXpPoints,
        level: user.stats.level,
      }))
    : [];

  const submissionData = dashboardData
    ? dashboardData.leaderboardData.map((user) => ({
        name: user.username,
        solved: user.solvedCount,
        total: user.submissions,
        streak: user.stats.currentStreak,
      }))
    : [];

  const typeDistributionColors = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
        <Spinner/>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6" id="dashboard-content">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Leaderboard Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Track user performance and challenge statistics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors">
                Today
              </button>
              <button
                onClick={() => downloadPDF(userData as UsersData, dashboardData as DashboardData)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
          {dashboardData && userData &&(
            <>
              <StatGrid userData={userData} dashboardData={dashboardData} />
              <ChartsGrid
                xpDistributionData={xpDistributionData}
                dashboardData={dashboardData}
                typeDistributionColors={typeDistributionColors}
              />
              <PerformanceGrid
                submissionData={submissionData}
                dashboardData={dashboardData}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
