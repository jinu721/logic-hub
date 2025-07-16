'use client';

import React from 'react';
import { Award, ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { UserIF } from '@/types/user.types';



interface Props {
  userData: UserIF;
  currentUser: boolean;
}

export default function AchievementShowcase({ userData, currentUser }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/40 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-32 -left-16 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-600/10 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="p-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-3 group perspective">
            <div className="relative transform transition-all duration-300 group-hover:rotate-y-12 group-hover:scale-110">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <Award className="relative z-10 text-white" size={24} />
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 font-extrabold tracking-tight">
              Achievement Showcase
            </span>
          </h2>

          {currentUser && (
            <button className="relative overflow-hidden text-sm font-medium text-purple-300 flex items-center gap-2 group px-4 py-2 rounded-full border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
              <span className="relative z-10">View Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ArrowRight
                size={14}
                className="relative z-10 group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userData.inventory.badges.map((badge, idx) => (
            <div
              key={badge._id}
              className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-800/80 to-gray-700/50 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              </div>

              <div className="p-5 flex gap-5">
                <div className="relative perspective">
                  <div className="w-16 h-16 rounded-lg transform transition-transform duration-700 group-hover:rotate-y-180 preserve-3d">
                    <div className="absolute inset-0 backface-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-500"></div>
                      <img
                        src={badge.image}
                        alt={badge.name}
                        className="w-full h-full object-cover rounded-lg relative z-10"
                      />
                    </div>
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                      <div className="h-full w-full rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-600/30 flex items-center justify-center">
                        <Star className="text-purple-300" size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-70 blur-lg transition-opacity duration-1000"></div>
                </div>

                <div className="flex-1 relative">
                  <h3 className="font-bold text-gray-100 text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-indigo-200 transition-all duration-500">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1.5 group-hover:text-gray-300 transition-colors duration-500">
                    {badge.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-900/70 to-indigo-900/70 border border-purple-500/30 text-purple-300 rounded-full flex items-center gap-1">
                      <Sparkles size={10} className="text-purple-300" />
                      <span>{badge.rarity}</span>
                    </span>
                    <span className="text-xs px-3 py-1 bg-gray-800/80 border border-gray-700 text-gray-400 rounded-full">
                      Earned {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
            </div>
          ))}

          {userData.inventory.badges.length === 0 && (currentUser ? (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-indigo-500/30 bg-gradient-to-br from-gray-800/70 to-gray-700/40 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-500 group col-span-full cursor-pointer transform hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

              <div className="p-10 flex flex-col items-center justify-center text-center h-full">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-900/50 to-indigo-700/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-700 relative z-10">
                    <Award size={36} className="text-indigo-300 group-hover:text-indigo-200 transition-colors duration-500" />
                  </div>
                </div>

                <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300 mb-3 text-2xl">
                  Start Your Collection
                </h3>
                <p className="text-gray-400 max-w-md group-hover:text-gray-300 transition-colors duration-500">
                  Complete challenges and missions to earn your first achievement badges
                </p>

                <button className="mt-7 relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-7 py-2.5 rounded-xl text-white font-medium flex items-center gap-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Zap size={16} className="animate-pulse" />
                  <span>Find Challenges</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-500/20 bg-gradient-to-br from-gray-800/70 to-gray-700/40 backdrop-blur-sm col-span-full">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-gray-700/10 rounded-full blur-3xl opacity-50"></div>
              <div className="p-10 flex flex-col items-center justify-center text-center h-full">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center mb-5">
                    <Award size={36} className="text-gray-500 opacity-50" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-400 mb-3 text-2xl">No Badges Yet</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  This user hasn`t earned any achievement badges yet
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(-100%); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-12 {
          transform: rotateY(12deg);
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
