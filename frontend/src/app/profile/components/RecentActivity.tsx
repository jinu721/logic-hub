"use client";

import React from "react";
import { Activity, ArrowRight, Bug, Clock, Code, Database, Layout, Terminal, TrendingUp} from "lucide-react";

interface ExecutionDetails {
  language: string;
  testCasesPassed?: number;
  totalTestCases?: number;
}

type ActivityType = 'algorithm' | 'database' | 'frontend' | 'debug' | 'system';
type ActivityLevel = 'novice' | 'adept' | 'expert';
type ActivityStatus = 'completed' | 'failed' | string;

interface ActivityItem {
  type: ActivityType;
  level: ActivityLevel;
  status: ActivityStatus;
  tags: string[];
  xpGained: number;
  timeTaken: number;
  execution?: ExecutionDetails;
}

interface Props {
  progressData: ActivityItem[];
}

export default function RecentActivity({ progressData}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute top-10 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-blue-400" size={20} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Recent Activities
            </span>
          </h2>
          <button className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 group transition-all duration-300">
            <span>View History</span>
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="space-y-4">
          {progressData.slice(0, 5).map((activity, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-r from-gray-800/70 to-gray-700/40 backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="p-4 flex gap-4 items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/20 group-hover:scale-110 transition-transform
                ${
                  activity.status === "completed"
                    ? "bg-gradient-to-br from-green-600/30 to-emerald-600/30"
                    : activity.status.includes("failed")
                    ? "bg-gradient-to-br from-red-600/30 to-orange-600/30"
                    : "bg-gradient-to-br from-blue-600/30 to-cyan-600/30"
                }`}
                >
                  {activity.type === "algorithm" && (
                    <Code className="text-blue-300" size={20} />
                  )}
                  {activity.type === "database" && (
                    <Database className="text-blue-300" size={20} />
                  )}
                  {activity.type === "frontend" && (
                    <Layout className="text-blue-300" size={20} />
                  )}
                  {activity.type === "debug" && (
                    <Bug className="text-blue-300" size={20} />
                  )}
                  {activity.type === "system" && (
                    <Terminal className="text-blue-300" size={20} />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-200 flex items-center gap-2">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}{" "}
                        Challenge
                        {activity.status === "completed" && (
                          <span className="text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full">
                            Completed
                          </span>
                        )}
                        {activity.status.includes("failed") && (
                          <span className="text-xs px-2 py-0.5 bg-red-900/30 text-red-400 rounded-full">
                            Failed
                          </span>
                        )}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full
                        ${
                          activity.level === "novice"
                            ? "bg-blue-900/30 text-blue-400"
                            : activity.level === "adept"
                            ? "bg-purple-900/30 text-purple-400"
                            : "bg-amber-900/30 text-amber-400"
                        }`}
                        >
                          {activity.level.charAt(0).toUpperCase() +
                            activity.level.slice(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {activity.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="mr-1">
                              #{tag}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs px-2 py-0.5 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center gap-1">
                        <TrendingUp size={10} />+{activity.xpGained} XP
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Clock size={10} />
                        {Math.floor(activity.timeTaken / 60)}m{" "}
                        {activity.timeTaken % 60}s
                      </span>
                    </div>
                  </div>

                  {activity.execution && activity.execution.language && (
                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Code size={10} />
                          {activity.execution.language}
                        </span>
                        {activity.execution.testCasesPassed !== undefined && (
                          <span className="text-xs text-gray-400">
                            Tests:{" "}
                            <span
                              className={
                                activity.execution.testCasesPassed ===
                                activity.execution.totalTestCases
                                  ? "text-green-400"
                                  : "text-amber-400"
                              }
                            >
                              {activity.execution.testCasesPassed}/
                              {activity.execution.totalTestCases}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {progressData.length === 0 && (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-900/20 flex items-center justify-center">
              <Activity className="text-blue-400/50" size={24} />
            </div>
            <p className="text-gray-400">No recent activities yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Complete challenges to see your progress here
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
              Explore Challenges
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
