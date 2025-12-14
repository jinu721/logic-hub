import {
  Flame,
  Award,
  Trophy,
  Edit,
  Star,
  MessageCircle,
  Flag,
} from "lucide-react";
import { UserIF } from "@/types/user.types";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  userData: UserIF;
  currentUser: boolean;
  onlineStatus: boolean;
  handleMessage: (id: string) => void;
  getRankCrown: (rank: number) => React.ReactNode;
  showAnimation: boolean;
  setReportPopupOpen: (open: boolean) => void;
}

const ProfileHeader: React.FC<Props> = ({
  userData,
  currentUser,
  onlineStatus,
  handleMessage,
  getRankCrown,
  showAnimation,
  setReportPopupOpen,
}) => {
  const [expandedBio, setExpandedBio] = useState(false);
  const router = useRouter();
  const truncateText = (text: string, maxLength: number = 80) => {
    if (!text) return text;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="relative h-64 sm:h-60 md:h-70 lg:h-80 overflow-hidden group">
      <div className="absolute inset-0 transform transition-all duration-1000 ease-out group-hover:scale-105 origin-center overflow-hidden">
        {userData.banner ? (
          <img
            src={userData.banner.image}
            alt={userData.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 animate-gradient-slow flex items-center justify-center">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-grid-white/10"></div>
            </div>
            <span className="text-2xl text-white font-bold tracking-wider opacity-40">
              New Escaper
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-transparent backdrop-blur-[3px] group-hover:backdrop-blur-[0px] transition-all duration-700" />

      <div className="absolute bottom-0 left-0 w-full p-5 md:p-6 lg:p-8">
        <div
          className={`flex flex-col sm:flex-row items-center sm:items-end gap-6 max-w-7xl mx-auto transition-all duration-1000 ${
            showAnimation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative mb-3 sm:mb-0 group/avatar flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-xl opacity-50 group-hover/avatar:opacity-70 transition-opacity duration-700"></div>
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 group-hover/avatar:scale-105 group-hover/avatar:rotate-3 transition-all duration-700 ease-out z-10">
              {userData.membership?.isActive ? (
                <div className="w-full h-full rounded-full p-[3px] bg-gradient-to-br from-yellow-600 via-yellow-800 to-yellow-600 shadow-xl shadow-yellow-500/40">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar.image}
                        alt={userData.username}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-4xl rounded-full">
                        {userData.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full rounded-full border-4 border-indigo-500/80 overflow-hidden shadow-xl shadow-indigo-600/40 group-hover/avatar:border-indigo-400">
                  <div className="w-full h-full overflow-hidden rounded-full">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar.image}
                        alt={userData.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-4xl">
                        {userData.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -bottom-3 -right-3 z-20 transform hover:scale-110 transition-all duration-500 group/rank">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-50 scale-110 group-hover/rank:opacity-80 group-hover/rank:scale-125 transition-all duration-500"></div>
              {getRankCrown(userData.userRank)}
              <div className="absolute top-0 left-0 w-full h-full rounded-full border border-indigo-400/30 animate-ping-slow"></div>
            </div>
          </div>

          <div className="text-center sm:text-left flex-1 transform transition-all duration-500 hover:translate-x-1 group/info z-10 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap mb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-purple-100 hover:from-indigo-100 hover:via-white hover:to-indigo-200 transition-all duration-500 group-hover/info:scale-105 origin-left tracking-wide">
                {userData.username}
              </h1>

              <div className="flex items-center gap-2">
                {onlineStatus && (
                  <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-full p-1.5 hover:from-green-500 hover:to-green-400 transition-all duration-300 hover:scale-110 relative"></div>
                )}
              </div>
            </div>

            {userData.bio && (
              <div className="mb-3">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {expandedBio ? userData.bio : truncateText(userData.bio)}
                  {userData.bio.length > 80 && (
                    <button
                      onClick={() => setExpandedBio(!expandedBio)}
                      className="ml-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors duration-300 focus:outline-none"
                    >
                      {expandedBio ? "Show less" : "Show more"}
                    </button>
                  )}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 sm:gap-6 justify-center sm:justify-start flex-wrap">
              <div className="flex items-center gap-2 hover:text-orange-300 transition-colors cursor-pointer hover:scale-105 transform duration-300 group/streak">
                <div className="relative">
                  <Flame
                    size={16}
                    className="text-orange-500 group-hover/streak:animate-flame"
                  />
                  <div className="absolute -inset-1 bg-orange-500/20 rounded-full blur-sm opacity-0 group-hover/streak:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-400 group-hover/streak:text-orange-300 transition-colors duration-300">
                    Current
                  </span>
                  <span className="font-bold text-sm text-white group-hover/streak:text-orange-200 transition-colors duration-300">
                    {userData.stats.currentStreak} Days
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 hover:text-red-300 transition-colors cursor-pointer hover:scale-105 transform duration-300 group/longest">
                <div className="relative">
                  <Award
                    size={16}
                    className="text-red-500 group-hover/longest:animate-pulse"
                  />
                  <div className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm opacity-0 group-hover/longest:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-400 group-hover/longest:text-red-300 transition-colors duration-300">
                    Longest
                  </span>
                  <span className="font-bold text-sm text-white group-hover/longest:text-red-200 transition-colors duration-300">
                    {userData.stats.longestStreak} Days
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 hover:text-amber-300 transition-colors cursor-pointer hover:scale-105 transform duration-300 group/domains">
                <div className="relative">
                  <Trophy
                    size={16}
                    className="text-amber-500 group-hover/domains:animate-bounce"
                  />
                  <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur-sm opacity-0 group-hover/domains:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wider text-gray-400 group-hover/domains:text-amber-300 transition-colors duration-300">
                    Domains
                  </span>
                  <span className="font-bold text-sm text-white group-hover/domains:text-amber-200 transition-colors duration-300">
                    {userData.completedDomains}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col gap-2 mt-4 sm:mt-0 z-10 flex-shrink-0">
            {currentUser ? (
              <button
                onClick={() => router.push("/profile/edit")}
                className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-500 font-medium shadow-lg shadow-indigo-700/30 hover:shadow-indigo-600/50 hover:scale-105 hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transform active:scale-95 group/edit cursor-pointer text-sm"
              >
                <Edit
                  size={14}
                  className="text-indigo-200 group-hover/edit:rotate-12 transition-transform duration-300"
                />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleMessage(userData.userId)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-500 font-medium shadow-lg shadow-blue-700/30 hover:shadow-blue-600/50 hover:scale-105 hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transform active:scale-95 group/message cursor-pointer text-sm"
                >
                  <MessageCircle
                    size={14}
                    className="text-blue-200 group-hover/message:rotate-12 transition-transform duration-300"
                  />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => setReportPopupOpen(true)}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-500 shadow-lg shadow-gray-900/30 hover:shadow-gray-800/50 hover:scale-105 hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-30 transform active:scale-95 group/report cursor-pointer text-sm"
                  aria-label="Report user"
                >
                  <Flag
                    size={14}
                    className="text-gray-300 group-hover/report:text-red-400 transition-colors duration-300"
                  />
                  <span>Report</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
