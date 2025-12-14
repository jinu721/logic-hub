import { FC } from "react";
import { BookOpen, Lightbulb, Book, History} from "lucide-react";
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
  challenge: ChallengeDomainIF;
  user: UserIF;
  isLoading: boolean;
  handleReuseCode: (code: string) => void;
}

const DomainLeftPanel: FC<DomainLeftPanelProps> = ({
  leftPanelWidth,
  activeTab,
  setActiveTab,
  challenge,
  user,
  isLoading,
  handleReuseCode,
}) => {
  const tabs = [
    { id: "instructions", label: "Description", icon: BookOpen },
    { id: "hints", label: "Hints", icon: Lightbulb },
    {
      id: "solutions",
      label: "Solutions",
      icon: Book,
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
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  className={`group flex items-center space-x-2 px-4 py-3 text-sm border-b-2 transition-all duration-300 relative
                ${
                  isActive
                    ? "text-[#c9d1d9] "
                    : "border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/30"
                }
              `}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon
                    size={16}
                    className={`transition-colors ${
                      isActive ? "text-[#c9d1d9]" : "group-hover:text-slate-300"
                    }`}
                  />
                  <span className="font-semibold whitespace-nowrap">
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto space-y-8">
          {activeTab === "instructions" && (
            <div className="space-y-6">
              <DomainInstructions challenge={challenge} />
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
