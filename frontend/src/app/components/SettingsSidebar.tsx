"use client";

import { FC } from "react";
import { Star, Trophy, ChevronRight, LogOut } from "lucide-react";
import { UserIF } from "@/types/user.types";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  color?: string;
}

interface SettingsSidebarProps {
  user: UserIF;
  menuItems: MenuItem[];
  activeSection: string;
  toggleSection: (id: string) => void;
  handleLogoutUser: () => void;
}

const SettingsSidebar: FC<SettingsSidebarProps> = ({
  user,
  menuItems,
  activeSection,
  toggleSection,
  handleLogoutUser,
}) => {
  return (
    <div className="w-64 border-r border-white/10 bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-4 overflow-y-auto">
      <div className="mb-4 p-3 bg-gradient-to-br from-slate-700/40 to-slate-800/40 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar.image}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-400/50"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-blue-400/50 flex items-center justify-center bg-blue-500/20 text-blue-300 font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}

            {user.membership?.isActive && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 p-0.5 rounded-full">
                <Star className="h-2.5 w-2.5 text-orange-900" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-slate-300 text-xs truncate">{user.email}</p>

            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                Lv.{user.stats.level}
              </span>

              {user.membership?.isActive && (
                <span className="text-xs bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/30 flex items-center">
                  <Trophy className="h-2.5 w-2.5 mr-1" />
                  Pro
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => toggleSection(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 text-blue-200 shadow-lg"
                  : "hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`h-4 w-4 ${
                    activeSection === item.id
                      ? "text-blue-300"
                      : item.color || "text-slate-400"
                  } group-hover:scale-110 transition-transform duration-200`}
                />
                <span className="font-medium text-sm">{item.label}</span>
              </div>

              <ChevronRight
                className={`h-3 w-3 transition-all duration-200 ${
                  activeSection === item.id
                    ? "rotate-90 text-blue-300"
                    : "text-slate-400 group-hover:text-white"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          onClick={handleLogoutUser}
          className="w-full flex items-center space-x-3 p-3 text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-2xl transition-all duration-200 border border-transparent hover:border-red-400/30 group"
        >
          <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsSidebar;
