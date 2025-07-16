"use client";

import React from "react";
import { Award } from "lucide-react";

type LevelData = {
  levelNumber?: number;
  requiredXP?: number;
  description?: string;
};

type LevelFormProps = {
  levelData: LevelData;
  errors: Partial<Record<keyof LevelData, string>>;
  isView: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const LevelFormDetails: React.FC<LevelFormProps> = ({
  levelData,
  errors,
  isView,
  handleInputChange,
}) => {
  return (
    <>
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-800/50 shadow-inner">
        <h3 className="text-indigo-300 font-medium mb-4 flex items-center text-lg">
          <Award className="mr-2 text-indigo-400" size={20} />
          Level Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">Level Number</label>
            <div className="relative">
              <input
                type="number"
                name="levelNumber"
                value={levelData.levelNumber || ""}
                onChange={handleInputChange}
                disabled={isView}
                className={`w-full px-4 py-3 rounded-lg bg-gray-900/80 border ${
                  errors.levelNumber ? "border-red-500" : "border-indigo-600/30"
                } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
                placeholder="Enter level number"
                min={2}
              />
            </div>
            {errors.levelNumber && (
              <p className="mt-1 text-red-400 text-xs">{errors.levelNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 text-sm font-medium">Required XP</label>
            <div className="relative">
              <input
                type="number"
                name="requiredXP"
                value={levelData.requiredXP || ""}
                onChange={handleInputChange}
                disabled={isView}
                className={`w-full px-4 py-3 rounded-lg bg-gray-900/80 border ${
                  errors.requiredXP ? "border-red-500" : "border-indigo-600/30"
                } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all`}
                placeholder="Enter required XP"
                min={0}
              />
            </div>
            {errors.requiredXP && (
              <p className="mt-1 text-red-400 text-xs">{errors.requiredXP}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-800/50 shadow-inner">
        <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={levelData.description || ""}
          onChange={handleInputChange}
          disabled={isView}
          className={`w-full px-4 py-3 rounded-lg bg-gray-900/80 border ${
            errors.description ? "border-red-500" : "border-indigo-600/30"
          } text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all h-24 resize-none`}
          placeholder="Enter level description"
        />
        {errors.description && (
          <p className="mt-1 text-red-400 text-xs">{errors.description}</p>
        )}
      </div>
    </>
  );
};

export default LevelFormDetails;
