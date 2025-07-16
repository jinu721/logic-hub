import React from 'react';
import { Gift, Zap, Edit, Trash } from 'lucide-react';
import { LevelIF } from '@/types/level.types';

type LevelsListProps = {
  levels: LevelIF[];
  getLevelColor: (levelNumber: number) => string;
  handleEditLevel: (level: LevelIF) => void;
  handleDeleteLevel: (id: string) => void;
};

const LevelsList: React.FC<LevelsListProps> = ({
  levels,
  getLevelColor,
  handleEditLevel,
  handleDeleteLevel,
}) => {
  return (
    <div className="space-y-4">
      {levels.map((level) => (
        <div
          key={level._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className={`h-12 w-12 bg-gradient-to-r ${getLevelColor(level.levelNumber)} rounded-lg flex items-center justify-center mr-4 font-bold text-white`}>
            {level.levelNumber}
          </div>

          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                LevelIF {level.levelNumber}
              </h3>
              <div className="ml-2 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-md text-xs flex items-center">
                <Zap size={10} className="mr-1" />
                {level.requiredXP} XP
              </div>
            </div>
            <p className="text-gray-400 text-sm line-clamp-1">
              {level.description || "No description available"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {level.rewards && level.rewards.length > 0 && (
              <div className="bg-gray-800 px-3 py-1 rounded-lg text-xs flex items-center">
                <Gift size={12} className="text-indigo-400 mr-1" />
                <span className="text-gray-300">{level.rewards.length} rewards</span>
              </div>
            )}

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
      ))}
    </div>
  );
};

export default LevelsList;
