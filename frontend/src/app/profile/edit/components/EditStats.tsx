import React from "react";
import { Activity } from "lucide-react";
import { UserIF,User } from "@/types/user.types";



type Props = {
  user: User;
  userData: UserIF;
  setUser: (user: User) => void;
};

const EditStats: React.FC<Props> = ({ user, userData, setUser }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
            <Activity size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Account Settings</h2>
            <p className="text-gray-400 text-xs">Security & preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <div>
              <h3 className="font-medium text-white">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-gray-400">Enhanced account security</p>
            </div>
            <div className="relative inline-block w-14 h-7">
              <input
                type="checkbox"
                id="toggle2FA"
                className="absolute w-14 h-7 opacity-0 z-10 cursor-pointer"
                checked={user.twoFactorEnabled}
                onChange={() =>
                  setUser({
                    ...user,
                    twoFactorEnabled: !user.twoFactorEnabled,
                  })
                }
              />
              <label
                htmlFor="toggle2FA"
                className={`block overflow-hidden h-7 rounded-full cursor-pointer transition-all duration-300 ${
                  user.twoFactorEnabled
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                    : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute block w-6 h-6 mt-0.5 rounded-full bg-white transform transition-transform duration-300 ease-in-out shadow-lg ${
                    user.twoFactorEnabled ? "translate-x-7" : "translate-x-0.5"
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all">
            <div>
              <h3 className="font-medium text-white">
                Notifications Preferences
              </h3>
              <p className="text-sm text-gray-400">Updates & challenges</p>
            </div>
            <div className="relative inline-block w-14 h-7">
              <input
                type="checkbox"
                id="toggleNotif"
                className="absolute w-14 h-7 opacity-0 z-10 cursor-pointer"
                checked={user.notifications}
                onChange={() =>
                  setUser({ ...user, notifications: !user.notifications })
                }
              />
              <label
                htmlFor="toggleNotif"
                className={`block overflow-hidden h-7 rounded-full cursor-pointer transition-all duration-300 ${
                  user.notifications
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                    : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute block w-6 h-6 mt-0.5 rounded-full bg-white transform transition-transform duration-300 ease-in-out shadow-lg ${
                    user.notifications ? "translate-x-7" : "translate-x-0.5"
                  }`}
                ></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Account Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Level
            </p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {userData.stats.level}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              XP Points
            </p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {userData.stats.xpPoints}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Streak
            </p>
            <p className="text-2xl font-bold text-orange-400 mt-1">
              {userData.stats.currentStreak}
              <span className="text-sm text-gray-400 ml-1">days</span>
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Domains
            </p>
            <p className="text-2xl font-bold text-green-400 mt-1">
              {userData.completedDomains}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
        <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          Inventory
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-bold text-lg">
                {userData.inventory.ownedAvatars.length}
              </span>
            </div>
            <p className="text-xs text-gray-400">Avatars</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
              <span className="text-purple-400 font-bold text-lg">
                {userData.inventory.ownedBanners.length}
              </span>
            </div>
            <p className="text-xs text-gray-400">Banners</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-lg">
                {userData.inventory.badges.length}
              </span>
            </div>
            <p className="text-xs text-gray-400">Badges</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EditStats;