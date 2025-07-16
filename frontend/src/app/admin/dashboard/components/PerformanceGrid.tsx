import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
} from 'recharts'
import { MoreVertical, Trophy, Star, Award, Target, Users } from 'lucide-react'

type SubmissionData = {
  name: string
  solved: number
  total: number
}[]

type UserStats = {
  xpPoints: number
  level: number
  currentStreak: number
  longestStreak?: number
}

type LeaderboardUser = {
  id: string | number
  rank: number
  username: string
  solvedCount: number
  stats: UserStats
}

type TopPerformers = {
  topEarner: {
    username: string
    totalXP: number
  }
  longestStreakAgg: {
    username: string
    stats: {
      longestStreak: number
    }
  }
}

type DashboardStats = {
  totalSubmissions: number
}

type DashboardData = {
  leaderboardData: LeaderboardUser[]
  topPerformers: TopPerformers
  stats: DashboardStats
}

type Props = {
  submissionData: SubmissionData
  dashboardData: DashboardData
}

const PerformanceGrid: React.FC<Props> = ({ submissionData, dashboardData }) => (
  <>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">User Performance</h3>
          <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={submissionData}>
            <defs>
              <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                color: '#fff',
              }}
            />
            <Area
              type="monotone"
              dataKey="solved"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorSolved)"
              strokeWidth={3}
              name="Solved"
            />
            <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} name="Total Submissions" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Top Performers</h3>
          <Trophy className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="space-y-4">
          {dashboardData.leaderboardData.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 hover:bg-gray-700/30 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    user.rank === 1
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                      : user.rank === 2
                      ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black'
                      : user.rank === 3
                      ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-black'
                      : 'bg-gray-600 text-white'
                  }`}
                >
                  {user.rank}
                </div>
                <div>
                  <p className="text-white font-medium">{user.username}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{user.stats.xpPoints} XP</span>
                    <span>Level {user.stats.level}</span>
                    <span>{user.solvedCount} solved</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-semibold">{user.stats.currentStreak}</span>
                </div>
                <p className="text-xs text-gray-400">streak</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Performance Highlights</h3>
        <Award className="w-5 h-5 text-purple-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-gradient-to-r from-yellow-500/10 to-yellow-400/10 rounded-xl border border-yellow-500/20">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <h4 className="text-white font-semibold">Top XP Earner</h4>
          <p className="text-yellow-400 text-lg font-bold">
            {dashboardData.topPerformers.topEarner.username}
          </p>
          <p className="text-gray-400 text-sm">
            {dashboardData.topPerformers.topEarner.totalXP} Total XP
          </p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-purple-400/10 rounded-xl border border-purple-500/20">
          <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h4 className="text-white font-semibold">Longest Streak</h4>
          <p className="text-purple-400 text-lg font-bold">
            {dashboardData.topPerformers.longestStreakAgg.username}
          </p>
          <p className="text-gray-400 text-sm">
            {dashboardData.topPerformers.longestStreakAgg.stats.longestStreak} days
          </p>
        </div>
        <div className="text-center p-4 bg-gradient-to-r from-blue-500/10 to-blue-400/10 rounded-xl border border-blue-500/20">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <h4 className="text-white font-semibold">Total Submissions</h4>
          <p className="text-blue-400 text-lg font-bold">
            {dashboardData.stats.totalSubmissions}
          </p>
          <p className="text-gray-400 text-sm">Across all users</p>
        </div>
      </div>
    </div>
  </>
)

export default PerformanceGrid
