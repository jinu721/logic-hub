"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import socket from "@/utils/socket.helper";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/Toast";
import { useLevelUp } from "@/context/LevelUp";
import {
  getDomain,
  getMyProfile,
  runCodeChallenge,
  submitCodeChallenge,
} from "@/services/client/clientServices";
import { ChallengeDomainIF } from "@/types/domain.types";
import { UserIF } from "@/types/user.types";
import DomainHeader from "./DomainHeader";
import DomainLeftPanel from "./DomainLeftPanel";
import DomainWorkspace from "./DomainWorkspace";
import TestConsole from "./TestConsole.tsx";
import { Language } from "./CodeEditor";
import DomainCompletePopup from "./DomainCompletePopup";
import Spinner from "@/components/shared/CustomLoader";

interface DomainViewProps {
  challengeId: string;
}

interface ConsoleOutput {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

const DomainView: React.FC<DomainViewProps> = ({ challengeId }) => {
  const [challenge, setChallenge] = useState<ChallengeDomainIF | null>(null);
  const [user, setUser] = useState<UserIF | null>(null);
  const [activeTab, setActiveTab] = useState<string>("instructions");
  const [challengeCompleted, setChallengeCompleted] = useState<boolean>(false);
  const [xpReward, setXpReward] = useState<number>(0);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
  const [previewResults, setPreviewResults] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cipherFailed, serCipherFailed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("python");
  const [codeToShow, setCodeToShow] = useState<any>(null);
  const [timerMode, setTimerMode] = useState<"stopwatch" | "timer">("stopwatch");
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const [leftPanelWidth, setLeftPanelWidth] = useState(45);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(35);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<"console" | "testcases">(
    "testcases"
  );
  const [userInput, setUserInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const { queueLevelUp }: any = useLevelUp();

  const router = useRouter();
  const { showToast }: any = useToast();

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setElapsedTime((prev) => {
        if (timerMode === "stopwatch") {
          return prev + 1;
        } else {
          const next = prev - 1;
          if (next <= 0) {
            setTimerRunning(false);
            return 0;
          }
          return next;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timerMode]);

  useEffect(() => {
    if (!timerRunning) {
      if (timerMode === "timer") {
        setElapsedTime(timerDuration);
      } else {
        setElapsedTime(0);
      }
    }
  }, [timerMode, timerDuration, timerRunning]);
  useEffect(() => {
    const fetchData = async (challengeId: string) => {
      try {
        setIsLoading(true);

        const [challengeData, userData] = await Promise.all([
          getDomain(challengeId),
          getMyProfile()
        ]);

        setChallenge(challengeData);
        setCurrentLanguage(Object.keys(challengeData.initialCode)[0] as Language);
        setUser(userData.user);

        const initialCodeState = { ...challengeData.initialCode };
        const recent = challengeData.recentSubmission;

        if (
          recent?.execution?.language &&
          recent?.execution?.codeSubmitted &&
          initialCodeState[recent.execution.language]
        ) {
          initialCodeState[recent.execution.language] = recent.execution.codeSubmitted;
        }

        setCodeToShow(initialCodeState);

        const firstLang = Object.keys(challengeData.initialCode)[0] as Language;
        setUserInput(initialCodeState[firstLang] || "");

      } catch (error) {
        console.error("Error fetching challenge:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(challengeId);
  }, [challengeId]);
  useEffect(() => {
    if (!challenge?._id) return;

    socket.emit("challenge-started", {
      challengeId: challenge._id,
      accessToken: localStorage.getItem("accessToken"),
    });

    const handleStartedCount = ({
      challengeId,
      startedCount,
    }: {
      challengeId: string;
      startedCount: number;
    }) => {
      if (challenge._id === challengeId) {
        setOnlineUsers(startedCount);
      }
    };

    socket.on("challenge-started-count", handleStartedCount);

    return () => {
      socket.emit("challenge-ended", {
        challengeId: challenge._id,
        accessToken: localStorage.getItem("accessToken"),
        reason: "close-or-reload",
      });
      socket.off("challenge-started-count", handleStartedCount);
    };
  }, [challenge?._id]);

  useEffect(() => {
    if (!isResizingHorizontal && !isResizingVertical) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      if (isResizingHorizontal) {
        const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftPanelWidth(Math.min(Math.max(newWidth, 30), 70));
      }

      if (isResizingVertical) {
        const rightPanel = containerRef.current.querySelector(".right-panel");
        if (rightPanel) {
          const rightPanelRect = rightPanel.getBoundingClientRect();
          const newHeight =
            ((rightPanelRect.bottom - e.clientY) / rightPanelRect.height) * 100;
          setBottomPanelHeight(Math.min(Math.max(newHeight, 25), 55));
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingHorizontal(false);
      setIsResizingVertical(false);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizingHorizontal, isResizingVertical]);

  const runCode = async () => {
    setIsRunning(true);
    setConsoleOutput([]);

    if (challenge?.type !== "code") return;

    try {
      setConsoleOutput([{ type: "info", message: "Running code..." }]);
      const data = await runCodeChallenge({
        challengeId: challenge._id,
        language: currentLanguage,
        sourceCode: userInput,
        userId: user?._id,
      });

      setConsoleOutput([
        { type: "success", message: data.results[0].actualOutput },
      ]);

      setPreviewResults(data.results);
    } catch (err) {
      setConsoleOutput([
        {
          type: "error",
          message: err instanceof Error ? err.message : "Unknown Error",
        },
      ]);
      showToast({ type: "error", message: "Error Running Code" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async (codeToSubmit: string | null = null) => {
    const finalCode = codeToSubmit || userInput;

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const payload = {
        challengeId: challenge?._id,
        token: localStorage.getItem("accessToken"),
        language: currentLanguage,
        userCode: finalCode,
      };

      const data = await submitCodeChallenge(payload);

      const isCipher = challenge?.type === "cipher";
      const isCode = challenge?.type === "code";
      const passed = data?.passed;

      let redirectHome = false;

      if (isCipher && !passed) {
        serCipherFailed(true);
        setTimeout(() => serCipherFailed(false), 2000);
        redirectHome = false;
      }

      if (isCode) {
        setPreviewResults(data.results);
      }

      setChallengeCompleted(!!passed);

      if (passed) {
        setXpReward(data.xpGained);
        if (data.newLevel && data.newLevel > 0) {
          queueLevelUp({
            newLevel: data.newLevel,
            xpGained: data.xpGained,
            remainingXP: data.remainingXP,
            rewards: data.rewards || [],
          });
        }
        // redirectHome = true; // Removed redirection
      }

      // if (redirectHome) {
      //   router.push("/home");
      // }
    } catch (err) {
      console.error("Submission error:", err);
      showToast({ type: "error", message: "Error Submitting Solution" });
    }

    setIsSubmitting(false);
  };

  const handleBack = useCallback(() => {
    router.push("/home");
  }, [router]);

  const handleMouseDown = useCallback(
    (type: "horizontal" | "vertical") => (e: React.MouseEvent) => {
      e.preventDefault();
      document.body.style.userSelect = "none";
      document.body.style.cursor =
        type === "horizontal" ? "col-resize" : "row-resize";

      if (type === "horizontal") {
        setIsResizingHorizontal(true);
      } else {
        setIsResizingVertical(true);
      }
    },
    []
  );

  const getLastSubmission = useCallback(() => {
    setUserInput(challenge?.recentSubmission?.execution?.codeSubmitted || "");
    if (
      challenge?.recentSubmission?.execution &&
      challenge?.recentSubmission?.execution.language === currentLanguage
    ) {
      setCodeToShow((prev: any) => ({
        ...prev,
        [currentLanguage]:
          challenge?.recentSubmission?.execution?.codeSubmitted,
      }));
    }
  }, [challenge, currentLanguage]);

  const resetCode = useCallback(() => {
    if (!challenge) return;
    setUserInput(challenge.initialCode[currentLanguage]);
    setCodeToShow((prev: any) => ({
      ...prev,
      [currentLanguage]: challenge.initialCode[currentLanguage],
    }));
  }, [challenge, currentLanguage]);

  const handleReuseCode = useCallback((code: string) => {
    setCodeToShow((prev: any) => ({
      ...prev,
      [currentLanguage]: code,
    }));
    setUserInput(code);
  }, [currentLanguage]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setUserInput(newCode);

      if (
        !hasStartedTyping &&
        codeToShow &&
        codeToShow[currentLanguage] &&
        newCode !== codeToShow[currentLanguage]
      ) {
        setHasStartedTyping(true);
        setTimerRunning(true);
      }
    },
    [hasStartedTyping, codeToShow, currentLanguage]
  );

  const pauseTimer = useCallback(() => setTimerRunning(false), []);
  const resumeTimer = useCallback(() => setTimerRunning(true), []);
  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setElapsedTime(0);
    setHasStartedTyping(false);
  }, []);

  return (
    <div
      className="h-screen bg-[var(--logichub-primary-bg)] text-[var(--logichub-primary-text)] flex flex-col overflow-hidden"
      ref={containerRef}
    >
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      ) : challenge?.isPremium && !user?.membership?.isActive ? (
        <div className="flex-1 flex overflow-hidden relative">
          <div className="absolute inset-0 filter blur-sm pointer-events-none">
            <DomainHeader
              challenge={challenge}
              elapsedTime={elapsedTime}
              timerRunning={timerRunning}
              timerMode={timerMode}
              onPause={pauseTimer}
              onResume={resumeTimer}
              onReset={resetTimer}
              onSwitchMode={setTimerMode}
              onSetDuration={setTimerDuration}
              onlineUsers={onlineUsers}
              handleBack={handleBack}
            />

            <div className="flex-1 flex overflow-hidden relative">
              <DomainLeftPanel
                leftPanelWidth={leftPanelWidth}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                challenge={challenge}
                user={user as UserIF}
                isLoading={isLoading}
                handleReuseCode={handleReuseCode}
              />

              <div
                className="w-1 bg-[var(--logichub-border)]/50 hover:bg-[var(--logichub-accent)]/50 cursor-col-resize transition-colors duration-200 relative group flex-shrink-0"
                onMouseDown={handleMouseDown("horizontal")}
              >
                <div className="absolute inset-y-0 -inset-x-2 flex items-center justify-center">
                  <div className="w-1 h-16 bg-[var(--logichub-border)] rounded-full group-hover:bg-[var(--logichub-accent)] transition-colors shadow-lg"></div>
                </div>
              </div>

              <div className="flex-1 flex flex-col right-panel min-w-0">
                <DomainWorkspace
                  bottomPanelHeight={bottomPanelHeight}
                  challenge={challenge}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  currentLanguage={currentLanguage}
                  cipherFailed={cipherFailed}
                  codeToShow={codeToShow}
                  userInput={userInput}
                  setUserInput={handleCodeChange}
                  setCurrentLanguage={(lang: string) =>
                    setCurrentLanguage(lang as Language)
                  }
                  runCode={runCode}
                  resetCode={resetCode}
                  getLastSubmission={getLastSubmission}
                  handleSubmitSolution={handleSubmitSolution}
                />

                {challenge.type === "code" && (
                  <TestConsole
                    challenge={challenge}
                    consoleOutput={consoleOutput}
                    previewResults={previewResults}
                    handleMouseDown={handleMouseDown}
                    bottomPanelHeight={bottomPanelHeight}
                    activeRightTab={activeRightTab}
                    setActiveRightTab={setActiveRightTab}
                    setConsoleOutput={(output: string) =>
                      setConsoleOutput((prev) => [
                        ...prev,
                        { type: "info", message: output },
                      ])
                    }
                  />
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[var(--logichub-secondary-bg)]/80 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="rounded-2xl p-8 max-w-md w-full mx-4 bg-[var(--logichub-card-bg)] shadow-lg border border-[var(--logichub-border)]">
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-[var(--logichub-accent)] to-[var(--logichub-btn)] bg-clip-text text-transparent">
                Premium Challenge
              </h3>
              <p className="text-[var(--logichub-muted-text)] text-center mb-8 leading-relaxed">
                This challenge is available for Premium members only. Upgrade to
                unlock advanced problems and exclusive features.
              </p>
              <div className="flex items-center justify-between gap-4 w-full max-w-xl mx-auto">
                <button
                  onClick={handleBack}
                  className="w-1/5 h-12 flex items-center justify-center rounded-xl bg-[var(--logichub-secondary-bg)] border border-[var(--logichub-border)] hover:bg-[var(--logichub-card-bg)] hover:border-[var(--logichub-accent)] text-[var(--logichub-primary-text)] transition-all duration-300 backdrop-blur-sm hover:scale-[1.02]"
                  title="Go Back"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => router.push("/premiumplans")}
                  className="group relative w-4/5 h-12 cursor-pointer bg-[var(--logichub-accent)] hover:bg-[var(--logichub-btn-hover)] text-[var(--logichub-accent-text)] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-[var(--logichub-accent)]/25 transform hover:scale-[1.02] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[var(--logichub-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Upgrade to Premium</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : challenge && user ? (
        <>
          <DomainHeader
            challenge={challenge}
            elapsedTime={elapsedTime}
            timerRunning={timerRunning}
            timerMode={timerMode}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onReset={resetTimer}
            onSwitchMode={setTimerMode}
            onSetDuration={setTimerDuration}
            onlineUsers={onlineUsers}
            handleBack={handleBack}
          />

          <div className="flex-1 flex overflow-hidden relative">
            <DomainLeftPanel
              leftPanelWidth={leftPanelWidth}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              challenge={challenge}
              user={user}
              isLoading={isLoading}
              handleReuseCode={handleReuseCode}
            />

            <div
              className="w-1 bg-[var(--logichub-border)]/50 hover:bg-[var(--logichub-accent)]/50 cursor-col-resize transition-colors duration-200 relative group flex-shrink-0"
              onMouseDown={handleMouseDown("horizontal")}
            >
              <div className="absolute inset-y-0 -inset-x-2 flex items-center justify-center">
                <div className="w-1 h-16 bg-[var(--logichub-border)] rounded-full group-hover:bg-[var(--logichub-accent)] transition-colors shadow-lg"></div>
              </div>
            </div>

            <div className="flex-1 flex flex-col right-panel min-w-0">
              <DomainWorkspace
                bottomPanelHeight={bottomPanelHeight}
                challenge={challenge}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                currentLanguage={currentLanguage}
                cipherFailed={cipherFailed}
                codeToShow={codeToShow}
                userInput={userInput}
                setUserInput={handleCodeChange}
                setCurrentLanguage={(lang: string) =>
                  setCurrentLanguage(lang as Language)
                }
                runCode={runCode}
                resetCode={resetCode}
                getLastSubmission={getLastSubmission}
                handleSubmitSolution={handleSubmitSolution}
              />

              {challenge.type === "code" && (
                <TestConsole
                  challenge={challenge}
                  consoleOutput={consoleOutput}
                  previewResults={previewResults}
                  handleMouseDown={handleMouseDown}
                  bottomPanelHeight={bottomPanelHeight}
                  activeRightTab={activeRightTab}
                  setActiveRightTab={setActiveRightTab}
                  setConsoleOutput={(output: string) =>
                    setConsoleOutput((prev) => [
                      ...prev,
                      { type: "info", message: output },
                    ])
                  }
                />
              )}
            </div>
          </div>

          {challengeCompleted && <DomainCompletePopup xp={xpReward} />}
        </>
      ) : null}
    </div>
  );
};

export default DomainView;