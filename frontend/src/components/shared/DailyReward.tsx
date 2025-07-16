import { useState, useEffect } from "react";
import { Gift, X, Check, Star, Sparkles, Trophy, Crown } from "lucide-react";
import { useToast } from "@/context/Toast";
import { claimDailyReward } from "@/services/client/clientServices";

export default function GameDailyRewards({ user }) {
  const [showModal, setShowModal] = useState(true);
  const [currentDay] = useState(user.dailyRewardDay || 1);
  const [claimedToday, setClaimedToday] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [animateRewards, setAnimateRewards] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [claimAnimation, setClaimAnimation] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);

  const { showToast } = useToast();

  const isGoldMember =
    user.membership?.isActive && user.membership?.type === "gold";

  const rewards = [
    { day: 1, reward: "50 XP", value: 50 },
    { day: 2, reward: "100 XP", value: 100 },
    { day: 3, reward: "150 XP", value: 150 },
    { day: 4, reward: "200 XP", value: 200 },
    { day: 5, reward: "250 XP", value: 250 },
    { day: 6, reward: "300 XP", value: 300 },
    { day: 7, reward: "500 XP", value: 500 },
  ].map((reward) => {
    if (isGoldMember) {
      return {
        ...reward,
        value: reward.value * 2,
        reward: `${reward.value * 2} XP`,
      };
    }
    return reward;
  });

  useEffect(() => {
    const getRewardValue = (day) => {
      const reward = rewards.find((r) => r.day === day);
      if (!reward) return 0;

      if (user.membership?.isActive && user.membership.type === "gold") {
        return reward.value * 2;
      }
      return reward.value;
    };

    getRewardValue(currentDay);
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimate(true);
    }, 100);

    const timer2 = setTimeout(() => {
      setAnimateRewards(true);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleClaim = async () => {
    if (claimedToday) return;
    setClaimAnimation(true);
    
    try {
        await claimDailyReward();
        setTimeout(() => {
            setClaimAnimation(false);
            setConfetti(true);
        setClaimedToday(true);
      }, 1500);
      showToast({
        type: "success",
        message: "Daily reward claimed successfully",
    });
} catch (error) {
       setClaimAnimation(false);
      showToast({ type: "error", message: "Error claiming daily reward" });
      console.error("Error claiming daily reward:", error);
    }
    setTimeout(() => {
      setConfetti(false);
    }, 4000);
  };

  const closeModal = () => {
    setAnimate(false);
    setAnimateRewards(false);
    setTimeout(() => {
      setShowModal(false);
    }, 500);
  };

  const isDayClaimed = (day) =>
    day < currentDay || (day === currentDay && claimedToday);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-opacity-70 backdrop-blur-md">
      <div
        className={`relative bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-indigo-500/10 transition-all duration-700 transform ${
          animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="w-64 h-64 bg-indigo-600/5 rounded-full filter blur-3xl absolute top-0 -left-32 animate-pulse"></div>
          <div
            className="w-64 h-64 bg-purple-600/5 rounded-full filter blur-3xl absolute -bottom-32 -right-32 animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>

          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2,
                  animation: `twinkle ${
                    Math.random() * 3 + 2
                  }s infinite alternate`,
                }}
              />
            ))}
            <style jsx>{`
              @keyframes twinkle {
                0% {
                  transform: scale(0.4);
                  opacity: 0.2;
                }
                100% {
                  transform: scale(1);
                  opacity: 0.6;
                }
              }
            `}</style>
          </div>
        </div>

        {confetti && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(60)].map((_, i) => {
              const isSquare = i % 5 === 0;
              const size = Math.random() * 6 + 3;

              return (
                <div
                  key={`confetti-${i}`}
                  className={isSquare ? "absolute" : "absolute rounded-full"}
                  style={{
                    width: `${size}px`,
                    height: isSquare ? `${size}px` : `${size}px`,
                    backgroundColor: [
                      "#FF5E5B",
                      "#7B61FF",
                      "#2CCCFF",
                      "#FFC700",
                      "#37FF8B",
                      "#FF3DCA",
                    ][i % 6],
                    left: `${Math.random() * 100}%`,
                    top: `-5%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    animation: `confetti-fall-${i % 3} ${
                      Math.random() * 2 + 2
                    }s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.8}s`,
                    zIndex: 50,
                    boxShadow: "0 0 2px rgba(255,255,255,0.3)",
                  }}
                />
              );
            })}
            <style jsx>{`
              @keyframes confetti-fall-0 {
                0% {
                  transform: translateY(0) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(400px) rotate(720deg);
                  opacity: 0;
                }
              }
              @keyframes confetti-fall-1 {
                0% {
                  transform: translateY(0) rotate(0deg) translateX(0);
                  opacity: 1;
                }
                100% {
                  transform: translateY(400px) rotate(360deg) translateX(-100px);
                  opacity: 0;
                }
              }
              @keyframes confetti-fall-2 {
                0% {
                  transform: translateY(0) rotate(0deg) translateX(0);
                  opacity: 1;
                }
                100% {
                  transform: translateY(400px) rotate(-360deg) translateX(100px);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        )}

        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-all duration-300 p-1 hover:bg-white/10 rounded-full z-10 group"
          aria-label="Close"
        >
          <X
            size={16}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
        </button>

        <div
          className={`flex flex-col items-center justify-center mb-6 transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-25 blur-md animate-pulse"></div>
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-3 rounded-full shadow-lg">
              <Gift className="text-white" size={18} />
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`orbit-${i}`}
                  className="absolute w-1.5 h-1.5 bg-indigo-400 rounded-full"
                  style={{
                    animation: `orbit ${3 + i}s linear infinite`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
              <style jsx>{`
                @keyframes orbit {
                  0% {
                    transform: rotate(0deg) translateX(20px) rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg) translateX(20px) rotate(-360deg);
                  }
                }
              `}</style>
            </div>
          </div>

          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-transparent bg-clip-text">
            Daily Rewards
          </h2>
          <p className="text-indigo-300 text-xs mt-1">
            Log in each day to earn XP
          </p>
        </div>
        <div
          className={`mb-8 transition-all duration-700 delay-100 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex justify-between mb-2">
            <div className="flex items-center text-xs">
              <Trophy size={12} className="text-amber-400 mr-1" />
              <span className="text-indigo-200">
                {currentDay - 1} Day Streak
              </span>
            </div>
            <span className="text-indigo-200 text-xs">
              {(((currentDay - 1) / 7) * 100).toFixed(0)}% Complete
            </span>
          </div>
          <div className="relative h-2 bg-gray-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-50 blur-sm transition-all duration-1000 ease-out"
              style={{ width: `${((currentDay - 1) / 7) * 100}%` }}
            ></div>

            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1500 ease-out"
              style={{ width: `${((currentDay - 1) / 7) * 100}%` }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-full bg-white/20 skew-x-30 animate-shimmer"></div>
                <style jsx>{`
                  @keyframes shimmer {
                    0% {
                      transform: translateX(-100%);
                    }
                    100% {
                      transform: translateX(400%);
                    }
                  }
                  .animate-shimmer {
                    animation: shimmer 3s infinite;
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative mb-8 transition-all duration-700 delay-200 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 transform -translate-y-1/2 z-0"></div>

          <div className="relative flex justify-between items-center">
            {rewards.map((reward, index) => {
              const day = index + 1;
              const claimed = isDayClaimed(day);
              const isToday = day === currentDay;
              const isHovered = hoveredDay === day;

              return (
                <div
                  key={`day-${day}`}
                  className={`flex flex-col items-center m-3 transition-all duration-500 transform cursor-pointer
                    ${
                      animateRewards
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0"
                    }
                    ${isHovered || isToday ? "scale-110" : "scale-100"}
                  `}
                  style={{ transitionDelay: `${200 + index * 80}ms` }}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <div
                    className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300
                      ${
                        claimed
                          ? "bg-gradient-to-br from-green-400 to-emerald-600"
                          : isToday
                          ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
                          : "bg-gray-800 border border-gray-700"
                      }
                      ${
                        isToday && !claimed
                          ? "animate-pulse shadow-lg shadow-purple-500/30"
                          : ""
                      }
                      ${
                        isHovered && !claimed && !isToday
                          ? "shadow-md shadow-indigo-500/20"
                          : ""
                      }
                    `}
                  >
                    {(isToday || claimed) && (
                      <div className="absolute inset-0 rounded-full bg-white/20 filter blur-sm"></div>
                    )}

                    {claimed ? (
                      <Check size={16} className="text-white relative z-10" />
                    ) : (
                      <span className="text-white text-xs font-bold relative z-10">
                        {day}
                      </span>
                    )}
                    {day === 7 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center z-20">
                        <Crown size={8} className="text-yellow-100" />
                      </div>
                    )}
                  </div>

                  <div
                    className={`text-xs font-bold mt-2 transition-all duration-300
                      ${
                        claimed
                          ? "text-green-400"
                          : isToday
                          ? "text-purple-300"
                          : "text-gray-400"
                      }
                      ${isHovered || isToday ? "scale-110" : "scale-100"}
                    `}
                  >
                    {reward.value}
                    <span className="ml-1 text-xs opacity-75">XP</span>
                  </div>
                  {isHovered && (
                    <div className="absolute -top-10 bg-gray-900/90 backdrop-blur-md px-2 py-1 rounded-md border border-gray-700/50 text-xs text-white whitespace-nowrap z-30">
                      {claimed
                        ? "Claimed on Day " + day
                        : isToday
                        ? "Available today!"
                        : day > currentDay
                        ? "Unlock on Day " + day
                        : "Missed reward"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/30 rounded-xl p-4 mb-6 backdrop-blur-sm border border-indigo-500/20 transition-all duration-700 delay-300
            ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-64 h-64 bg-purple-500/5 rounded-full blur-2xl absolute -top-32 -right-32 animate-pulse"></div>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg mr-3 transition-all duration-300
                ${
                  claimedToday
                    ? "bg-green-500/20"
                    : "bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                }`}
              >
                {claimedToday ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Star size={18} className="text-amber-400" />
                )}
              </div>
              <div>
                <h3 className="text-sm text-indigo-100">
                  Day {currentDay} Reward
                </h3>
                <p
                  className={`text-sm font-bold ${
                    claimedToday
                      ? "text-green-400"
                      : "bg-gradient-to-r from-indigo-300 to-purple-300 text-transparent bg-clip-text"
                  }`}
                >
                  {rewards[currentDay - 1].value} XP
                </p>
              </div>
            </div>

            <div className="text-right">
              <div
                className={`text-xs font-semibold
                ${claimedToday ? "text-green-400" : "text-indigo-300"}`}
              >
                {claimedToday ? "Collected" : "Available now"}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative transition-all duration-700 delay-400 transform
            ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          <button
            onClick={handleClaim}
            disabled={claimedToday || claimAnimation}
            className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-all duration-500 relative overflow-hidden ${
              claimedToday
                ? "bg-gray-700 cursor-not-allowed"
                : claimAnimation
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
            }`}
          >
            {!claimedToday && !claimAnimation && (
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute w-32 h-10 bg-white/10 -left-10 top-0 transform rotate-12 translate-x-0 skew-x-12 animate-shine"></div>
                <style jsx>{`
                  @keyframes shine {
                    0% {
                      transform: translateX(-100%) rotate(12deg) skewX(12deg);
                    }
                    100% {
                      transform: translateX(400%) rotate(12deg) skewX(12deg);
                    }
                  }
                  .animate-shine {
                    animation: shine 3s infinite;
                  }
                `}</style>
              </div>
            )}

            {claimAnimation && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent w-10 animate-swipe"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <style jsx>{`
                  @keyframes swipe {
                    0% {
                      transform: translateX(-100%);
                    }
                    100% {
                      transform: translateX(400%);
                    }
                  }
                  .animate-swipe {
                    animation: swipe 1.5s ease-in-out;
                  }
                `}</style>
              </div>
            )}

            <span
              className={`flex items-center justify-center relative z-10 transition-all duration-300 ${
                claimAnimation ? "opacity-0" : "opacity-100"
              }`}
            >
              {claimedToday ? (
                <>
                  <Check size={14} className="mr-1" />
                  Claimed
                </>
              ) : (
                <>
                  <Sparkles size={14} className="mr-1" />
                  Get {rewards[currentDay - 1].value} XP
                </>
              )}
            </span>
          </button>
        </div>

        <div
          className={`mt-5 text-center transform transition-all duration-700 delay-500 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 backdrop-blur-sm border border-amber-500/20">
            <Crown size={12} className="text-amber-400 mr-1" />
            <span className="text-xs text-amber-300">
              Day 7: Epic 500 XP Bonus!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
