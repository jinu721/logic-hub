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
    { id: "solutions", label: "Solutions", icon: Book, locked: !challengeStarted },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div
      className="bg-slate-900/60 border-r border-slate-700/40 backdrop-blur-md flex-shrink-0"
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
                    ${isActive
                      ? "border-blue-400 text-blue-300 bg-blue-500/5"
                      : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"}
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
                  <span className="font-semibold whitespace-nowrap">{label}</span>
                  {locked && <Lock size={14} className="ml-auto opacity-60" />}
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 sm:p-5 lg:p-6">
          {activeTab === "instructions" && <DomainInstructions challenge={challenge} />}
          {activeTab === "hints" && <DomainHints challenge={challenge} />}
          {activeTab === "solutions" && <SolutionsSection challenge={challenge} user={user} />}
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
