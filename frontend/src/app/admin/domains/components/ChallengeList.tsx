import React from "react";
import { Clock, Award, Edit, Trash, Code } from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";

type Props = {
  challenges: ChallengeDomainIF[];
  typeIcons: { [key: string]: React.ReactNode };
  difficultyColors: { [key: string]: string };
  handleEditChallenge: (challenge: ChallengeDomainIF) => void;
  handleDeleteChallenge: (id: string) => void;
};

const ChallengeList: React.FC<Props> = ({
  challenges,
  typeIcons,
  difficultyColors,
  handleEditChallenge,
  handleDeleteChallenge,
}) => {
  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <div
          key={challenge._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
            {typeIcons[challenge.type] || <Code size={20} />}
          </div>

          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {challenge.title}
              </h3>
              {challenge.isPremium && (
                <div className="ml-2 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-md text-xs flex items-center">
                  <Award size={10} className="mr-1" />
                  Premium
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm line-clamp-1">
              {challenge.description || "No description available"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-md text-xs">
              <Clock size={12} className="text-gray-400" />
              <span className="text-gray-300">{challenge.timeLimit || "30"} min</span>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                difficultyColors[challenge.level] || "bg-blue-500/70 text-blue-100"
              }`}
            >
              {challenge.level}
            </div>

            <div className="text-gray-500 text-sm">
              XP: <span className="text-indigo-400">{challenge?.xpRewards || "100"}</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditChallenge(challenge)}
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30"
              >
                <Edit size={16} className="text-white" />
              </button>
              <button
                onClick={() => handleDeleteChallenge(challenge._id as string)}
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

export default ChallengeList;
