import React from 'react'
import { Users, TrendingUp, Calendar, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react'

type StatCardProps = {
  title: string
  value: string | number
  change?: number
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  trend?: 'up' | 'down'
  subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend, subtitle }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      {change !== undefined && trend && (
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-gray-400 text-sm">{title}</p>
    {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
  </div>
)

type UserData = {
  totalUsers: number
  activeUsersToday: number
  newUsersLast7Days: number
}

type DashboardData = {
  stats: {
    completionRate: number
    weeklyActivity: {
      growth: number
    }
  }
}

type Props = {
  userData: UserData
  dashboardData: DashboardData
}

const StatsGrid: React.FC<Props> = ({ userData, dashboardData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <StatCard
      title="Total Users"
      value={userData.totalUsers}
      icon={Users}
    />
    <StatCard
      title="Active Today"
      value={userData.activeUsersToday}
      icon={TrendingUp}
      subtitle={`${Math.round((userData.activeUsersToday / userData.totalUsers) * 100)}% of total users`}
    />
    <StatCard
      title="New Users (7 days)"
      value={userData.newUsersLast7Days}
      icon={Calendar}
    />
    <StatCard
      title="Completion Rate"
      value={`${dashboardData.stats.completionRate}%`}
      change={dashboardData.stats.weeklyActivity.growth}
      icon={Target}
      trend="up"
    />
  </div>
)

export default StatsGrid
