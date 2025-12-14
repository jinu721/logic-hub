import { ChallengeDomainIF } from "@/types/domain.types";
import { ChevronLeft, Clock, ThumbsUp, Users } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface DomainHeaderProps {
  challenge: ChallengeDomainIF;
  elapsedTime: number;
  timerRunning: boolean;
  timerMode: "stopwatch" | "timer";
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSwitchMode: (mode: "stopwatch" | "timer") => void;
  onSetDuration: (minutes: number) => void;
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
  elapsedTime,
  timerRunning,
  timerMode,
  onlineUsers,
  onPause,
  onResume,
  onReset,
  onSwitchMode,
  onSetDuration,
  handleBack,
}) => {
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const title = challenge?.title || "Challenge Title";
  const level = challenge?.level || "Novice";
  const type = challenge?.type;
  const submission = challenge?.recentSubmission;
  const completedUsers = challenge?.completedUsers ?? 0;
  const successRate = challenge?.successRate ?? 0;

  const timerPresets = [5, 10, 15, 20, 30, 45, 60];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowTimerMenu(false);
      }
    };

    if (showTimerMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimerMenu]);

  const handleModeSwitch = (mode: "stopwatch" | "timer") => {
    onSwitchMode(mode);
    setShowTimerMenu(false);
  };

  const handleSetDuration = (minutes: number) => {
    onSetDuration(minutes);
    setShowTimerMenu(false);
  };

  return (
    <header className="bg-[#0e1117] border-b border-[#1c1f26] backdrop-blur-xl shadow-lg flex-shrink-0 relative z-50">
      <div className="absolute inset-0" />
      <div className="relative px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={handleBack}
              className="group p-2 rounded-md bg-slate-800/50 hover:bg-slate-700/50 transition-all border border-slate-700/30 flex-shrink-0"
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
            <div className="relative" ref={menuRef}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/30 backdrop-blur-sm">
                <Clock size={14} className="text-slate-400" />
                <span className={`text-sm font-mono tabular-nums min-w-[45px] ${
                  timerMode === "timer" && elapsedTime <= 60 && elapsedTime > 0
                    ? "text-red-400 font-semibold"
                    : "text-slate-200"
                }`}>
                  {formatTime(elapsedTime)}
                </span>

                <div className="flex items-center gap-1 ml-1 border-l border-slate-700/50 pl-2">
                  {timerMode === "timer" && (
                    <button
                      onClick={timerRunning ? onPause : onResume}
                      className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                    >
                      {timerRunning ? (
                        <svg
                          className="w-3 h-3 text-slate-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-3 h-3 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 4l10 6-10 6V4z" />
                        </svg>
                      )}
                    </button>
                  )}

                  <button
                    onClick={onReset}
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                  >
                    <svg
                      className="w-3 h-3 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setShowTimerMenu(!showTimerMenu)}
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                  >
                    <svg
                      className="w-3 h-3 text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {showTimerMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-[999]">
                  <div className="p-2">
                    <div className="text-xs font-semibold text-slate-400 px-2 py-1 mb-1">
                      Timer Mode
                    </div>
                    <button
                      onClick={() => handleModeSwitch("stopwatch")}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        timerMode === "stopwatch"
                          ? "bg-blue-500/20 text-blue-300"
                          : "text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Stopwatch</span>
                        {timerMode === "stopwatch" && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Counts up automatically
                      </div>
                    </button>
                    <button
                      onClick={() => handleModeSwitch("timer")}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                        timerMode === "timer"
                          ? "bg-blue-500/20 text-blue-300"
                          : "text-slate-300 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Timer</span>
                        {timerMode === "timer" && (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Counts down from set time
                      </div>
                    </button>
                  </div>

                  {timerMode === "timer" && (
                    <>
                      <div className="border-t border-slate-700 my-1"></div>
                      <div className="p-2">
                        <div className="text-xs font-semibold text-slate-400 px-2 py-1 mb-1">
                          Set Duration
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {timerPresets.map((minutes) => (
                            <button
                              key={minutes}
                              onClick={() => handleSetDuration(minutes)}
                              className="px-2 py-1.5 text-xs rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition-colors"
                            >
                              {minutes}m
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

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