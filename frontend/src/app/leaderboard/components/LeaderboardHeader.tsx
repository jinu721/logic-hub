import { Trophy, BarChart3, Filter, ChevronDown } from "lucide-react";

interface Props {
  selectedView: "leaderboard" | "stats";
  setSelectedView: (view: "leaderboard" | "stats") => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
}

const LeaderboardHeader = ({
  selectedView,
  setSelectedView,
  showFilters,
  setShowFilters,
}: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Trophy className="mr-2 text-yellow-500" />
          Codescape Leaderboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Top performers across all challenges and domains
        </p>
      </div>

      <div className="mt-4 lg:mt-0 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-lg flex items-center text-sm font-medium transition-all 
          ${
            selectedView === "leaderboard"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setSelectedView("leaderboard")}
        >
          <Trophy size={16} className="mr-1.5" />
          Leaderboard
        </button>

        <button
          className={`px-3 py-1.5 rounded-lg flex items-center text-sm font-medium transition-all
          ${
            selectedView === "stats"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          onClick={() => setSelectedView("stats")}
        >
          <BarChart3 size={16} className="mr-1.5" />
          Statistics
        </button>

        <button
          className="px-3 py-1.5 bg-gray-800 rounded-lg flex items-center text-sm font-medium text-gray-300 hover:bg-gray-700 transition-all"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-1.5" />
          Filters
          <ChevronDown
            size={16}
            className={`ml-1.5 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
