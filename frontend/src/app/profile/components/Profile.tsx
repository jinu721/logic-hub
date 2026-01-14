"use client";

import React, { useState, useEffect } from "react";
import {
  getLevels,
  getUser,
  getUserProgress,
  messageUser,
  report,
} from "@/services/client/clientServices";
import { useRouter } from "next/navigation";
import ReportPopup from "@/components/shared/ReportPopup";
import { getRankCrown } from "./RankSection";
import { useToast } from "@/context/Toast";
import socket from "@/utils/socket.helper";
import { UserIF } from "@/types/user.types";
import { LevelIF } from "@/types/level.types";
import Spinner from "@/components/shared/CustomLoader";
import ProfileHeader from "./ProfileHeader";
import UserStats from "./UserStats";
import AchievementShowcase from "./AchievementShowcase";
import RecentActivity from "./RecentActivity";
import SubmissionHeatmap from "./SubmissionHeatmap";

const UserProfileView = ({ username }: { username: string }) => {
  const [userData, setUserData] = useState<UserIF | null>(null);
  const [progressData, setProgressData] = useState<any>(null);

  const [currentUser, setCurrentUser] = useState<boolean>(false);

  const [nextLevel, setNextLevel] = useState<LevelIF | null>(null);
  const [xpProgress, setXpProgress] = useState<number>(0);
  const [xpLeft, setXpLeft] = useState<number>(0);

  const [showAnimation, setShowAnimation] = useState(false);
  const [reportPopupOpen, setReportPopupOpen] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const { showToast } = useToast() as any;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userData, levelData, progressData] = await Promise.all([
          getUser(username),
          getLevels(),
          getUserProgress(username)
        ]);

        console.log("Level Data :- ", levelData);
        console.log("userData", userData);

        setCurrentUser(userData.user.currentUser);
        setOnlineStatus(userData.user.isOnline);
        setUserData(userData.user);
        setProgressData(progressData);

        const currentLevel = levelData.levels.find(
          (lvl: any) => lvl.levelNumber === userData.user.stats.level
        );
        const nextLevel = levelData.levels.find(
          (lvl: any) => lvl.levelNumber === userData.user.stats.level + 1
        );

        let xpProgress = 100;
        let xpLeft = 0;
        let xpPerLevel = currentLevel?.requiredXP ?? 0;

        if (nextLevel) {
          xpPerLevel = nextLevel.requiredXP;
          xpProgress = Math.floor(
            (userData.user.stats.xpPoints / xpPerLevel) * 100
          );
          xpLeft = xpPerLevel - userData.user.stats.xpPoints;
        }
        setNextLevel(nextLevel);
        setXpProgress(xpProgress);
        setXpLeft(xpLeft);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUserData();
    setShowAnimation(true);
  }, [username]);

  useEffect(() => {
    if (!userData) return;

    if (userData.currentUser) {
      setOnlineStatus(true);
      return;
    }

    socket.emit("check-user-status", userData.userId);

    const handleUserOnline = ({
      userId,
      status,
    }: {
      userId: string;
      status: boolean;
    }) => {
      if (userId === userData.userId) {
        setOnlineStatus(status);
      }
    };

    socket.on("user-status", handleUserOnline);

    return () => {
      socket.off("user-status", handleUserOnline);
    };
  }, [userData]);

  const router = useRouter();

  const handleMessage = async (userId: string) => {
    try {
      const response = await messageUser(userId);
      console.log(response);
      if (response) {
        router.push(`/chat?conversationId=${response.data}`);
      }
    } catch (err) {
      console.log(err);
      showToast({ type: "error", message: "Error Sending Message" });
    }
  };

  const handleReport = async (reason: string) => {
    try {
      await report({ reason, reportedId: userData?.userId, reportedType: "User" });
      showToast({ type: "success", message: "Report Sended" });
    } catch (err) {
      console.log(err);
      showToast({ type: "error", message: "Error Sending Report" });
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 text-white min-h-screen">
        {userData ? (
          <>
            <ProfileHeader
              currentUser={currentUser}
              userData={userData}
              onlineStatus={onlineStatus}
              handleMessage={handleMessage}
              getRankCrown={getRankCrown}
              showAnimation={showAnimation}
              setReportPopupOpen={setReportPopupOpen}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <UserStats
                  currentUser={currentUser}
                  xpProgress={xpProgress}
                  xpLeft={xpLeft}
                  nextLevel={nextLevel}
                  userData={userData}
                />

                <div className="lg:col-span-8 space-y-6">
                  <AchievementShowcase
                    currentUser={currentUser}
                    userData={userData}
                  />
                  <SubmissionHeatmap
                    userId={userData.userId}
                    isCurrentUser={currentUser}
                  />
                  <RecentActivity progressData={progressData} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <Spinner />
          </div>
        )}
      </div>
      <ReportPopup
        isOpen={reportPopupOpen}
        onClose={() => setReportPopupOpen(false)}
        onSubmit={handleReport}
        reportType={"user"}
      />
    </>
  );
};

export default UserProfileView;
