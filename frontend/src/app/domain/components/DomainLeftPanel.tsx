import { FC } from "react";
import { BookOpen, Lightbulb, Book, History, Lock } from "lucide-react";
import DomainInstructions from "./DomainInstructions";
import DomainHints from "./DomainHints";
import SolutionsSection from "./Solution";
import SubmissionHistory from "./SubmissionHistory";
import { UserIF } from "@/types/user.types";
import { ChallengeDomainIF } from "@/types/domain.types";

interface DomainLeftPanelProps {
  leftPanelWidth: number;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  challengeStarted: boolean;
  challenge: ChallengeDomainIF;
  user: UserIF;
  isLoading: boolean;
  handleReuseCode: (code: string) => void;
}

const DomainLeftPanel: FC<DomainLeftPanelProps> = ({
  leftPanelWidth,
  activeTab,
  setActiveTab,
  challengeStarted,
  challenge,
  user,
  isLoading,
  handleReuseCode,
}) => {
  const tabs = [
    { id: "instructions", label: "Description", icon: BookOpen },
    { id: "hints", label: "Hints", icon: Lightbulb, locked: !challengeStarted },
    {
      id: "solutions",
      label: "Solutions",
      icon: Book,
      locked: !challengeStarted,
    },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div
      className="bg-[#0e1117] border-r border-[#1c1f26] backdrop-blur-md flex-shrink-0"
      style={{ width: `${leftPanelWidth}%`, minWidth: "260px" }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 border-b border-slate-700/30 bg-slate-800/20 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map(({ id, label, icon: Icon, locked }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  className={`group flex items-center space-x-2 px-4 py-3 text-sm border-b-2 transition-all duration-300 relative
                ${
                  isActive
                    ? "border-blue-400 text-blue-300 bg-blue-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                }
                ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
                  onClick={() => !locked && setActiveTab(id)}
                >
                  <Icon
                    size={16}
                    className={`transition-colors ${
                      isActive ? "text-blue-400" : "group-hover:text-slate-300"
                    }`}
                  />
                  <span className="font-semibold whitespace-nowrap">
                    {label}
                  </span>
                  {locked && <Lock size={14} className="ml-auto opacity-60" />}
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6 space-y-8">
          {activeTab === "instructions" && (
            <div className="space-y-6">
              <DomainInstructions challenge={challenge} />

              <div className="relative">
                <h3 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-3">
                  Sample Testcases
                </h3>

                <div className="space-y-5">
                  {
                    challenge.testCases?.slice(0,3).map((testCase, index) => (
                      <div key={index} className="border-slate-700/30 bg-gradient-to-r from-slate-800/30 to-slate-700/20 backdrop-blur-md rounded-lg overflow-hidden">
                        <div className="grid grid-cols-2 divide-x divide-slate-700/50">
                          <div className="p-4">
                            <div className="text-[11px] uppercase font-medium text-slate-400 mb-2">
                              Input
                            </div>
                            <pre className="bg-slate-800/60 rounded-md p-3 text-slate-200 text-xs leading-relaxed overflow-x-auto">
                              {testCase.input.map((input) => (
                                `\n${input}`
                              ))}
                            </pre>
                          </div>

                          <div className="p-4">
                            <div className="text-[11px] uppercase font-medium text-slate-400 mb-2">
                              Output
                            </div>
                            <pre className="bg-slate-800/60 rounded-md p-3 text-emerald-400 text-xs leading-relaxed overflow-x-auto">
                              {testCase.output}
                            </pre>
                          </div>
                        </div>

                        {testCase?.explanation && (       
                        <div className="border-t border-slate-700/50 p-4">
                            <div className="text-[11px] uppercase font-medium text-slate-400 mb-1">
                              Explanation
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">
                              The array is sorted in ascending order.
                            </p>
                        </div>
                        )}
                      </div>    
                    ))
                  }
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-300 mb-3">
                  Constraints
                </h3>
                <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
                  <li>
                    <span className="text-slate-400">1 ≤</span> n{" "}
                    <span className="text-slate-400">≤</span> 10⁵
                  </li>
                  <li>
                    Array elements are in the range{" "}
                    <span className="text-slate-400">-10⁴ ≤ arr[i] ≤ 10⁴</span>
                  </li>
                  <li>
                    Expected time complexity:{" "}
                    <span className="text-slate-400">O(n log n)</span>
                  </li>
                  <li>
                    Expected space complexity:{" "}
                    <span className="text-slate-400">O(1)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "hints" && <DomainHints challenge={challenge} />}
          {activeTab === "solutions" && (
            <SolutionsSection challenge={challenge} user={user} />
          )}
          {activeTab === "history" && (
            <SubmissionHistory
              challenge={challenge}
              isLoading={isLoading}
              handleReuseCode={handleReuseCode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainLeftPanel;
