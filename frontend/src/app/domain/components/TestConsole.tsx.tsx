import React from "react";
import { Terminal, TerminalIcon, RefreshCw, FileOutput } from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";

interface ConsoleOutput {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface TestCase {
  input: string;
  output?: string;
  expectedOutput?: string;
  actualOutput?: string | null;
  passed?: boolean;
}



interface Props {
  bottomPanelHeight: number;
  handleMouseDown: (direction: "vertical") => (e: React.MouseEvent) => void;
  activeRightTab: "console" | "testcases";
  setActiveRightTab: (tab: "console" | "testcases") => void;
  setConsoleOutput?: (output: string) => void;
  consoleOutput: ConsoleOutput[];
  previewResults: TestCase[];
  challenge: ChallengeDomainIF;
}

const TestConsole: React.FC<Props> = ({
  bottomPanelHeight,
  handleMouseDown,
  activeRightTab,
  setActiveRightTab,
  setConsoleOutput,
  consoleOutput,
  previewResults,
  challenge,
}) => {
  return (
    <>
      <div
        className="h-1 bg-slate-700/50 hover:bg-blue-500/50 cursor-row-resize transition-colors duration-200 relative group flex-shrink-0"
        onMouseDown={handleMouseDown("vertical")}
      >
        <div className="absolute inset-x-0 -inset-y-2 flex items-center justify-center">
          <div className="h-1 w-16 bg-slate-600 rounded-full group-hover:bg-blue-400 transition-colors shadow-lg"></div>
        </div>
      </div>

      <div
        className="bg-slate-950/80 backdrop-blur-sm border-t border-slate-700/50 flex-shrink-0"
        style={{ height: `${bottomPanelHeight}%`, minHeight: "150px" }}
      >
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 bg-slate-800/50 border-b border-slate-700/30 backdrop-blur-sm">
            <div className="flex items-center justify-between px-4 sm:px-5 lg:px-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveRightTab("console")}
                  className={`px-3 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                    activeRightTab === "console"
                      ? " text-slate-200 border-b-2 border-green-400"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <TerminalIcon size={16} className="inline mr-2" />
                  Console
                </button>
                <button
                  onClick={() => setActiveRightTab("testcases")}
                  className={`px-3 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 relative ${
                    activeRightTab === "testcases"
                      ? "text-slate-200 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/30"
                  }`}
                >
                  <FileOutput size={16} className="inline mr-2" />
                  Test Cases
                  {previewResults.length > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        previewResults
                          ?.map((result) => result.passed)
                          .every((passed) => passed === true)
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {previewResults.length}/
                      {previewResults?.map((result) => result.passed).length}
                    </span>
                  )}
                </button>
              </div>

              {activeRightTab === "console" && (
                <button
                  className="group text-slate-400 hover:text-slate-300 text-xs sm:text-sm flex items-center px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-slate-700/30 transition-all duration-200"
                  onClick={() => setConsoleOutput?.("")}
                >
                  <RefreshCw
                    size={14}
                    className="sm:w-4 sm:h-4 mr-1 sm:mr-2 group-hover:rotate-180 transition-transform duration-300"
                  />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            {activeRightTab === "console" ? (
              <div className="p-4 sm:p-5 lg:p-6 h-full">
                <div className="bg-slate-800/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-slate-700/30 backdrop-blur-sm h-full min-h-24">
                  {consoleOutput.length > 0 ? (
                    consoleOutput.map((output, index) => (
                      <div
                        key={index}
                        className="mb-1.5 flex items-start animate-fadeIn"
                      >
                        <span
                          className={`mr-2 inline-block ${
                            output.type === "error"
                              ? "text-red-500"
                              : output.type === "success"
                              ? "text-green-500"
                              : output.type === "warning"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        ></span>
                        <p
                          className={`${
                            output.type === "error"
                              ? "text-red-400"
                              : output.type === "success"
                              ? "text-green-400"
                              : output.type === "warning"
                              ? "text-yellow-400"
                              : "text-blue-400"
                          }`}
                        >
                          {output.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Terminal size={24} className="mb-2 opacity-50" />
                      <p>Run your code to see output here</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 lg:p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-slate-300 font-medium mb-3 flex items-center">
                      Sample Test Cases
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                        {challenge.testCases?.length}
                      </span>
                    </h4>

                    <div className="space-y-2">
                      {(() => {
                        const testData =
                          previewResults.length > 0
                            ? previewResults
                            : challenge.testCases;
                        const isPreviewMode = previewResults.length > 0;

                        return testData?.map((test, index) => {
                          const normalizedTest = {
                            input: test.input,
                            expectedOutput: isPreviewMode
                              ? test.expectedOutput
                              : test.output,
                            actualOutput: test.actualOutput || null,
                            passed:
                              test.passed !== undefined ? test.passed : null,
                          };

                          const getStatus = () => {
                            if (normalizedTest.passed === true) return "passed";
                            if (normalizedTest.passed === false)
                              return "failed";
                            return "sample";
                          };

                          const status = getStatus();

                          const statusConfig = {
                            passed: {
                              containerClasses:
                                "from-emerald-800/20 to-emerald-900/30 border-emerald-600/30 hover:border-emerald-500/50 hover:shadow-emerald-900/20",
                              dotClasses:
                                "bg-gradient-to-r from-emerald-400 to-green-500",
                              badgeClasses:
                                "bg-gradient-to-r from-emerald-700/60 to-emerald-600/60",
                              badgeTextClasses: "text-emerald-200",
                              outputLabelClasses: "text-emerald-400",
                              outputCodeClasses:
                                "bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-300 border-emerald-500/30",
                              icon: (
                                <svg
                                  className="w-3 h-3 text-emerald-300"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ),
                              badgeText: "Passed",
                            },
                            failed: {
                              containerClasses:
                                "from-red-800/20 to-red-900/30 border-red-600/30 hover:border-red-500/50 hover:shadow-red-900/20",
                              dotClasses:
                                "bg-gradient-to-r from-red-400 to-red-500",
                              badgeClasses:
                                "bg-gradient-to-r from-red-700/60 to-red-600/60",
                              badgeTextClasses: "text-red-200",
                              outputLabelClasses: "text-red-400",
                              outputCodeClasses:
                                "bg-gradient-to-r from-red-500/10 to-red-500/10 text-red-300 border-red-500/30",
                              icon: (
                                <svg
                                  className="w-3 h-3 text-red-300"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ),
                              badgeText: "Failed",
                            },
                            sample: {
                              containerClasses:
                                "from-slate-800/20 to-slate-900/30 border-slate-600/30 hover:border-slate-500/50 hover:shadow-slate-900/20",
                              dotClasses:
                                "bg-gradient-to-r from-blue-400 to-purple-500",
                              badgeClasses:
                                "bg-gradient-to-r from-slate-700/60 to-slate-600/60",
                              badgeTextClasses: "text-slate-200",
                              outputLabelClasses: "text-emerald-400",
                              outputCodeClasses:
                                "bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-300 border-emerald-500/30",
                              icon: null,
                              badgeText: "Sample",
                            },
                          };

                          const config = statusConfig[status];

                          const formatValue = (value: any) => {
                            if (value === null || value === undefined)
                              return "null";
                            if (typeof value === "object")
                              return JSON.stringify(value);
                            return String(value);
                          };

                          const renderInput = (input: any) => {
                            if (Array.isArray(input)) {
                              return (
                                <div className="space-y-1">
                                  {input.map((inp, i) => (
                                    <code
                                      key={i}
                                      className="block bg-slate-900/60 px-2 py-1 rounded-md text-xs text-slate-200 font-mono border border-slate-700/40"
                                    >
                                      {formatValue(inp)}
                                    </code>
                                  ))}
                                </div>
                              );
                            }

                            return (
                              <code className="block bg-slate-900/60 px-2 py-1 rounded-md text-xs text-slate-200 font-mono border border-slate-700/40">
                                {formatValue(input)}
                              </code>
                            );
                          };

                          return (
                            <div
                              key={index}
                              className={`bg-gradient-to-br backdrop-blur-sm rounded-lg p-3 border transition-all duration-300 hover:shadow-lg ${config.containerClasses}`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className={`w-2 h-2 rounded-full ${config.dotClasses}`}
                                    ></div>
                                    <span className="text-xs font-semibold text-slate-300">
                                      Case {index + 1}
                                    </span>
                                  </div>

                                  <div
                                    className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${config.badgeClasses}`}
                                  >
                                    {config.icon}
                                    <span
                                      className={`text-xs font-medium ${config.badgeTextClasses}`}
                                    >
                                      {config.badgeText}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex items-start space-x-2">
                                    <span className="text-xs text-slate-400 mt-1 font-medium min-w-[40px]">
                                      In:
                                    </span>
                                    <div className="flex-1">
                                      {renderInput(normalizedTest.input)}
                                    </div>
                                  </div>

                                  <div className="flex items-start space-x-2">
                                    <span
                                      className={`text-xs mt-1 font-medium min-w-[40px] ${
                                        status === "failed"
                                          ? "text-red-400"
                                          : config.outputLabelClasses
                                      }`}
                                    >
                                      {status === "failed"
                                        ? "Expected:"
                                        : "Out:"}
                                    </span>
                                    <code
                                      className={`flex-1 px-2 py-1 rounded-md text-xs font-mono border ${config.outputCodeClasses}`}
                                    >
                                      {formatValue(
                                        normalizedTest.expectedOutput
                                      )}
                                    </code>
                                  </div>

                                  {status === "failed" &&
                                    normalizedTest.actualOutput !== null && (
                                      <div className="flex items-start space-x-2">
                                        <span className="text-xs text-red-400 mt-1 font-medium min-w-[40px]">
                                          Got:
                                        </span>
                                        <code className="flex-1 bg-gradient-to-r from-red-500/10 to-red-600/10 px-2 py-1 rounded-md text-xs text-red-300 font-mono border border-red-500/30">
                                          {formatValue(
                                            normalizedTest.actualOutput
                                          )}
                                        </code>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestConsole;
