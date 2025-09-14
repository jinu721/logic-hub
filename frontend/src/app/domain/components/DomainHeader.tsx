import { ChallengeDomainIF } from "@/types/domain.types";
import { ChevronLeft, Clock, ThumbsUp, Users } from "lucide-react";
import React from "react";


interface DomainHeaderProps {
  challenge?: ChallengeDomainIF;
  challengeStarted: boolean;
  timeLeft: number;
  onlineUsers: number;
  handleBack: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const DomainHeader: React.FC<DomainHeaderProps> = ({
  challenge,
  challengeStarted,
  timeLeft,
  onlineUsers,
  handleBack,
}) => {
  const title = challenge?.title || "Challenge Title";
  const level = challenge?.level || "Novice";
  const type = challenge?.type;
  const submission = challenge?.recentSubmission;
  const completedUsers = challenge?.completedUsers ?? 0;
  const successRate = challenge?.successRate ?? 0;

  return (
    <header className="bg-[#0e1117] border-b border-[#1c1f26] backdrop-blur-xl shadow-lg flex-shrink-0 relative">
      <div className="absolute inset-0" />
      <div className="relative px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <button
              onClick={handleBack}
              className="group p-2 cursor-pointer rounded-md bg-slate-800/50 hover:bg-slate-700/50 transition-all border border-slate-700/30 flex-shrink-0"
              aria-label="Go Back"
            >
              <ChevronLeft
                size={16}
                className="group-hover:text-blue-400 transition-colors"
              />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent truncate">
                {title}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 backdrop-blur-sm">
                  {level}
                </span>
                {type && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-slate-600/30 bg-slate-700/40 text-slate-300 backdrop-blur-sm">
                    {type}
                  </span>
                )}
                {submission && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      submission.passed
                        ? "border-green-500/30 bg-green-500/10 text-green-300"
                        : "border-red-500/30 bg-red-500/10 text-red-300"
                    } backdrop-blur-sm`}
                  >
                    {submission.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {challengeStarted && (
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-md border text-xs font-mono font-semibold backdrop-blur-sm ${
                  timeLeft < 300
                    ? "bg-red-500/10 border-red-500/30 text-red-300"
                    : "bg-slate-700/30 border-slate-600/30 text-slate-300"
                }`}
              >
                <Clock size={12} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <div className="hidden lg:flex items-center space-x-2">
              <div className="flex items-center text-slate-400 bg-slate-800/30 px-2 py-1 rounded-md border border-slate-700/30 backdrop-blur-sm text-xs">
                <Users size={14} className="mr-1 text-red-400" />
                {onlineUsers}
              </div>
              <div className="flex items-center text-slate-400 bg-slate-800/30 px-2 py-1 rounded-md border border-slate-700/30 backdrop-blur-sm text-xs">
                <Users size={14} className="mr-1 text-green-400" />
                {completedUsers}
              </div>
              <div className="flex items-center text-slate-400 bg-slate-800/30 px-2 py-1 rounded-md border border-slate-700/30 backdrop-blur-sm text-xs">
                <ThumbsUp size={14} className="mr-1 text-blue-400" />
                {successRate}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DomainHeader;
