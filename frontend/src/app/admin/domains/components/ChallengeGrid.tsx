import React from "react";
import { Clock, Award, Edit, Trash } from "lucide-react"; 
import { ChallengeDomainIF } from "@/types/domain.types";


interface ChallengeGridProps {
  challenges: ChallengeDomainIF[];
  handleEditChallenge: (challenge: ChallengeDomainIF) => void;
  handleDeleteChallenge: (id: string) => void;
  typeIcons: { [key: string]: React.ReactNode };
  difficultyColors: { [key: string]: string };
}

const ChallengeGrid: React.FC<ChallengeGridProps> = ({
  challenges,
  handleEditChallenge,
  handleDeleteChallenge,
  typeIcons,
  difficultyColors,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {challenges.map((challenge) => (
        <div
          key={challenge._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                {typeIcons[challenge.type]}
              </div>
            </div>
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                difficultyColors[challenge.level]
              }`}
            >
              {challenge.level}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1">
              {challenge.title}
            </h3>

            <div className="flex mb-3">
              <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-md text-xs">
                <Clock size={12} className="text-gray-400" />
                <span className="text-gray-300">
                  {challenge.timeLimit || 30} min
                </span>
              </div>
              {challenge.isPremium && (
                <div className="ml-2 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md text-xs flex items-center">
                  <Award size={12} className="mr-1" />
                  Premium
                </div>
              )}
            </div>

            <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
              {challenge.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {challenge.tags &&
                challenge.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-900/30 text-indigo-300 text-xs px-2 py-1 rounded-md"
                  >
                    {tag.trim()}
                  </span>
                ))}
              {challenge.tags && challenge.tags.length > 3 && (
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-md">
                  +{challenge.tags.length - 3}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-800">
              <div className="text-gray-500 text-sm">
                XP:{" "}
                <span className="text-indigo-400">{challenge.xpRewards}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditChallenge(challenge)}
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30"
                >
                  <Edit size={16} className="text-white" />
                </button>
                <button
                  onClick={() => handleDeleteChallenge(challenge?._id as string)}
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

export default ChallengeGrid;
