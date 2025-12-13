import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Terminal,
  FileCheck,
  RefreshCw,
} from "lucide-react";

interface ConsoleOutput {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface TestCase {
  input: any[];
  output?: any;
  expected?: any;
  actual?: any;
  error?: string | null;
  passed?: boolean;
  isHidden?: boolean;
}

interface Props {
  bottomPanelHeight: number;
  handleMouseDown: (direction: "vertical") => (e: React.MouseEvent) => void;
  activeRightTab: "console" | "testcases";
  setActiveRightTab: (tab: "console" | "testcases") => void;
  setConsoleOutput?: (output: string) => void;
  consoleOutput: ConsoleOutput[];
  previewResults: TestCase[];
  challenge: any;
}

function formatValue(value: any): string {
  try {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
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
  const [selectedTestCase, setSelectedTestCase] = useState(0);

  const hasRunTests = previewResults.length > 0;

  const testData = useMemo(() => {
    if (hasRunTests) {
      return previewResults?.map((result) => ({
        input: result.input || [],
        expected: result.expected,
        actual: result.actual,
        error: result.error,
        passed: result.passed,
      }));
    } else {
      const cases = challenge?.testCases || [];
      return cases
        .filter((tc: any) => !tc.isHidden)
        .map((tc: any) => ({
          input: tc.input || [],
          expected: tc.output,
          actual: undefined, 
          error: null,
          passed: undefined, 
        }));
    }
  }, [previewResults, challenge?.testCases, hasRunTests]);

  console.log("Has Run Tests:", hasRunTests);
  console.log("Test Data:", testData);

  useEffect(() => {
    if (testData.length > 0 && selectedTestCase >= testData.length) {
      setSelectedTestCase(0);
    }
  }, [testData.length, selectedTestCase]);

  const handleSelectTestCase = useCallback(
    (index: number) => {
      if (index >= 0 && index < testData.length) {
        setSelectedTestCase(index);
      }
    },
    [testData.length]
  );

  const handleClearConsole = useCallback(() => {
    setConsoleOutput?.("");
  }, [setConsoleOutput]);

  const currentTestCase = useMemo(() => {
    const validIndex = Math.max(
      0,
      Math.min(selectedTestCase, testData.length - 1)
    );
    return testData[validIndex] || null;
  }, [selectedTestCase, testData]);

  return (
    <>
      <div
        className="h-1 bg-[#1c1f26] hover:bg-blue-500 cursor-row-resize transition-colors duration-200 relative group flex-shrink-0"
        onMouseDown={handleMouseDown("vertical")}
      >
        <div className="absolute inset-x-0 -inset-y-1 flex items-center justify-center">
          <div className="h-0.5 w-12 bg-gray-500 rounded-full group-hover:bg-blue-400 transition-colors"></div>
        </div>
      </div>

      <div
        className="bg-[#0e1117] border-t border-[#1c1f26] flex-shrink-0"
        style={{ height: `${bottomPanelHeight}%`, minHeight: "200px" }}
      >
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 bg-[#0e1117] border-b border-[#1c1f26]">
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex">
                <button
                  onClick={() => setActiveRightTab("testcases")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeRightTab === "testcases"
                      ? "text-white border-blue-500"
                      : "text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  <FileCheck size={16} className="inline mr-2" />
                  Testcase
                </button>
                <button
                  onClick={() => setActiveRightTab("console")}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeRightTab === "console"
                      ? "text-white border-blue-500"
                      : "text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-600"
                  }`}
                >
                  <Terminal size={16} className="inline mr-2" />
                  Console
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {activeRightTab === "console" && (
                  <button
                    onClick={handleClearConsole}
                    className="px-3 py-1.5 text-gray-400 hover:text-white text-sm rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center"
                  >
                    <RefreshCw size={14} className="mr-1" />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {activeRightTab === "testcases" ? (
              <div className="h-full flex flex-col">
                <div className="flex-shrink-0 bg-[#0e1117] border-b border-[#1c1f26]">
                  <div className="flex items-center px-4 py-2 space-x-2 overflow-x-auto">
                    {testData?.map((test, index) => {
                      const passed = test.passed;
                      return (
                        <button
                          key={`test-${index}`}
                          onClick={() => handleSelectTestCase(index)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap flex items-center space-x-1 ${
                            selectedTestCase === index
                              ? "bg-[#1c1f26] text-white border border-[#2a2f3a]"
                              : "text-gray-400 hover:text-gray-200 hover:bg-[#1a1e25]"
                          }`}
                        >
                          <span>Case {index + 1}</span>
                          {passed !== undefined && (
                            <div
                              className={`w-2 h-2 rounded-full ${
                                passed ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                  {currentTestCase ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-2 font-semibold">
                          INPUT
                        </div>
                        {currentTestCase.input?.map((inp: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-[#1c1f26] border border-[#2a2f3a] rounded-md p-3 mb-2"
                          >
                            <code className="text-sm text-white font-mono whitespace-pre-wrap">
                              {formatValue(inp)}
                            </code>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-sm text-gray-400 mb-2 font-semibold">
                          EXPECTED OUTPUT
                        </div>
                        <div className="bg-[#1c1f26] border border-[#2a2f3a] rounded-md p-3">
                          <code className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                            {formatValue(currentTestCase.expected)}
                          </code>
                        </div>
                      </div>

                      {hasRunTests && currentTestCase.actual !== undefined && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2 font-semibold">
                            ACTUAL OUTPUT
                          </div>
                          <div
                            className={`border rounded-md p-3 ${
                              currentTestCase.passed
                                ? "bg-green-900/20 border-green-700"
                                : "bg-red-900/20 border-red-700"
                            }`}
                          >
                            <code
                              className={`text-sm font-mono whitespace-pre-wrap ${
                                currentTestCase.passed
                                  ? "text-green-300"
                                  : "text-red-300"
                              }`}
                            >
                              {formatValue(currentTestCase.actual)}
                            </code>
                          </div>
                        </div>
                      )}

                      {hasRunTests && currentTestCase.error && (
                        <div>
                          <div className="text-sm text-red-400 mb-2 font-semibold">
                            ERROR
                          </div>
                          <div className="bg-red-900/20 border border-red-700 rounded-md p-3">
                            <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap">
                              {currentTestCase.error}
                            </pre>
                          </div>
                        </div>
                      )}

                      {hasRunTests && currentTestCase.passed !== undefined && (
                        <div className="flex items-center space-x-2">
                          <div
                            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                              currentTestCase.passed
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {currentTestCase.passed ? "✓ Passed" : "✗ Failed"}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <FileCheck size={32} className="mb-3 opacity-50" />
                      <p className="text-center">No test cases available</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 h-full">
                <div className="bg-[#0e1117] rounded-lg p-4 h-full min-h-32 font-mono text-sm">
                  {consoleOutput?.length > 0 ? (
                    <div className="space-y-1">
                      {consoleOutput?.map((output, index) => (
                        <div
                          key={`console-${index}`}
                          className="flex items-start"
                        >
                          <span
                            className={`mr-2 ${
                              output.type === "error"
                                ? "text-red-400"
                                : output.type === "success"
                                ? "text-green-400"
                                : output.type === "warning"
                                ? "text-yellow-400"
                                : "text-blue-400"
                            }`}
                          >
                            {output.type === "error"
                              ? "✗"
                              : output.type === "success"
                              ? "✓"
                              : output.type === "warning"
                              ? "⚠"
                              : "ℹ"}
                          </span>
                          <span
                            className={`${
                              output.type === "error"
                                ? "text-red-300"
                                : output.type === "success"
                                ? "text-green-300"
                                : output.type === "warning"
                                ? "text-yellow-300"
                                : "text-blue-300"
                            }`}
                          >
                            {output.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Terminal size={32} className="mb-3 opacity-50" />
                      <p className="text-center">
                        You have not run your code yet.
                        <br />
                        <span className="text-sm">
                          Click "Run Code" to see output here.
                        </span>
                      </p>
                    </div>
                  )}
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