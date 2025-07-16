"use client";

import React, { useEffect, useState } from "react";
import {
  Trophy,
} from "lucide-react";
import { motion} from "framer-motion";
import SearchUsers from "./SearchUsers";
import LeaderboardHeader from "./LeaderboardHeader";
import TopPerformerCards from "./TopPerformerCards";
import FilterPanel from "./FilterPanel";
import LeaderboardTable from "./LeaderboardTable";
import ChallengeStats from "./ChallengeStats";
import UserPagination from "./UserPagination";
import { getLeaderboardAnalytics } from "@/services/client/clientServices";
import { Stats } from "@/types/leaderboard.types";

const Leaderboard = () => {

  const [users, setUsers] = useState([]);

  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">("week");
  const [typeFilter, setTypeFilter] = useState<"txp" | "fastest" | "streak" | "level" | "rank" | "domain" | "category">("txp");
  const [levelFilter, setLevelFilter] = useState<"novice" | "adept" | "master" | "all">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedView, setSelectedView] = useState("leaderboard");
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [statistics, setStatistics] = useState<Stats>({});
  const [page,setPage] = useState(1);
  const limit = 10;

  const fetchLeaderboardData = async (based?:string,category?:string,period?:string,order?:string,page?:number,limit?:number) => {
    try {
      setIsLoading(true);
      const response = await getLeaderboardAnalytics(based,category,period,order,page,limit);
      console.log("Leaderboard Data:", response);
      setUsers(response.data.users);
      setTotalItems(response.data.totalItems);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }finally{
      setIsLoading(false);
    }
  }; 


  useEffect(() => {
    fetchLeaderboardData(typeFilter,levelFilter,timeFilter,sortDirection,page,limit);
  }, [typeFilter, levelFilter, timeFilter, sortDirection,page,limit]);


  const filteredTypes = [
    { id: "txp", name: "Total XP" },
    { id: "fastest", name: "Fastest" },
    { id: "streak", name: "Streak" },
    { id: "level", name: "Level" },
    { id: "rank", name: "Rank" },
    { id: "domain", name: "Domain" },
    { id: "category", name: "Category" },
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

          <LeaderboardHeader selectedView={selectedView} setSelectedView={setSelectedView} showFilters={showFilters} setShowFilters={setShowFilters} />
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
            <>
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
                  />
                </div>
                <UserPagination currentPage={page} setCurrentPage={setPage} itemsPerPage={limit} totalItems={totalItems} /> 
              </div>
            </>
          ) : (
            <ChallengeStats stats={statistics} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
