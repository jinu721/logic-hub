'use client';

import { Crown, Sparkles, Briefcase, RefreshCw, PlusCircle, Key, Shield, Award, ChevronRight, User, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserIF } from '@/types/user.types';
import { LevelIF } from '@/types/level.types';





interface Props {
  userData: UserIF;
  currentUser: boolean;
  xpProgress: number;
  xpLeft: number;
  nextLevel: LevelIF | null;
}

export default function UserStats({
  userData,
  currentUser,
  xpProgress,
  xpLeft,
  nextLevel
}: Props) {
  return (
    <div className="lg:col-span-4 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="p-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {userData.stats.level}
                </span>
              </div>
              {userData.membership && userData.membership.isActive && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Crown size={12} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={16} />
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-blue-400">
                  Escaper Level
                </h2>
              </div>
              {userData.membership && userData.membership.isActive && (
                <p className="text-gray-400 text-sm">Premium Member</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Level Progress</span>
              <span className="text-indigo-300 font-medium">
                {userData.stats.totalXpPoints} TXP
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div
                  className="bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-600 h-3 rounded-full relative"
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 bg-blue-500 text-xs text-white px-2 py-0.5 rounded-full">
                {xpProgress}%
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400 flex justify-between">
              <span>{userData.stats.xpPoints} XP</span>
              <span className="text-indigo-300">
                {nextLevel
                  ? `${xpLeft} XP to Level ${userData.stats.level + 1}`
                  : 'Max Level Reached'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 shadow-xl bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl" />

        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="text-amber-400" size={18} />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
                Digital Assets
              </span>
            </h2>
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-300 hover:text-amber-200 p-0"
              >
                <RefreshCw
                  size={14}
                  className="hover:rotate-90 transition-transform duration-500"
                />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentUser && (
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20 group hover:border-yellow-500/40 transition-all duration-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Keys</span>
                  <PlusCircle
                    size={14}
                    className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-yellow-500" />
                  <span className="text-2xl font-bold text-yellow-400">
                    {userData.inventory.keys}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-indigo-500/20 group hover:border-indigo-500/40 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Badges</span>
                {currentUser && (
                  <Shield
                    size={14}
                    className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-indigo-500" />
                <span className="text-2xl font-bold text-indigo-400">
                  {userData.inventory.badges.length}
                </span>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 group hover:border-purple-500/40 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Avatars</span>
                {currentUser && (
                  <ChevronRight
                    size={14}
                    className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-purple-500" />
                <span className="text-2xl font-bold text-purple-400">
                  {userData.inventory.ownedAvatars?.length || 0}
                </span>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20 group hover:border-blue-500/40 transition-all duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Banners</span>
                {currentUser && (
                  <ChevronRight
                    size={14}
                    className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-400">
                  {userData.inventory.ownedBanners?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {currentUser && (
            <button className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 py-3 rounded-lg transition-all duration-300 font-semibold group shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2">
              <ShoppingCart
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
              <span>Black Market</span>
              <ChevronRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
