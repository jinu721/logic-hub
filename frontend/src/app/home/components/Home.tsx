"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock,
  AlertTriangle,
  ArrowRight,
  Users,
  Play,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import socket from "@/utils/socket.helper";
import { LevelUpPopup } from "@/components/shared/LevelUp";
import { useLevelUp } from "@/context/LevelUp";
import ChallengeNotificationModal from "./NotificationModal";
import GiftReceivedModal from "./GiftReciveModal";
import { getChallenges, getMyProfile } from "@/services/client/clientServices";
import DailyReward from "@/components/shared/DailyReward";
import CoolAnimatedBackground from "./AnimatedBg";
import AdvancedFilterSidebar from "./AdvancedFilter";
import GroupsSidebar from "./GroupListSidebar";
import DomainsSection from "./DomainSection";
import { ChallengeDomainIF } from "@/types/domain.types";
import { useToast } from "@/context/Toast";
import { debounce } from "lodash";
import Spinner from "@/components/shared/CustomLoader";
import { UserIF } from "@/types/user.types";
import GeometricBackground from "@/components/common/GeometricBackground";

const hasClaimedToday = (lastRewardClaimDate: Date | null) => {
  if (!lastRewardClaimDate) return false;

  const lastDate = new Date(lastRewardClaimDate);
  const today = new Date();

  return (
    lastDate.getDate() === today.getDate() &&
    lastDate.getMonth() === today.getMonth() &&
    lastDate.getFullYear() === today.getFullYear()
  );
};

import { useDispatch, useSelector } from "react-redux";
import {
  setChallenges,
  setUser,
  setFilters,
  setLoading,
  setError,
  selectAllChallenges,
  selectFilteredChallenges,
  selectIsLoading,
  selectError,
  selectUser,
  selectFilters,
  selectLastFetch,
} from "@/redux/slices/homeSlice";


