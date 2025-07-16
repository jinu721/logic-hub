import { Stats } from "@/types/leaderboard.types";
import { motion } from "framer-motion";
import {
  BarChart3,
  Code,
  Award,
  Check,
  Target,
  Puzzle,
  Briefcase,
  Tag,
} from "lucide-react";


interface ChallengeStatsProps {
  stats: Stats;
}

const ChallengeStats: React.FC<ChallengeStatsProps> = ({ stats }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg p-6"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <BarChart3 className="mr-2 text-blue-500" />
        Challenge Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-750 rounded-xl p-5 border border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">
                Total Submissions
              </div>
              <div className="text-white text-2xl font-bold">
                {stats.totalSubmissions ?? 0}
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Code size={20} className="text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-750 rounded-xl p-5 border border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">
                Total Users
              </div>
              <div className="text-white text-2xl font-bold">
                {stats.totalUsers?.toLocaleString() ?? 0}
              </div>
            </div>
            <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-yellow-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-750 rounded-xl p-5 border border-gray-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-gray-400 text-sm font-medium mb-1">
                Completion Rate
              </div>
              <div className="text-white text-2xl font-bold">
                {stats.completionRate ?? 0}%
              </div>
            </div>
            <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <Check size={20} className="text-green-400" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-750 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="mr-2 text-blue-400" size={18} />
            Challenge Level Distribution
          </h3>

          <div className="space-y-4">
            {stats.levelDistribution?.map((level, index) => (
              <div key={level.name} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="capitalize font-medium">{level.name}</span>
                  <span className="text-gray-400">
                    {level.count} ({level.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      index === 0
                        ? "bg-red-500"
                        : index === 1
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${level.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-750 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Puzzle className="mr-2 text-purple-400" size={18} />
            Challenge Type Distribution
          </h3>

          <div className="space-y-4">
            {stats.typeDistribution?.map((type, index) => (
              <div key={type.name} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="capitalize font-medium">{type.name}</span>
                  <span className="text-gray-400">
                    {type.count} ({type.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      index === 0
                        ? "bg-blue-500"
                        : index === 1
                        ? "bg-purple-500"
                        : "bg-pink-500"
                    }`}
                    style={{ width: `${type.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-750 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Briefcase className="mr-2 text-yellow-400" size={18} />
            Domain Completion Statistics
          </h3>

          <div className="space-y-4">
            {stats.domainStats?.map((domain) => (
              <div key={domain.name} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="capitalize font-medium">{domain.name}</span>
                  <span className="text-gray-400">
                    {domain.completions} completions
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-yellow-500"
                    style={{ width: `${domain.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-750 rounded-xl p-5 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Tag className="mr-2 text-indigo-400" size={18} />
            Weekly Activity Analysis
          </h3>

          <div className="mt-4">
            {stats.weeklyActivity ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Busiest Day</span>
                  <span className="text-sm text-gray-400">
                    {stats.weeklyActivity.busiestDay}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Avg. Daily Submissions
                  </span>
                  <span className="text-sm text-gray-400">
                    {stats.weeklyActivity.avgSubmissions}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Growth</span>
                  <span className="text-sm text-green-400">
                    +{stats.weeklyActivity.growth}%
                  </span>
                </div>

                <div className="mt-4 flex justify-between items-end h-24">
                  {stats.weeklyActivity.days?.map((day) => (
                    <div
                      key={day.name}
                      className="flex flex-col items-center"
                    >
                      <div
                        className="w-6 bg-blue-500 rounded-t"
                        style={{ height: `${day.value}%` }}
                      />
                      <span className="text-xs text-gray-400 mt-1">
                        {day.name.charAt(0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6">
                No activity data available
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChallengeStats;
