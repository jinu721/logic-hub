import React from "react";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { UserIF } from "@/types/user.types";
import { LeaderboardRow } from "./Leaderboard";

type TimeFilter = "day" | "week" | "month" | "year" | "all";
type TypeFilter = "txp" | "score" | "fastest" | "memory" | "cpu" | "attempts";

type Props = {
  users: LeaderboardRow[];
  isLoading: boolean;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  setTimeFilter: (val: TimeFilter) => void;
  setTypeFilter: (val: TypeFilter) => void;
  setLevelFilter: (val: "novice" | "adept" | "master" | "all") => void;
  typeFilter: TypeFilter;
};

const LeaderboardTable: React.FC<Props> = ({
  users,
  isLoading,
  showFilters,
  setShowFilters,
  setTimeFilter,
  setTypeFilter,
  setLevelFilter,
  typeFilter,
}) => {
  const router = useRouter();

  const metricLabel = () => {
    switch (typeFilter) {
      case "txp":
        return "Total XP";
      case "score":
        return "Score";
      case "fastest":
        return "Avg Time (ms)";
      case "memory":
        return "Avg Memory (KB)";
      case "cpu":
        return "Avg CPU Time";
      case "attempts":
        return "Solved";
      default:
        return "Metric";
    }
  };

  const getMetricValue = (row: LeaderboardRow) => {
    switch (typeFilter) {
      case "txp":
        return row.totalXp ?? 0;
      case "score":
        return row.totalScore ?? 0;
      case "fastest":
        return Math.round(row.avgTimeTaken ?? 0);
      case "memory":
        return Math.round(row.avgMemoryUsed ?? 0);
      case "cpu":
        return Math.round(row.avgCpuTime ?? 0);
      case "attempts":
        return row.submissionsCount ?? 0;
      default:
        return 0;
    }
  };

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-gradient-to-r from-gray-700 to-gray-750">
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span>Rank</span>
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            User
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span>{metricLabel()}</span>
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span>Solved</span>
            </div>
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">
            Avg Time (ms)
          </th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-700">
        {isLoading ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
              <div className="flex flex-col items-center">
                <Trophy className="h-8 w-8 mb-2 text-gray-600" />
                <p>Loading...</p>
              </div>
            </td>
          </tr>
        ) : users.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
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
          users.map((row, index) => {
            const baseUser: UserIF = row.user;
            return (
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                key={baseUser._id}
                onClick={() => router.push(`/profile/${baseUser.username}`)}
                className="hover:bg-gray-750 transition-colors cursor-pointer bg-opacity-50"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-400">
                      {row.rank ?? index + 4}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {baseUser.avatar ? (
                      <img
                        src={baseUser.avatar.image}
                        alt={baseUser.username}
                        className="w-8 h-8 rounded-full object-cover cursor-pointer mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 mr-3 flex items-center justify-center text-white font-medium">
                        {baseUser.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{baseUser.username}</span>
                        {baseUser.membership?.isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500 text-gray-900 font-semibold">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        Level {baseUser.stats?.level || 1}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="font-medium">
                    {getMetricValue(row)}
                  </span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <span>{row.submissionsCount ?? 0}</span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                  <span>{Math.round(row.avgTimeTaken ?? 0)}</span>
                </td>
              </motion.tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
