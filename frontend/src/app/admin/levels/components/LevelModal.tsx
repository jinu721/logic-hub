"use client";

import React, { useState, useEffect, useMemo, ChangeEvent, FormEvent } from "react";
import { 
  X,  Gift, Star, 
  Image, Flag, Badge
} from "lucide-react";
import LevelFormDetails from "./LevelFormDetails";
import LevelRewards from "./LevelFormReward";
import { InventoryIF } from "@/types/inventory.types";

type RewardType = "avatar" | "banner" | "badge";


interface LevelReward {
  rewardId: string;
  type: RewardType;
  name: string;
  rewardDescription: string;
}

interface LevelData {
  levelNumber: number;
  requiredXP: number;
  description: string;
  rewards: LevelReward[];
}

interface LevelModalProps {
  level?: LevelData & { _id?: string };
  onSave: (data: LevelData, id?: string) => void;
  onClose: () => void;
  isView?: boolean;
  avatars?: InventoryIF[];
  banners?: InventoryIF[];
  badges?: InventoryIF[];
}

interface Errors {
  levelNumber?: string;
  requiredXP?: string;
  description?: string;
}

const REWARD_TYPES:Record<string, RewardType> = {
  AVATAR: "avatar",
  BANNER: "banner",
  BADGE: "badge",
};

const LevelModal: React.FC<LevelModalProps> = ({
  level,
  onSave,
  onClose,
  isView = false,
  avatars = [],
  banners = [],
  badges = [],
}) => {
  const [levelData, setLevelData] = useState<LevelData>({
    levelNumber: 2,
    requiredXP: 100,
    description: "",
    rewards: [],
  });

  const [rewardSearch, setRewardSearch] = useState<string>("");
  const [selectedRewardType, setSelectedRewardType] = useState<RewardType>("badge");
  const [showRewardSelector, setShowRewardSelector] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (level) {
      setLevelData({
        levelNumber: level.levelNumber,
        requiredXP: level.requiredXP,
        description: level.description,
        rewards: level.rewards || [],
      });
    }
  }, [level]);

  const rewardCollections = useMemo(() => ({
    avatar: avatars,
    banner: banners,
    badge: badges,
  }), [avatars, banners, badges]);

  const filteredRewards = useMemo(() => {
    const collection = rewardCollections[selectedRewardType] || [];
    return collection.filter(reward =>
      reward.name?.toLowerCase().includes(rewardSearch.toLowerCase()) ||
      reward.description?.toLowerCase().includes(rewardSearch.toLowerCase())
    );
  }, [rewardSearch, rewardCollections, selectedRewardType]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!levelData.levelNumber) newErrors.levelNumber = "Level number is required";
    if (!levelData.requiredXP) newErrors.requiredXP = "Required XP is required";
    if (!levelData.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLevelData(prev => ({
      ...prev,
      [name]: name === "levelNumber" || name === "requiredXP" ? Number(value) : value,
    }));
    validateForm();
  };

  const addReward = (reward: InventoryIF) => {
    const isAlreadyAdded = levelData.rewards.some(r => r.rewardId === reward._id);
    if (!isAlreadyAdded) {
      const newReward: LevelReward = {
        type: selectedRewardType,
        name: reward.name,
        rewardId: reward._id as string,
        rewardDescription: `${selectedRewardType.charAt(0).toUpperCase() + selectedRewardType.slice(1)}: ${reward.name}`,
      };
      setLevelData(prev => ({
        ...prev,
        rewards: [...prev.rewards, newReward],
      }));
    }
  };

  const removeReward = (rewardId: string) => {
    setLevelData(prev => ({
      ...prev,
      rewards: prev.rewards.filter(reward => reward.rewardId !== rewardId),
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(levelData, level?._id);
    }
  };

  const renderRewardIcon = (type: RewardType) => {
    switch (type) {
      case "avatar":
        return <Image className="text-blue-400" />;
      case "banner":
        return <Flag className="text-green-400" />;
      case "badge":
        return <Badge className="text-purple-400" />;
      default:
        return <Gift className="text-indigo-400" />;
    }
  };

  const isRewardSelected = (reward: InventoryIF) => {
    return levelData.rewards.some(r => r.rewardId === reward._id);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl border border-indigo-500/30 my-8 animate-fadeIn">
        <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/80 to-indigo-900/80 p-6 border-b border-indigo-800/50 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Star className="text-yellow-400 mr-3" />
              {isView ? "Level Details" : level ? "Edit Level" : "Add New Level"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800/50 transition-all duration-200 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <LevelFormDetails 
            levelData={levelData}
            errors={errors}
            isView={isView}
            handleInputChange={handleInputChange}
          />

          <LevelRewards 
            levelData={levelData}
            isView={isView}
            selectedRewardType={selectedRewardType}
            setSelectedRewardType={setSelectedRewardType}
            showRewardSelector={showRewardSelector}
            setShowRewardSelector={setShowRewardSelector}
            rewardSearch={rewardSearch}
            setRewardSearch={setRewardSearch}
            filteredRewards={filteredRewards as any}
            isRewardSelected={isRewardSelected}
            addReward={addReward}
            removeReward={removeReward}
            REWARD_TYPES={REWARD_TYPES}
            renderRewardIcon={renderRewardIcon}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            {!isView && (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-200 shadow-lg shadow-indigo-900/30 font-medium"
              >
                {level ? "Update Level" : "Create Level"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LevelModal;
