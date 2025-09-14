import React, { useState, useMemo } from "react";
import {
  Filter,
  X,
  Search,
  Code,
  KeySquare,
  Database,
  CheckCircle,
  PenTool,
  MoveVertical,
  Puzzle,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Tag,
  Award,
} from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";

function getCountByKey(data, key) {
  return data.reduce((acc, item) => {
    const value = item[key];
    if (Array.isArray(value)) {
      value.forEach((v) => {
        acc[v] = (acc[v] || 0) + 1;
      });
    } else if (value !== undefined && value !== null && value !== "") {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});
}

function getIconForType(type) {
  const typeString = String(type).toLowerCase();
  const iconMap = {
    code: Code,
    coding: Code,
    programming: Code,
    cipher: KeySquare,
    crypto: KeySquare,
    encryption: KeySquare,
    sql: Database,
    database: Database,
    db: Database,
    mcq: CheckCircle,
    "multiple-choice": CheckCircle,
    "multiple choice": CheckCircle,
    quiz: CheckCircle,
    "output-predict": PenTool,
    "output prediction": PenTool,
    predict: PenTool,
    "drag-drop": MoveVertical,
    "drag and drop": MoveVertical,
    sorting: MoveVertical,
    logic: Puzzle,
    algorithm: Code,
    math: Award,
    web: Code,
    api: Database,
    frontend: Code,
    backend: Database,
  };

  return iconMap[typeString] || Puzzle;
}

function getLevelColor(level) {
  const levelString = String(level).toLowerCase();
  const colorMap = {
    novice: { color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
    beginner: { color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
    easy: { color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
    adept: { color: "text-blue-400", bgColor: "bg-blue-500/20" },
    intermediate: { color: "text-blue-400", bgColor: "bg-blue-500/20" },
    medium: { color: "text-blue-400", bgColor: "bg-blue-500/20" },
    master: { color: "text-purple-400", bgColor: "bg-purple-500/20" },
    expert: { color: "text-purple-400", bgColor: "bg-purple-500/20" },
    advanced: { color: "text-purple-400", bgColor: "bg-purple-500/20" },
    hard: { color: "text-red-400", bgColor: "bg-red-500/20" },
    extreme: { color: "text-red-400", bgColor: "bg-red-500/20" },
  };

  return (
    colorMap[levelString] || {
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
    }
  );
}

function getStatusColor(status) {
  const statusString = String(status).toLowerCase();
  const colorMap = {
    available: "text-emerald-400",
    open: "text-emerald-400",
    active: "text-emerald-400",
    completed: "text-blue-400",
    done: "text-blue-400",
    finished: "text-blue-400",
    "in-progress": "text-amber-400",
    "in progress": "text-amber-400",
    ongoing: "text-amber-400",
    started: "text-amber-400",
    failed: "text-rose-400",
    error: "text-rose-400",
    rejected: "text-rose-400",
    locked: "text-gray-400",
    disabled: "text-gray-400",
    pending: "text-orange-400",
    review: "text-yellow-400",
  };

  return colorMap[statusString] || "text-gray-400";
}

type Params = {
  filters: any;
  onFiltersChange: any;
  onClearFilters: any;
  searchQuery: string;
  handleSearchChange: any;
  challenges: ChallengeDomainIF[];
};

const AdvancedFilterSidebar = ({
  filters,
  onFiltersChange,
  onClearFilters,
  searchQuery,
  handleSearchChange,
  challenges,
}: Params) => {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    level: true,
    status: true,
    tags: false,
  });

  const filterConfig = useMemo(() => {
    const typeCounts = getCountByKey(challenges, "type");
    const levelCounts = getCountByKey(challenges, "level");
    const statusCounts = getCountByKey(challenges, "userStatus");
    const tagCounts = getCountByKey(challenges, "tags");

    const booleanFields = {};
    if (challenges.length > 0) {
      Object.keys(challenges[0]).forEach((key) => {
        const sampleValues = challenges.slice(0, 10).map((c) => c[key]);
        const allBoolean = sampleValues.every(
          (val) => typeof val === "boolean" || val === undefined
        );
        if (allBoolean && sampleValues.some((val) => val === true)) {
          booleanFields[key] = getCountByKey(
            challenges.filter((c) => c[key] === true),
            key
          );
        }
      });
    }

    return {
      type: Object.entries(typeCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([type, count]) => ({
          value: type,
          label:
            String(type).charAt(0).toUpperCase() +
            String(type).slice(1).replace(/[-_]/g, " "),
          icon: getIconForType(type),
          count,
        })),
      level: Object.entries(levelCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([level, count]) => {
          const colors = getLevelColor(level);
          return {
            value: level,
            label:
              String(level).charAt(0).toUpperCase() + String(level).slice(1),
            color: colors.color,
            bgColor: colors.bgColor,
            count,
          };
        }),
      status: Object.entries(statusCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([status, count]) => ({
          value: status,
          label:
            String(status).charAt(0).toUpperCase() +
            String(status).slice(1).replace(/[-_]/g, " "),
          color: getStatusColor(status),
          count,
        })),
      tags: Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20) // Show top 20 tags
        .map(([tag, count]) => ({
          value: tag,
          label: String(tag),
          count,
        })),
      booleanFields: Object.keys(booleanFields),
    };
  }, [challenges]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [filterType]: newValues,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    count += filters.type?.length || 0;
    count += filters.level?.length || 0;
    count += filters.status?.length || 0;
    count += filters.tags?.length || 0;

    filterConfig.booleanFields?.forEach((field) => {
      count += filters[field] ? 1 : 0;
    });

    count += filters.timeLimit?.min || filters.timeLimit?.max ? 1 : 0;
    count += filters.xpRewards?.min || filters.xpRewards?.max ? 1 : 0;
    count += filters.searchQuery?.trim() ? 1 : 0;
    return count;
  };

  const FilterSection = ({ title, sectionKey, children, icon: Icon }) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="border-b border-gray-800/50 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 px-1 text-left hover:bg-gray-800/20 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            <span className="text-sm font-medium text-gray-200">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {isExpanded && <div className="pb-4 px-1">{children}</div>}
      </div>
    );
  };

  if (!challenges || challenges.length === 0) {
    return (
      <div
        className={`bg-gray-950/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl `}
      >
        <div className="p-6 text-center">
          <Filter className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">
            No data available for filtering
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--logichub-secondary-bg)]/90 backdrop-blur-xl rounded-2xl border border-[var(--logichub-border)] shadow-2xl">
      <div className="p-6 border-b border-[var(--logichub-border)] flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg">
              <Filter className="w-5 h-5 text-[var(--logichub-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--logichub-primary-text)]">
              Filters
            </h3>
          </div>

          {getActiveFilterCount() > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-xs text-[var(--logichub-muted-text)] hover:text-red-400 transition-colors group"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
              <span>Clear ({getActiveFilterCount()})</span>
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--logichub-muted-text)]" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-[var(--logichub-card-bg)] border border-[var(--logichub-border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--logichub-primary-text)] placeholder-[var(--logichub-muted-text)] focus:outline-none focus:ring-2 focus:ring-[var(--logichub-accent)] focus:border-[var(--logichub-accent)] transition-all duration-200"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--logichub-muted-text)] hover:text-[var(--logichub-primary-text)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {filterConfig.type.length > 0 && (
          <FilterSection title="Challenge Type" sectionKey="type" icon={Puzzle}>
            <div className="space-y-2">
              {filterConfig.type.map(({ value, label, icon: Icon, count }) => (
                <label
                  key={value}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--logichub-secondary-bg)]/30 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters.type?.includes(value) || false}
                      onChange={() => handleFilterChange("type", value)}
                      className="w-4 h-4 text-[var(--logichub-accent)] bg-[var(--logichub-secondary-bg)] border-[var(--logichub-border)] rounded focus:ring-[var(--logichub-accent)] focus:ring-2 focus:ring-offset-0"
                    />
                    <Icon className="w-4 h-4 text-[var(--logichub-muted-text)] group-hover:text-[var(--logichub-accent)] transition-colors" />
                    <span className="text-sm text-[var(--logichub-secondary-text)] group-hover:text-[var(--logichub-primary-text)] transition-colors">
                      {label}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--logichub-muted-text)] bg-[var(--logichub-card-bg)] px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {filterConfig.level.length > 0 && (
          <FilterSection title="Difficulty" sectionKey="level" icon={Star}>
            <div className="space-y-2">
              {filterConfig.level.map(
                ({ value, label, color, bgColor, count }) => (
                  <label
                    key={value}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--logichub-secondary-bg)]/30 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={filters.level?.includes(value) || false}
                        onChange={() => handleFilterChange("level", value)}
                        className="w-4 h-4 text-[var(--logichub-accent)] bg-[var(--logichub-secondary-bg)] border-[var(--logichub-border)] rounded focus:ring-[var(--logichub-accent)] focus:ring-2 focus:ring-offset-0"
                      />
                      <div className={`w-3 h-3 rounded-full ${bgColor}`}></div>
                      <span className={`text-sm font-medium ${color}`}>
                        {label}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--logichub-muted-text)] bg-[var(--logichub-card-bg)] px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </label>
                )
              )}
            </div>
          </FilterSection>
        )}

        {filterConfig.status.length > 0 && (
          <FilterSection title="Status" sectionKey="status" icon={CheckCircle}>
            <div className="space-y-2">
              {filterConfig.status.map(({ value, label, color, count }) => (
                <label
                  key={value}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--logichub-secondary-bg)]/30 cursor-pointer group transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(value) || false}
                      onChange={() => handleFilterChange("status", value)}
                      className="w-4 h-4 text-[var(--logichub-accent)] bg-[var(--logichub-secondary-bg)] border-[var(--logichub-border)] rounded focus:ring-[var(--logichub-accent)] focus:ring-2 focus:ring-offset-0"
                    />
                    <div
                      className={`w-2 h-2 rounded-full bg-current ${color}`}
                    ></div>
                    <span className="text-sm text-[var(--logichub-secondary-text)] group-hover:text-[var(--logichub-primary-text)] transition-colors capitalize">
                      {label}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--logichub-muted-text)] bg-[var(--logichub-card-bg)] px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {filterConfig.tags.length > 0 && (
          <FilterSection title="Tags" sectionKey="tags" icon={Tag}>
            <div className="flex flex-wrap gap-2">
              {filterConfig.tags.map(({ value, label, count }) => (
                <button
                  key={value}
                  onClick={() => handleFilterChange("tags", value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                    filters.tags?.includes(value)
                      ? "bg-gradient-to-r from-purple-600/30 to-blue-600/30 text-[var(--logichub-accent)] border border-purple-500/50 shadow-lg"
                      : "bg-[var(--logichub-card-bg)] text-[var(--logichub-muted-text)] border border-[var(--logichub-border)] hover:bg-[var(--logichub-secondary-bg)]/50 hover:text-[var(--logichub-secondary-text)] hover:border-[var(--logichub-border)]"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-xs opacity-70">({count})</span>
                </button>
              ))}
            </div>
          </FilterSection>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 133, 229, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 133, 229, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AdvancedFilterSidebar;
