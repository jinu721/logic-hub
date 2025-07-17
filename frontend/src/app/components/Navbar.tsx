"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Zap,
  Flame,
  MessageSquare,
  Trophy,
  Settings,
  Store,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getMyProfile } from "@/services/client/clientServices";
import SettingsModal from "./Settings";
import NotificationSidebar from "./Notifications";
import useNotifications from "@/hooks/useNotifications";

type User = {
  avatar: {
    name: string;
    image: string;
  };
  userRank: number;
  role: string;
  username: string;
  stats: {
    currentStreak: number;
  };
  membership: {
    isActive: boolean;
  };
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { notifications, unreadCount } = useNotifications();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMyProfile();
        console.log("userData", userData);
        setUser(userData.user);
      } catch (err) {
        console.log("Failed to load user:", err);
      }
    };

    fetchUser();
  }, []);

  const defaultUser: User = {
    avatar: {
      name: "Guest",
      image: "/default-avatar.png",
    },
    username: "Guest",
    role: "user",
    userRank: 0,
    stats: {
      currentStreak: 0,
    },
    membership: {
      isActive: false,
    },
  };

  const currentUser = user || defaultUser;

  return (
    <>
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b border-indigo-500/20 sticky top-0 z-50 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1
              onClick={() => router.push("/home")}
              className="text-xl font-bold cursor-pointer bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              CodeMaze
            </h1>
          </div>

          <div className="flex items-center space-x-5">
            {currentUser.role === "admin" && (
              <Link href="/admin/users">
                <button className="relative cursor-pointer p-2.5 bg-gray-800/70 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:ring-2 hover:ring-indigo-500/40 group">
                  <UserCog
                    size={18}
                    className="text-gray-300 group-hover:text-indigo-300"
                  />
                </button>
              </Link>
            )}
            {pathname !== "/home" ? (
              <div className="flex items-center space-x-3">
                <Link href="/market">
                  <button className="relative cursor-pointer p-2.5 bg-gray-800/70 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:ring-2 hover:ring-indigo-500/40 group">
                    <Store
                      size={18}
                      className="text-gray-300 group-hover:text-indigo-300"
                    />
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-indigo-500 rounded-full border border-gray-900 animate-pulse"></span>
                  </button>
                </Link>
                <button
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative cursor-pointer p-2.5 bg-gray-800/70 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:ring-2 hover:ring-indigo-500/40 group"
                >
                  <Bell
                    size={18}
                    className="text-gray-300 group-hover:text-indigo-300"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-gray-900 animate-pulse"></span>
                  )}
                </button>

                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2.5 cursor-pointer bg-gray-800/70 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:ring-2 hover:ring-indigo-500/40 group"
                >
                  <Settings
                    size={18}
                    className="text-gray-300 group-hover:text-indigo-300"
                  />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/market">
                  <button className="relative cursor-pointer p-2.5 bg-gray-800/70 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:ring-2 hover:ring-indigo-500/40 group">
                    <Store
                      size={18}
                      className="text-gray-300 group-hover:text-indigo-300"
                    />
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-indigo-500 rounded-full border border-gray-900 animate-pulse"></span>
                  </button>
                </Link>
                <Link href="/leaderboard">
                  <button className="p-2.5 cursor-pointer bg-gray-800/70 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:ring-2 hover:ring-indigo-500/40 group">
                    <Trophy
                      size={18}
                      className="text-gray-300 group-hover:text-yellow-300"
                    />
                  </button>
                </Link>

                <Link href="/chat">
                  <button className="relative cursor-pointer p-2.5 bg-gray-800/70 rounded-xl hover:bg-gray-700 transition-all duration-300 hover:ring-2 hover:ring-indigo-500/40 group">
                    <MessageSquare
                      size={18}
                      className="text-gray-300 group-hover:text-indigo-300"
                    />
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-indigo-500 rounded-full border border-gray-900 animate-pulse"></span>
                  </button>
                </Link>
              </div>
            )}

            <div className="flex items-center pl-3 space-x-3 border-l border-gray-700">
              <Link href={"/profile"}>
                <div className="relative group hover:scale-105 transition-all duration-300">
                  {currentUser?.avatar?.image ? (
                    <div className="rounded-full p-0.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500">
                      <img
                        src={currentUser.avatar.image}
                        alt="User avatar"
                        className="h-9 w-9 rounded-full object-cover border-2 border-gray-900"
                      />
                    </div>
                  ) : (
                    <div className="rounded-full p-0.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500">
                      <div className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border-2 border-gray-900">
                        {currentUser.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}

                  {currentUser.membership.isActive && (
                    <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-1 shadow-lg shadow-purple-900/50 group-hover:animate-pulse">
                      <Zap size={10} className="text-white" />
                    </span>
                  )}
                </div>
              </Link>

              <div className="hidden md:block">
                <p className="font-medium text-sm text-white leading-tight">
                  {currentUser.username}
                </p>
                <div className="flex items-center text-xs mt-0.5">
                  <span className="text-indigo-300 font-medium">
                    Rank {currentUser.userRank}
                  </span>
                  <span className="mx-1.5 text-gray-600">•</span>
                  <div className="flex items-center bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full px-1.5 py-0.5">
                    <Flame size={10} className="text-orange-500" />
                    <span className="ml-1 text-orange-300 font-medium">
                      {currentUser.stats.currentStreak}d
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          user={currentUser}
        />
      )}
      {NotificationSidebar && (
        <NotificationSidebar
          data={notifications}
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      )}
    </>
  );
}
