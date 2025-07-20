"use client";

import React, { useEffect, useState } from "react";
import {  Users, TrendingUp, Award, Activity } from "lucide-react";
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
  longestStreak: number;
  lastSolvedDate: string;
};

type UserInventory = {
  keys: number;
  badges: any[];
  ownedAvatars: any[];
  ownedBanners: any[];
};

type UserMembership = {
  planId: string | null;
  type: string | null;
  isActive: boolean;
};

type LeaderboardUser = {
  _id: string;
  email: string;
  username: string;
  bio: string;
  avatar: string | null;
  banner: string | null;
  role: string;
  loginType: string;
  stats: UserStats;
  inventory: UserInventory;
  isBanned: boolean;
  isVerified: boolean;
  isOnline: boolean;
  membership: UserMembership;
  dailyRewardDay: number;
  lastRewardClaimDate: string;
  twoFactorEnabled: boolean;
  lastSeen: string;
  currentUser: boolean;
  notifications: boolean;
  timestamp: string;
  avgTimeTaken: number;
  totalXp: number;
  count: number;
};

type Statistics = {
  totalSubmissions: number;
  totalUsers: number;
  completionRate: number;
  successRate: number;
  topCompletedChallenges: {
    completions: number;
  }[];
};

type LeaderboardData = {
  users: LeaderboardUser[];
  totalItems: number;
  statistics: Statistics;
};

type UsersData = {
  totalUsers: number;
  activeUsersToday: number;
  newUsersLast7Days: number;
};

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UsersData | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [userRes, leaderboardRes] = await Promise.all([
          getUserAnalytics(),
          getLeaderboardAnalytics("txp", "all", "week", "desc", 1, 10),
        ]);
        console.log("userRes", userRes);
        console.log("leaderboardRes", leaderboardRes);
        setUserData(userRes.data);
        setLeaderboardData(leaderboardRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getTopPerformers = () => {
    if (!leaderboardData?.users.length) return null;

    const topXpUser = leaderboardData.users.reduce((prev, current) => 
      prev.stats.totalXpPoints > current.stats.totalXpPoints ? prev : current
    );

    const longestStreakUser = leaderboardData.users.reduce((prev, current) => 
      prev.stats.longestStreak > current.stats.longestStreak ? prev : current
    );

    return {
      topXpUser,
      longestStreakUser
    };
  };

  const topPerformers = getTopPerformers();

  const statsCards = [
    {
      title: "Total Users",
      value: userData?.totalUsers || 0,
      change: userData?.newUsersLast7Days || 0,
      changeText: "new this week",
      icon: Users,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Active Today",
      value: userData?.activeUsersToday || 0,
      change: leaderboardData?.statistics.completionRate || 0,
      changeText: "completion rate",
      icon: Activity,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "Total Submissions",
      value: leaderboardData?.statistics.totalSubmissions || 0,
      change: leaderboardData?.statistics.successRate || 0,
      changeText: "success rate",
      icon: TrendingUp,
      color: "from-purple-600 to-violet-600"
    },
    {
      title: "Top XP Points",
      value: topPerformers?.topXpUser.stats.totalXpPoints || 0,
      change: topPerformers?.longestStreakUser.stats.longestStreak || 0,
      changeText: "longest streak",
      icon: Award,
      color: "from-orange-600 to-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-6">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
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
              {/* <button
                onClick={() => downloadPDF(userData as UsersData, leaderboardData as any)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button> */}
            </div>
          </div>

          {leaderboardData && userData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsCards.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:bg-gray-800/60 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                          <IconComponent className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
                        <div className="flex items-center space-x-1 text-sm">
                          <span className="text-green-400">+{stat.change}</span>
                          <span className="text-gray-500">{stat.changeText}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {topPerformers && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-yellow-400" />
                      Top XP Earner
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {topPerformers.topXpUser.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{topPerformers.topXpUser.username}</p>
                        <p className="text-gray-400 text-sm">
                          {topPerformers.topXpUser.stats.totalXpPoints.toLocaleString()} XP Points
                        </p>
                        <p className="text-gray-500 text-xs">Level {topPerformers.topXpUser.stats.level}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Longest Streak
                    </h3>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {topPerformers.longestStreakUser.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{topPerformers.longestStreakUser.username}</p>
                        <p className="text-gray-400 text-sm">
                          {topPerformers.longestStreakUser.stats.longestStreak} day streak
                        </p>
                        <p className="text-gray-500 text-xs">
                          Current: {topPerformers.longestStreakUser.stats.currentStreak} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-purple-400" />
                    User Leaderboard
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/30">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">XP Points</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Level</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Streak</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Avg Time</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Submissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.users
                        .sort((a, b) => b.stats.totalXpPoints - a.stats.totalXpPoints)
                        .map((user, index) => (
                          <tr key={user._id} className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-500 text-black' :
                                  index === 1 ? 'bg-gray-400 text-black' :
                                  index === 2 ? 'bg-orange-600 text-white' :
                                  'bg-gray-600 text-white'
                                }`}>
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    {user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-white font-medium">{user.username}</p>
                                  <p className="text-gray-400 text-sm">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white font-semibold">
                                {user.stats.totalXpPoints.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-md text-sm">
                                Level {user.stats.level}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-white">
                                <span className="font-semibold">{user.stats.currentStreak}</span>
                                <span className="text-gray-400 text-sm ml-1">
                                  (Max: {user.stats.longestStreak})
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white">{user.avgTimeTaken}s</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-white">{user.count}</span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;