const Home = () => {
  const dispatch = useDispatch();

  const challenges = useSelector(selectAllChallenges);
  const filteredChallenges = useSelector(selectFilteredChallenges);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const user = useSelector(selectUser);
  const filters = useSelector(selectFilters);
  const lastFetch = useSelector(selectLastFetch);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showGiftRecive, setShowGiftRecive] = useState(false);
  const [challangeData, setChallengeData] = useState({});
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [highlightedDomain, setHighlightedDomain] = useState<ChallengeDomainIF | null>(null);

  const { levelUpData, clearLevelUp } = useLevelUp() as any;
  const { showToast } = useToast() as any;

  const CACHE_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    const initData = async () => {
      const isStale = Date.now() - lastFetch > CACHE_DURATION;

      if (lastFetch === 0 || isStale) {
        dispatch(setLoading(true));
        try {
          // Promise.all to fetch both in parallel
          const [userData, data] = await Promise.all([
            getMyProfile(),
            getChallenges({})
          ]);

          dispatch(setUser(userData.user));
          dispatch(setChallenges(data.challenges));

          if (data.popularChallange) {
            setHighlightedDomain(data.popularChallange);
          }

          const cliamed = hasClaimedToday(userData.user?.lastRewardClaimDate);
          if (!cliamed) {
            setShowDailyReward(true);
          }
        } catch (err) {
          console.error("Error loading home data:", err);
          dispatch(setError("Failed to load challenges."));
        } finally {
          dispatch(setLoading(false));
        }
      } else {
        if (!highlightedDomain && challenges.length > 0) {
          setHighlightedDomain(challenges[0]);
        }
      }
    };

    initData();
    const token = localStorage.getItem("accessToken");
    if (token) {
      socket.emit("user-online", token);
    }
  }, [dispatch, lastFetch]); // Removed challenges.length to prevent unnecessary re-runs





  useEffect(() => {
    const logged = searchParams.get("logged");
    if (logged === "social") {
      const accessToken = searchParams.get("accessToken");
      if (!accessToken) {
        showToast({
          type: "error",
          message: "Invalid access token",
        });
        return;
      }
      localStorage.setItem("user", "true");
      localStorage.setItem("accessToken", accessToken);
      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }
  }, []);

  useEffect(() => {
    socket.emit("register_user", localStorage.getItem("accessToken"));
    socket.on("domain_notification", (domainData) => {
      setChallengeData(domainData);
      setShowNotification(true);
    });
    socket.on("gift_notification", () => {
      setShowGiftRecive(true);
    });
  }, []);

  useEffect(() => {
    if (levelUpData.pending) {
      const timer = setTimeout(() => {
        setShowLevelUp(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [levelUpData.pending]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "failed-timeout":
        return <Clock className="w-4 h-4" />;
      case "failed-output":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "emerald";
      case "failed-timeout":
        return "amber";
      case "failed-output":
        return "rose";
      default:
        return "indigo";
    }
  };

  const getButtonText = (status: string) => {
    switch (status) {
      case "completed":
        return "View Results";
      case "failed-timeout":
      case "failed-output":
        return "Retry Challenge";
      default:
        return "Start Challenge";
    }
  };

  const statusColor = getStatusColor(
    highlightedDomain?.userStatus ? highlightedDomain?.userStatus : "pending",
  );

  const handleClosePopup = () => {
    setShowLevelUp(false);
    clearLevelUp();
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  const handleNavigate = (challangeId: string) => {
    setShowNotification(false);
    router.push(`/domain/${challangeId}`);
  };

  const handleFiltersChange = useCallback((newFilters: any) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const handleFilterReset = () => {
    dispatch(setFilters({
      type: [],
      level: [],
      status: [],
      tags: [],
      searchQuery: "",
    }));
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((cb) => {
        cb();
      }, 500),
    [],
  );

  const handleSearchChange = (query: string) => {
    dispatch(setFilters({ ...filters, searchQuery: query }));
  };

  return (
    <>
      <div className="min-h-screen bg-[var(--logichub-primary-bg)] text-gray-100">
        <main className="container mx-auto px-4 py-6">
          {highlightedDomain && (
            <div className="w-full">
              <div className="relative group">
                <div className="absolute inset-0 rounded-3xl overflow-hidden bg-gray-900">
                  <CoolAnimatedBackground
                    userStatus={highlightedDomain?.userStatus}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/90"></div>
                </div>

                <div className="relative z-10 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-${statusColor}-500/20 text-${statusColor}-300 border border-${statusColor}-500/30`}
                        >
                          {getStatusIcon(
                            highlightedDomain?.userStatus
                              ? highlightedDomain?.userStatus
                              : "pending",
                          )}
                          {highlightedDomain?.userStatus === "completed"
                            ? "Completed"
                            : highlightedDomain?.userStatus === "failed-timeout"
                              ? "Timed Out"
                              : highlightedDomain?.userStatus ===
                                "failed-output"
                                ? "Failed"
                                : "Available"}
                        </span>
                        <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {highlightedDomain.level}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
                        {highlightedDomain.title}
                      </h2>

                      <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
                        {highlightedDomain.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-${statusColor}-500/20`}
                      >
                        <Clock className={`w-5 h-5 text-${statusColor}-400`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Time Limit</p>
                        <p className="text-white font-semibold">
                          {highlightedDomain.timeLimit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-${statusColor}-500/20`}
                      >
                        <Users className={`w-5 h-5 text-${statusColor}-400`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Completed</p>
                        <p className="text-white font-semibold">
                          {highlightedDomain.completedUsers}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-${statusColor}-500/20`}
                      >
                        <AlertTriangle
                          className={`w-5 h-5 text-${statusColor}-400`}
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Success Rate</p>
                        <p className="text-white font-semibold">
                          {highlightedDomain.successRate}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        router.push(`/domain/${highlightedDomain._id}`);
                      }}
                      className={`
                group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white
                bg-gradient-to-r from-${statusColor}-600 to-${statusColor}-700 
                hover:from-${statusColor}-700 hover:to-${statusColor}-800
                transform hover:scale-105 transition-all duration-300
                shadow-lg shadow-${statusColor}-900/25 hover:shadow-${statusColor}-900/40
              `}
                    >
                      <span>
                        {getButtonText(
                          highlightedDomain?.userStatus
                            ? highlightedDomain?.userStatus
                            : "pending",
                        )}
                      </span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                <div
                  className={`absolute inset-0 rounded-3xl border border-${statusColor}-500/20 group-hover:border-${statusColor}-500/40 transition-all duration-300`}
                ></div>
              </div>
            </div>
          )}

          {isLoading ? (
            <Spinner />
          ) : error ? (
            <div className="bg-red-900/20 text-red-400 p-4 rounded-xl border border-red-700/30">
              {error}
            </div>
          ) : (
            <>
              <div className="min-h-screen ">
                <GeometricBackground />
                <div className="container mx-auto px-4 py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-3 xl:col-span-2">
                      <AdvancedFilterSidebar
                        challenges={challenges}
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        searchQuery={filters.searchQuery}
                        handleSearchChange={handleSearchChange}
                        onClearFilters={handleFilterReset}
                      />
                    </div>

                    <div className="lg:col-span-6 xl:col-span-8">
                      <DomainsSection challenges={filteredChallenges} user={user as UserIF} />
                    </div>

                    <div className="lg:col-span-3 xl:col-span-2">
                      <GroupsSidebar user={user} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      {showLevelUp && levelUpData.pending && (
        <LevelUpPopup
          newLevel={levelUpData.newLevel}
          xpGained={levelUpData.xpGained}
          rewards={levelUpData.rewards}
          onClose={handleClosePopup}
        />
      )}
      {showNotification && (
        <ChallengeNotificationModal
          onClose={handleDismiss}
          challenge={challangeData}
          onNavigate={handleNavigate}
        />
      )}
      {showGiftRecive && <GiftReceivedModal />}
      {showDailyReward && <DailyReward user={user || (highlightedDomain as any)?.user} />}
    </>
  );
};

export default Home;
