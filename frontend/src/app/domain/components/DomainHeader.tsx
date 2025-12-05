import { ChevronLeft, Clock, ThumbsUp, Users } from "lucide-react";
import React from "react";

interface ChallengeDomainIF {
  title: string;
  level: string;
  type?: string;
  recentSubmission?: {
    passed: boolean;
    status: string;
  };
  completedUsers?: number;
  successRate?: number;
}

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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
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

            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <h1 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-white to-[#f3f3f3] bg-clip-text text-transparent whitespace-nowrap">
                {title}
              </h1>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-300 backdrop-blur-sm whitespace-nowrap">
                  {level}
                </span>
                {type && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-slate-600/30 bg-slate-700/40 text-slate-300 backdrop-blur-sm whitespace-nowrap">
                    {type}
                  </span>
                )}
                {submission && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${
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

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {challengeStarted && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-mono font-semibold backdrop-blur-sm whitespace-nowrap ${
                  timeLeft < 300
                    ? "bg-red-500/10 border-red-500/30 text-red-300"
                    : "bg-slate-700/30 border-slate-600/30 text-slate-300"
                }`}
              >
                <Clock size={12} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center text-slate-400 bg-slate-800/30 px-2 py-1 rounded-md border border-slate-700/30 backdrop-blur-sm text-xs whitespace-nowrap">
                <Users size={14} className="mr-1 text-red-400" />
                {onlineUsers}
              </div>
              <div className="flex items-center text-slate-400 bg-slate-800/30 px-2 py-1 rounded-md border border-slate-700/30 backdrop-blur-sm text-xs whitespace-nowrap">
                <Users size={14} className="mr-1 text-green-400" />
                {completedUsers}
              </div>
              <div className="flex items-center text-slate-400 bg-slate-800/30 px-2 py-1 rounded-md border border-slate-700/30 backdrop-blur-sm text-xs whitespace-nowrap">
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