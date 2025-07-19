import React from "react";
import { Trophy, Star, Zap, Check, Briefcase, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserIF } from "@/types/user.types";

type Props = {
  users: UserIF[];
  isLoading: boolean;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  setTimeFilter: (val: "week" | "month" | "year") => void;
  setTypeFilter: (val: "txp" | "fastest" | "streak" | "level" | "rank") => void;
  setLevelFilter: (val: "novice" | "adept" | "master" | "all") => void;
};

const LeaderboardTable: React.FC<Props> = ({
  users,
  isLoading,
  showFilters,
  setShowFilters,
  setTimeFilter,
  setTypeFilter,
  setLevelFilter,
}) => {
  const router = useRouter();

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-gray-700 to-gray-750">
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer">
            <div className="flex items-center gap-1">
              <span>Rank</span>
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            User
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer">
            <div className="flex items-center gap-1">
              <span>XP Gained</span>
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer">
            <div className="flex items-center gap-1">
              <span>Solved</span>
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer">
            <div className="flex items-center gap-1">
              <span>Domains</span>
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
            Streak
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-700">
        {isLoading ? (
          <tr>
            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 mb-2 text-gray-600" />
                <p>Loading...</p>
              </div>
            </td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 mb-2 text-gray-600" />
                <p>No data available for the selected filters.</p>
                {showFilters ? (
                  <button
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                    onClick={() => {
                      setTimeFilter("week");
                      setTypeFilter("txp");
                      setLevelFilter("all");
                    }}
                  >
                    Clear filters
                  </button>
                ) : (
                  <button
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                    onClick={() => setShowFilters(true)}
                  >
                    Show filters
                  </button>
                )}
              </div>
            </td>
          </tr>
        ) : (
          users.map((user, index) => (
            <motion.tr
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              key={user._id}
              onClick={() => router.push(`/profile/${user.username}`)}
              className="hover:bg-gray-750 transition-colors cursor-pointer bg-opacity-50"
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400">
                    {index + 3 + 1}
                    {user.membership?.isActive && (
                      <Star size={14} className="text-yellow-500" />
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar.image}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover cursor-pointer mr-3"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 mr-3 flex items-center justify-center text-white font-medium">
                      {user.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{user.username}</span>
                      {user.membership?.isActive && (
                        <Star size={14} className="text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Level {user.stats.level || 1}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Zap size={16} className="text-yellow-500 mr-2" />
                  <span className="font-medium">
                    {user.stats.totalXpPoints}
                  </span>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>{0}</span>
                  <span className="text-gray-500 text-sm ml-1">/ {10}</span>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Briefcase size={16} className="text-blue-400 mr-2" />
                  <span>{user.stats.level || 0}</span>
                </div>
              </td>

              <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                <div
                  className={`px-2 py-1 text-xs rounded-lg inline-flex items-center
                    ${
                      user.stats.longestStreak >= 30
                        ? "bg-red-500 bg-opacity-20 text-white-400"
                        : user.stats.longestStreak >=20
                        ? "bg-yellow-500 bg-opacity-20 text-white-400"
                        : "bg-green-500 bg-opacity-20 text-white-400"
                    }`}
                >
                  <Target size={12} className="mr-1" />
                  {user.stats.longestStreak}
                </div>
              </td>
            </motion.tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
