import React from "react";
import { BookOpen } from "lucide-react";
import ChallengeContent from "./ChallengeContent";
import { ChallengeDomainIF } from "@/types/domain.types";
import { Language } from "./CodeEditor";

interface DomainWorkspaceProps {
  bottomPanelHeight: number;
  challenge: ChallengeDomainIF;
  challengeStarted: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  currentLanguage: Language;
  cipherFailed: boolean;
  codeToShow: string;
  userInput: string;
  setUserInput: (value: string) => void;
  setCurrentLanguage: (lang: string) => void;
  startChallenge: () => void;
  runCode: () => void;
  resetCode: () => void;
  getLastSubmission: () => void;
  handleSubmitSolution: () => void;
}

const DomainWorkspace: React.FC<DomainWorkspaceProps> = ({
  bottomPanelHeight,
  challenge,
  challengeStarted,
  isRunning,
  isSubmitting,
  currentLanguage,
  cipherFailed,
  codeToShow,
  userInput,
  setUserInput,
  setCurrentLanguage,
  startChallenge,
  runCode,
  resetCode,
  getLastSubmission,
  handleSubmitSolution,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="relative flex-shrink-0"
      style={{ height: `${100 - bottomPanelHeight}%` }}
    >
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0 bg-[#0e1117] px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 border-b border-slate-700/30 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-5 min-w-0 flex-1">
            <h3 className="font-bold text-slate-200 text-sm sm:text-base lg:text-lg flex items-center">
              {challenge.type === "code" ? "Code Editor" : "Cipher"}
            </h3>
            {challenge?.type === "code" && (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-3 px-4 py-2.5  text-slate-200 rounded-lg border border-slate-700/50 hover:border-slate-600/70 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 min-w-[140px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="font-mono text-sm">{currentLanguage}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#0e1117] backdrop-blur-md rounded-xl border border-[#1c1f26] shadow-2xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-2">
                      <div className="grid grid-cols-2 gap-1">
                        {Object.keys(challenge?.initialCode ?? {}).map(
                          (language) => (
                            <button
                              key={language}
                              onClick={() => {
                                setCurrentLanguage(language);
                                setIsOpen(false);
                              }}
                              className={`flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-lg transition-all duration-150 ${
                                currentLanguage === language
                                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                                  : "hover:bg-slate-700/60 text-slate-300 hover:text-slate-200"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  currentLanguage === language
                                    ? "bg-blue-400"
                                    : "bg-slate-500"
                                }`}
                              ></div>
                              <span className="font-mono text-sm">
                                {language}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {challengeStarted ? (
              <>
                {challenge.type === "code" && (
                  <>
                    <button
                      className="group relative flex items-center justify-center w-6 h-6 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-slate-900/40 border border-slate-600/30 hover:border-slate-500/50"
                      onClick={getLastSubmission}
                      title="Get Last Submission"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </button>

                    <button
                      className="group relative flex items-center justify-center w-6 h-6 bg-red-800 hover:bg-red-700 text-white rounded font-medium transition-all duration-300 hover:scale-105 shadow-md hover:shadow-red-900/40 border border-red-600/30 hover:border-red-500/50"
                      onClick={resetCode}
                      title="Reset Code"
                    >
                      <svg
                        className="w-3 h-3"
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
                      className="cursor-pointer group relative flex items-center justify-center px-3.5 sm:px-5 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-500 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden shadow-2xl hover:shadow-slate-900/40 text-xs sm:text-sm border border-slate-600/30 hover:border-slate-500/50"
                      onClick={runCode}
                      disabled={isRunning || isSubmitting}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-all duration-500 group-hover:blur-sm" />
                      {isRunning ? (
                        <>
                          <div className="relative z-10 w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="relative z-10 hidden sm:inline ml-3">
                            Running...
                          </span>
                        </>
                      ) : (
                        <span className="relative z-10">Run</span>
                      )}
                    </button>
                  </>
                )}

                <button
                  className={`cursor-pointer group relative flex items-center justify-center px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl font-medium transition-all duration-500 hover:scale-[1.02] text-xs sm:text-sm overflow-hidden shadow-2xl border ${
                    isSubmitting
                      ? "bg-slate-900 cursor-not-allowed text-slate-500 border-slate-700/50"
                      : "bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:via-emerald-600 hover:to-teal-700 text-white hover:shadow-emerald-900/40 border-emerald-600/30 hover:border-emerald-500/50"
                  }`}
                  onClick={handleSubmitSolution}
                  disabled={isRunning || isSubmitting}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-300/10 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-15 blur transition-all duration-500 group-hover:blur-sm" />
                  {isSubmitting ? (
                    <>
                      <div className="relative z-10 w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-slate-500/50 border-t-slate-400 rounded-full animate-spin" />
                      <span className="relative z-10 hidden sm:inline ml-3">
                        Submitting...
                      </span>
                    </>
                  ) : (
                    <span className="relative z-10">Submit</span>
                  )}
                </button>
              </>
            ) : (
              <button
                className="group px-4 py-2 sm:px-5 sm:py-2.5 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-md sm:rounded-lg font-semibold flex items-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 text-sm"
                onClick={startChallenge}
              >
                Begin
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 bg-[#0e1117] border-t border-[#1c1f26] backdrop-blur-sm relative min-h-0">
          <div className="absolute inset-2 sm:inset-3 bg-[#0e1117] border-t border-[#1c1f26] rounded-lg sm:rounded-xl border border-slate-700/30 backdrop-blur-sm">
            {challengeStarted ? (
              <ChallengeContent
                challenge={challenge}
                cipherFailed={cipherFailed}
                codeToShow={codeToShow}
                setUserInput={setUserInput}
                userInput={userInput}
                currentLanguage={currentLanguage}
              />
            ) : (
              <div className="p-4 sm:p-5 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-700/50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <BookOpen
                      size={24}
                      className="sm:w-7 sm:h-7 text-slate-400"
                    />
                  </div>
                  <p className="text-slate-400 text-sm sm:text-base">
                    {challenge?.type === "code"
                      ? "Code editor content would appear here"
                      : "Cipher content would appear here"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainWorkspace;
