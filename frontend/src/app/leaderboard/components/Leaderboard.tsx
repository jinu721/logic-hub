"use client";

import React, { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import SearchUsers from "./SearchUsers";
import LeaderboardHeader from "./LeaderboardHeader";
import TopPerformerCards from "./TopPerformerCards";
import FilterPanel from "./FilterPanel";
import LeaderboardTable from "./LeaderboardTable";
import ChallengeStats from "./ChallengeStats";
import UserPagination from "./UserPagination";
import { getLeaderboardAnalytics } from "@/services/client/clientServices";
import { Stats } from "@/types/leaderboard.types";
import { UserIF } from "@/types/user.types";

type TimeFilter = "day" | "week" | "month" | "year" | "all";
type TypeFilter = "txp" | "score" | "fastest" | "memory" | "cpu" | "attempts";

export interface LeaderboardRow {
  rank: number;
  user: UserIF;
  avgTimeTaken?: number;
  avgMemoryUsed?: number;
  avgCpuTime?: number;
  totalXp?: number;
  totalScore?: number;
  submissionsCount?: number;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardRow[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("txp");
  const [levelFilter, setLevelFilter] = useState<
    "novice" | "adept" | "master" | "all"
  >("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedView, setSelectedView] = useState<"leaderboard" | "stats">(
    "leaderboard"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [statistics, setStatistics] = useState<Stats>({} as Stats);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchLeaderboardData = async (
    based?: string,
    category?: string,
    period?: string,
    order?: string,
    pageParam?: number,
    limitParam?: number
  ) => {
    try {
      setIsLoading(true);
      const response = await getLeaderboardAnalytics(
        based,
        category,
        period,
        order,
        pageParam,
        limitParam
      );

      const data = response.data || response; 

      setUsers((data.users || []) as LeaderboardRow[]);
      const total = data.meta?.totalItems ?? data.totalItems ?? 0;
      setTotalItems(total);
      setStatistics(data.statistics || ({} as Stats));
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setUsers([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(
      typeFilter,
      levelFilter,
      timeFilter,
      sortDirection,
      page,
      limit
    );
  }, [typeFilter, levelFilter, timeFilter, sortDirection, page, limit]);

  const filteredTypes = [
    { id: "txp", name: "Total Points" },
    { id: "score", name: "Game Score" },
    { id: "fastest", name: "Fastest Finish" },
    { id: "memory", name: "Memory Master" },
    { id: "cpu", name: "Quick Thinking" },
    { id: "attempts", name: "Top Solver" },
  ];

  const challengeLevels = [
    { id: "all", name: "All Levels" },
    { id: "novice", name: "Novice" },
    { id: "adept", name: "Adept" },
    { id: "master", name: "Master" },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Master Escapers Leaderboard
              </h1>
              <p className="text-gray-400 mt-1">
                Compete with fellow escapers and climb the ranks
              </p>
            </div>
            <SearchUsers />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 text-gray-100 p-4 rounded-xl"
        >
          <LeaderboardHeader
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          <TopPerformerCards users={users.slice(0, 3)} />

          <FilterPanel
            showFilters={showFilters}
            timeFilter={timeFilter}
            setTimeFilter={setTimeFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            filteredTypes={filteredTypes}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            challengeLevels={challengeLevels}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />

          {selectedView === "leaderboard" ? (
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <LeaderboardTable
                  users={users.slice(3)}
                  isLoading={isLoading}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  setTimeFilter={setTimeFilter}
                  setTypeFilter={setTypeFilter}
                  setLevelFilter={setLevelFilter}
                  typeFilter={typeFilter}
                />
              </div>
              <UserPagination
                currentPage={page}
                setCurrentPage={setPage}
                itemsPerPage={limit}
                totalItems={totalItems}
              />
            </div>
          ) : (
            <ChallengeStats stats={statistics} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
