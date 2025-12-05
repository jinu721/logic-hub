import React from 'react'
import { MoreVertical } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

type XPDistributionData = {
  name: string
  currentXP: number
  totalXP: number
}[]

type TypeDistributionItem = {
  name: string
  count: number
  percentage: number
}

type DashboardStats = {
  typeDistribution: TypeDistributionItem[]
}

type DashboardData = {
  stats: DashboardStats
}

type Props = {
  xpDistributionData: XPDistributionData
  dashboardData: DashboardData
  typeDistributionColors: string[]
}

const ChartsGrid: React.FC<Props> = ({ xpDistributionData, dashboardData, typeDistributionColors }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">XP Distribution</h3>
        <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={xpDistributionData}>
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
          <Bar dataKey="currentXP" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Current XP" />
          <Bar dataKey="totalXP" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Total XP" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Challenge Types</h3>
        <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={dashboardData.stats.typeDistribution}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
          >
            {dashboardData.stats.typeDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={typeDistributionColors[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '12px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {dashboardData.stats.typeDistribution.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: typeDistributionColors[index] }}></div>
              <span className="text-gray-300 text-sm">{item.name}</span>
            </div>
            <span className="text-white font-medium">
              {item.count} ({item.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default ChartsGrid
