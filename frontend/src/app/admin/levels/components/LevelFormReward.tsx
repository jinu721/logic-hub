import React, { ChangeEvent } from "react";
import {
  Gift,
  Badge,
  Image,
  Flag,
  Search,
  CheckCircle2,
  Trash,
} from "lucide-react";
import { InventoryIF } from "@/types/inventory.types";

type RewardType = "avatar" | "banner" | "badge";

interface LevelReward {
  type: RewardType;
  rewardId: string;
  rewardDescription: string;
}

interface LevelData {
  levelNumber: number;
  requiredXP: number;
  description: string;
  rewards: LevelReward[];
}

interface Props {
  levelData: LevelData;
  isView: boolean;
  selectedRewardType: RewardType;
  setSelectedRewardType: (type: RewardType) => void;
  showRewardSelector: boolean;
  setShowRewardSelector: (show: boolean) => void;
  rewardSearch: string;
  setRewardSearch: (search: string) => void;
  filteredRewards: LevelReward[];
  isRewardSelected: (reward: InventoryIF) => boolean;
  addReward: (reward: InventoryIF) => void;
  removeReward: (id: string) => void;
  REWARD_TYPES: { [key: string]: RewardType };
  renderRewardIcon: (type: RewardType) => React.ReactNode;
}

const LevelFormReward: React.FC<Props> = ({
  levelData,
  isView,
  selectedRewardType,
  setSelectedRewardType,
  showRewardSelector,
  setShowRewardSelector,
  rewardSearch,
  setRewardSearch,
  filteredRewards,
  isRewardSelected,
  addReward,
  removeReward,
  REWARD_TYPES,
  renderRewardIcon,
}) => {
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-800/50 shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-indigo-300 font-medium flex items-center text-lg">
          <Gift className="mr-2 text-indigo-400" size={20} />
          Level Rewards
        </h3>
        <div className="px-3 py-1 bg-indigo-900/40 rounded-full text-xs font-medium text-indigo-300 border border-indigo-800/50">
          {levelData.rewards?.length || 0} reward
          {levelData.rewards?.length !== 1 ? "s" : ""}
        </div>
      </div>

      {!isView && (
        <>
          <div className="mb-4 bg-gray-900/50 rounded-xl p-1 border border-gray-800">
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedRewardType(REWARD_TYPES.BADGE);
                  setShowRewardSelector(true);
                }}
                className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedRewardType === REWARD_TYPES.BADGE
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/50"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Badge size={18} className="mr-2" />
                Badges
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRewardType(REWARD_TYPES.AVATAR);
                  setShowRewardSelector(true);
                }}
                className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedRewardType === REWARD_TYPES.AVATAR
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/50"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Image size={18} className="mr-2" />
                Avatars
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRewardType(REWARD_TYPES.BANNER);
                  setShowRewardSelector(true);
                }}
                className={`flex items-center justify-center py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                  selectedRewardType === REWARD_TYPES.BANNER
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-900/50"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Flag size={18} className="mr-2" />
                Banners
              </button>
            </div>
          </div>

          {showRewardSelector && (
            <div className="bg-gray-900/70 rounded-xl border border-gray-800/80 p-4 mb-4 shadow-xl animate-fadeIn">
              <div className="flex items-center bg-gray-800/50 border border-gray-700/50 rounded-lg mb-3 overflow-hidden">
                <Search size={18} className="ml-3 text-gray-500" />
                <input
                  type="text"
                  value={rewardSearch}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRewardSearch(e.target.value)
                  }
                  className="flex-grow px-3 py-2 bg-transparent text-white focus:outline-none placeholder-gray-500"
                  placeholder={`Search ${selectedRewardType}s...`}
                />
              </div>

              <div className="max-h-56 overflow-y-auto pr-2 overflow-x-hidden">
                {filteredRewards.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredRewards.map((reward) => {
                      const isSelected = isRewardSelected(reward);
                      return (
                        <div
                          key={reward._id}
                          onClick={() => !isSelected && addReward(reward)}
                          className={`group flex flex-col items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-900/30"
                              : "border-gray-700/50 hover:border-indigo-500/50 hover:bg-gray-800/70"
                          }`}
                        >
                          <div className="relative w-16 h-16 bg-gray-800/80 rounded-lg overflow-hidden mb-2 flex items-center justify-center border border-gray-700/50 group-hover:border-indigo-500/50 transition-all">
                            {reward.image ? (
                              <img
                                src={reward.image}
                                alt={reward.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              renderRewardIcon(selectedRewardType)
                            )}
                            {isSelected && (
                              <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center">
                                <CheckCircle2
                                  className="text-white"
                                  size={24}
                                />
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <div
                              className={`font-medium truncate text-sm ${
                                isSelected ? "text-indigo-300" : "text-white"
                              }`}
                            >
                              {reward.name}
                            </div>
                            {reward.description && (
                              <div className="text-gray-400 text-xs truncate mt-1 max-w-full">
                                {reward.description.length > 20
                                  ? `${reward.description.substring(0, 20)}...`
                                  : reward.description}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500 bg-gray-800/30 rounded-lg border border-gray-800/50">
                    {rewardSearch
                      ? `No ${selectedRewardType}s found matching "${rewardSearch}"`
                      : `No ${selectedRewardType}s available`}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div
        className="bg-gray-900/70 rounded-xl border border-gray-800/80 overflow-y-auto divide-y divide-gray-800/50 shadow-inner"
        style={{ maxHeight: "320px" }}
      >
        {levelData.rewards && levelData.rewards.length > 0 ? (
          levelData.rewards.map((reward) => (
            <div
              key={reward.rewardId}
              className="flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700/50">
                  {renderRewardIcon(reward.type)}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {reward.rewardDescription}
                  </div>
                  <div className="text-xs mt-1"></div>
                </div>
              </div>
              {!isView && (
                <button
                  type="button"
                  onClick={() => removeReward(reward.rewardId)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash size={18} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 text-gray-500 text-center flex flex-col items-center justify-center">
            <Gift size={32} className="mb-2 text-gray-600" />
            <p>No rewards added yet</p>
            {!isView && (
              <p className="text-xs mt-1 text-gray-600">
                Select rewards from the options above
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelFormReward;
