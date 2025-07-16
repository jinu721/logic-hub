import React from 'react';
import { Gift, Zap, Edit, Trash } from 'lucide-react';
import { LevelIF } from '@/types/level.types';



type LevelsGridProps = {
  levels: LevelIF[];
  getLevelColor: (levelNumber: number) => string;
  handleEditLevel: (level: LevelIF) => void;
  handleDeleteLevel: (id: string) => void;
};

const LevelsGrid: React.FC<LevelsGridProps> = ({
  levels,
  getLevelColor,
  handleEditLevel,
  handleDeleteLevel,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {levels.map((level) => (
        <div
          key={level._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className={`h-full w-full bg-gradient-to-r ${getLevelColor(level.levelNumber)} flex items-center justify-center text-white font-bold`}>
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm flex items-center justify-center">
                <span className="text-3xl font-black">{level.levelNumber}</span>
              </div>
            </div>
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-indigo-500/70 text-indigo-100">
              {level.requiredXP} XP
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1">
              LevelIF {level.levelNumber}
            </h3>

            <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
              {level.description || "No description available"}
            </p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-indigo-400 mb-2">Rewards:</h4>
              <div className="space-y-2">
                {level.rewards && level.rewards.length > 0 ? (
                  level.rewards.slice(0, 2).map((reward, idx) => (
                    <div key={idx} className="flex items-center bg-indigo-900/20 p-2 rounded-lg">
                      <Gift size={14} className="text-indigo-300 mr-2" />
                      <span className="text-gray-300 text-sm line-clamp-1">{reward.rewardDescription}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm italic">No rewards</div>
                )}
                {level.rewards && level.rewards.length > 2 && (
                  <div className="text-indigo-400 text-sm text-center">
                    +{level.rewards.length - 2} more rewards
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-800">
              <div className="flex items-center text-gray-500 text-sm">
                <Zap size={14} className="text-yellow-500 mr-1" />
                <span className="text-yellow-400">{level.requiredXP}</span>
                <span className="ml-1">XP required</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditLevel(level)}
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30"
                >
                  <Edit size={16} className="text-white" />
                </button>
                <button
                  onClick={() => handleDeleteLevel(level._id as string)}
                  className="bg-gray-800 hover:bg-red-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
                >
                  <Trash size={16} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LevelsGrid;
