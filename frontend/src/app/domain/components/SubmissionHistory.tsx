import React, { useState } from "react";
import {
  HistoryIcon,
  CodeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarIcon,
  Star,
  RefreshCcwIcon,
  KeyIcon,
  TimerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChallengeDomainIF } from "@/types/domain.types";
import ExecutionOutput from "./ExecutionOutput";

interface Execution {
  resultOutput?: string | object;
  testCasesPassed?: number;
  totalTestCases?: number;
  language?: string;
  codeSubmitted?: string;
}

interface Submission {
  _id: string;
  status: 'completed' | 'failed-timeout' | 'failed';
  submittedAt: string;
  timeTaken?: number;
  level: string;
  xpGained: number;
  tags?: string[];
  execution?: Execution;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};



interface Props {
  challenge: ChallengeDomainIF;
  isLoading: boolean;
  handleReuseCode: (code: string) => void;
}

const SubmissionHistory: React.FC<Props> = ({
  challenge,
  isLoading,
  handleReuseCode,
}) => {
  const [expandedSubmissions, setExpandedSubmissions] = useState<Set<string>>(new Set());

  const toggleExpansion = (submissionId: string): void => {
    const newExpanded = new Set(expandedSubmissions);
    if (newExpanded.has(submissionId)) {
      newExpanded.delete(submissionId);
    } else {
      newExpanded.add(submissionId);
    }
    setExpandedSubmissions(newExpanded);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin absolute top-1 left-1 animate-reverse-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!challenge.submisionHistory || challenge.submisionHistory.length === 0) {
    return (
      <div className="max-w-md mx-auto">
        <div className="rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
            <HistoryIcon size={32} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Submissions Yet</h3>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Ready to tackle this {challenge.type === "cipher" ? "cipher" : "coding"} challenge?
            Your journey starts with your first submission.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center mx-auto">
            {challenge.type === "cipher" ? (
              <>
                <KeyIcon size={16} className="mr-2" />
                Start Decoding
              </>
            ) : (
              <>
                <CodeIcon size={16} className="mr-2" />
                Start Coding
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-4xl mx-auto space-y-3">
        {challenge.submisionHistory.map((submission: Submission, index: number) => {
          const statusConfig = {
            completed: {
              icon: <CheckCircleIcon size={16} className="text-emerald-400" />,
              label: "Solved",
              bgColor: "bg-emerald-500/10",
              borderColor: "border-emerald-500/30",
              textColor: "text-emerald-400",
            },
            "failed-timeout": {
              icon: <ClockIcon size={16} className="text-amber-400" />,
              label: "Timeout",
              bgColor: "bg-amber-500/10",
              borderColor: "border-amber-500/30",
              textColor: "text-amber-400",
            },
            failed: {
              icon: <XCircleIcon size={16} className="text-red-400" />,
              label: "Failed",
              bgColor: "bg-red-500/10",
              borderColor: "border-red-500/30",
              textColor: "text-red-400",
            },
          };

          const status = statusConfig[submission.status] || statusConfig.failed;
          const submissionDate = new Date(submission.submittedAt);
          const submissionNumber = challenge.submisionHistory && challenge.submisionHistory.length - index;
          const isExpanded = expandedSubmissions.has(submission._id);

          return (
            <div
              key={submission._id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg ${status.bgColor} border ${status.borderColor} flex items-center justify-center`}>
                      {status.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-semibold text-white">
                          Attempt #{submissionNumber}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bgColor} ${status.textColor} border ${status.borderColor}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center">
                          <CalendarIcon size={10} className="mr-1" />
                          {submissionDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="flex items-center">
                          <ClockIcon size={10} className="mr-1" />
                          {submissionDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {submission.timeTaken && (
                          <span className="flex items-center">
                            <TimerIcon size={10} className="mr-1" />
                            {formatTime(submission.timeTaken)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {challenge.type === "code" && submission.execution && (
                      <div className="text-xs text-gray-400">
                        {submission.execution.testCasesPassed || 0}/{submission.execution.totalTestCases || 0} tests
                      </div>
                    )}
                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-2 py-1 rounded text-xs border border-yellow-500/30">
                      <span className="text-yellow-300 font-medium flex items-center">
                        <Star size={10} className="mr-1" />
                        +{submission.xpGained}
                      </span>
                    </div>
                    <button
                      onClick={() => toggleExpansion(submission._id)}
                      className="bg-gray-700/60 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs transition-all duration-200 flex items-center"
                    >
                      <EyeIcon size={12} className="mr-1" />
                      {isExpanded ? "Hide" : "View"}
                      {isExpanded ? (
                        <ChevronUpIcon size={12} className="ml-1" />
                      ) : (
                        <ChevronDownIcon size={12} className="ml-1" />
                      )}
                    </button>
                  </div>
                </div>

                {challenge.type === "code" && submission.execution && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-300">
                        {Math.round(
                          ((submission.execution.testCasesPassed || 0) /
                            (submission.execution.totalTestCases || 1)) * 100
                        )}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((submission.execution.testCasesPassed || 0) /
                              (submission.execution.totalTestCases || 1)) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-700/30">
                  <div className="space-y-4 mt-4">
                    {submission.tags && submission.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {submission.tags.map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {challenge.type === "code" && submission.execution && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-emerald-400">
                              {submission.execution.testCasesPassed || 0}
                              <span className="text-gray-500 text-sm">
                                /{submission.execution.totalTestCases || 0}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">Tests Passed</div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-blue-400 flex items-center justify-center">
                              <CodeIcon size={14} className="mr-1" />
                              {submission.execution.language || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-400">Language</div>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-purple-400">
                              {Math.round(
                                ((submission.execution.testCasesPassed || 0) /
                                  (submission.execution.totalTestCases || 1)) * 100
                              )}%
                            </div>
                            <div className="text-xs text-gray-400">Success Rate</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {challenge.type === "code" && submission.execution?.codeSubmitted && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-medium text-gray-300 flex items-center">
                            <CodeIcon size={14} className="mr-1 text-blue-400" />
                            Solution Code
                          </h5>
                          <button
                            className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs transition-all duration-200 flex items-center"
                            onClick={() => handleReuseCode(submission.execution!.codeSubmitted!)}
                          >
                            <RefreshCcwIcon size={12} className="mr-1" />
                            Reuse
                          </button>
                        </div>
                        <div className="rounded-lg overflow-hidden border border-gray-700/30">
                          <SyntaxHighlighter
                            language={submission.execution.language || "javascript"}
                            style={atomDark}
                            customStyle={{
                              margin: 0,
                              borderRadius: "0.5rem",
                              padding: "1rem",
                              maxHeight: "300px",
                              fontSize: "12px",
                            }}
                          >
                            {submission.execution.codeSubmitted}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}

                    {submission.execution && (
                      <ExecutionOutput 
                        execution={submission.execution} 
                        challengeType={challenge.type}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionHistory;