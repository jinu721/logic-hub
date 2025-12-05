import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Code, ListFilter, Target } from "lucide-react";
import React from "react";

type FilteredTypes = {
  id: string;
  name: string;
};

type ChallengeLevel = {
  id: string;
  name: string;
};

type TimeFilter = "day" | "week" | "month" | "year" | "all";
type TypeFilter = "txp" | "score" | "fastest" | "memory" | "cpu" | "attempts";

type Props = {
  showFilters: boolean;
  timeFilter: TimeFilter;
  setTimeFilter: (value: TimeFilter) => void;
  typeFilter: TypeFilter;
  setTypeFilter: (value: TypeFilter) => void;
  filteredTypes: FilteredTypes[];
  levelFilter: "novice" | "adept" | "master" | "all";
  setLevelFilter: (value: "novice" | "adept" | "master" | "all") => void;
  challengeLevels: ChallengeLevel[];
  sortDirection: "asc" | "desc";
  setSortDirection: (value: "asc" | "desc") => void;
};

const FilterPanel: React.FC<Props> = ({
  showFilters,
  timeFilter,
  setTimeFilter,
  typeFilter,
  setTypeFilter,
  filteredTypes,
  levelFilter,
  setLevelFilter,
  challengeLevels,
  sortDirection,
  setSortDirection,
}) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gray-800 rounded-xl p-4 mb-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
                <Calendar size={16} className="mr-1.5" />
                Time Period
              </label>
              <select
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
                <Code size={16} className="mr-1.5" />
                Filter Type
              </label>
              <select
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              >
                {filteredTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
                <Target size={16} className="mr-1.5" />
                Difficulty Level
              </label>
              <select
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={levelFilter}
                onChange={(e) =>
                  setLevelFilter(
                    e.target.value as "novice" | "adept" | "master" | "all"
                  )
                }
              >
                {challengeLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2 flex items-center">
                <ListFilter size={16} className="mr-1.5" />
                Sort Direction
              </label>
              <select
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortDirection}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setSortDirection(e.target.value as "asc" | "desc");
                }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;
