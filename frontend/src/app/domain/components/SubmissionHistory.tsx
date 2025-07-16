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
  TerminalIcon,
  CopyIcon,
  KeyIcon,
  TimerIcon,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChallengeDomainIF } from "@/types/domain.types";
import { useToast } from "@/context/Toast";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

type Props = {
  challenge: ChallengeDomainIF;
  isLoading: boolean;
  handleReuseCode: (code: string) => void;
};

const SubmissionHistory: React.FC<Props> = ({
  challenge,
  isLoading,
  handleReuseCode,
}) => {
  const [copied, setCopied] = useState(false);

  const { showToast } = useToast() as any;

  const handleCopy = async (copyData: any) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(copyData));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
      showToast({ type: "error", message: "Failed to copy!" });
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin absolute top-2 left-2 animate-reverse-spin"></div>
            </div>
            <p className="text-gray-400 font-medium">
              Loading submission history...
            </p>
          </div>
        </div>
      ) : challenge.submisionHistory?.length === 0 ? (
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl p-8 h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
              <HistoryIcon size={40} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Submissions Yet
            </h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Ready to tackle this{" "}
              {challenge.type === "cipher" ? "cipher" : "coding"} challenge?
              Your journey starts with your first submission.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto">
              {challenge.type === "cipher" ? (
                <>
                  <KeyIcon size={18} className="mr-2" />
                  Start Decoding
                </>
              ) : (
                <>
                  <CodeIcon size={18} className="mr-2" />
                  Start Coding
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="grid gap-6">
            {challenge.submisionHistory?.map(
              (submission: any, index: number) => {
                const statusConfig = {
                  completed: {
                    icon: (
                      <CheckCircleIcon size={20} className="text-emerald-400" />
                    ),
                    label: "Solved",
                    gradient: "from-emerald-500/20 to-green-500/20",
                    border: "border-emerald-500/40",
                    badge:
                      "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                  },
                  "failed-timeout": {
                    icon: <ClockIcon size={20} className="text-amber-400" />,
                    label: "Timeout",
                    gradient: "from-amber-500/20 to-yellow-500/20",
                    border: "border-amber-500/40",
                    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  },
                  failed: {
                    icon: <XCircleIcon size={20} className="text-red-400" />,
                    label: "Failed",
                    gradient: "from-red-500/20 to-rose-500/20",
                    border: "border-red-500/40",
                    badge: "bg-red-500/20 text-red-300 border-red-500/30",
                  },
                };

                const status =
                  statusConfig[
                    submission.status as keyof typeof statusConfig
                  ] || statusConfig.failed;

                const submissionDate = new Date(submission.submittedAt);
                const submissionNumber =
                  challenge && challenge.submisionHistory
                    ? challenge?.submisionHistory?.length - index
                    : 0;

                return (
                  <div
                    key={submission._id}
                    className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${status.gradient} border ${status.border} flex items-center justify-center`}
                          >
                            {status.icon}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <h3 className="text-xl font-bold text-white">
                                Attempt #{submissionNumber}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${status.badge}`}
                              >
                                {status.label}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                              <span className="flex items-center">
                                <CalendarIcon size={14} className="mr-1" />
                                {submissionDate.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center">
                                <ClockIcon size={14} className="mr-1" />
                                {submissionDate.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {submission.timeTaken && (
                                <span className="flex items-center">
                                  <TimerIcon size={14} className="mr-1" />
                                  {formatTime(submission.timeTaken)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600/50">
                            <span className="text-gray-300 text-sm font-medium capitalize">
                              {submission.level}
                            </span>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-3 py-2 rounded-lg border border-yellow-500/30">
                            <span className="text-yellow-300 font-semibold text-sm flex items-center">
                              <Star size={14} className="mr-1" />+
                              {submission.xpGained} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {challenge.type === "code" && submission.execution && (
                        <>
                          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400">
                                  {submission.execution.testCasesPassed}
                                  <span className="text-gray-500 text-lg">
                                    /{submission.execution.totalTestCases}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  Test Cases Passed
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-blue-400 flex items-center justify-center">
                                  <CodeIcon size={18} className="mr-2" />
                                  {submission.execution.language}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  Language
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-purple-400">
                                  {Math.round(
                                    (submission.execution.testCasesPassed /
                                      submission.execution.totalTestCases) *
                                      100
                                  )}
                                  %
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                  Success Rate
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-400">
                                Test Progress
                              </span>
                              <span className="text-gray-300 font-medium">
                                {submission.execution.testCasesPassed}/
                                {submission.execution.totalTestCases}
                              </span>
                            </div>
                            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
                                style={{
                                  width: `${
                                    (submission.execution.testCasesPassed /
                                      submission.execution.totalTestCases) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {submission.tags && submission.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {submission.tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-gray-700/60 text-gray-300 px-3 py-1 rounded-lg text-sm border border-gray-600/50"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {challenge.type === "code" &&
                        submission.execution?.codeSubmitted && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold text-gray-200 flex items-center">
                                <CodeIcon
                                  size={18}
                                  className="mr-2 text-blue-400"
                                />
                                Solution Code
                              </h4>
                              <button
                                className="bg-blue-600/80 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                                onClick={() =>
                                  handleReuseCode(
                                    submission.execution.codeSubmitted
                                  )
                                }
                              >
                                <RefreshCcwIcon size={14} className="mr-2" />
                                Reuse Code
                              </button>
                            </div>
                            <div className="rounded-xl overflow-hidden border border-gray-700/50">
                              <SyntaxHighlighter
                                language={submission.execution.language}
                                style={atomDark}
                                customStyle={{
                                  margin: 0,
                                  borderRadius: "0.75rem",
                                  padding: "1.5rem",
                                  maxHeight: "400px",
                                  fontSize: "14px",
                                }}
                              >
                                {submission.execution.codeSubmitted}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        )}

                      {submission.execution?.resultOutput && (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                            <TerminalIcon
                              size={18}
                              className="mr-2 text-green-400"
                            />
                            {challenge.type === "cipher"
                              ? "Decoded Output"
                              : "Execution Output"}
                          </h4>
                          <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-700/50 overflow-auto max-h-48">
                            <pre className="text-gray-300 text-sm leading-relaxed">
                              {typeof submission.execution.resultOutput ===
                              "string"
                                ? submission.execution.resultOutput
                                : JSON.stringify(
                                    submission.execution.resultOutput,
                                    null,
                                    2
                                  )}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-800/60 px-6 py-4 border-t border-gray-700/50">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() =>
                            handleCopy(submission.execution?.resultOutput)
                          }
                          className="bg-gray-700/80 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
                        >
                          <CopyIcon size={14} className="mr-2" />
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
