import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Award } from "lucide-react"; 


type Props = {
  formData: {
    xpRewards: number;
  };
  setFormData: Dispatch<SetStateAction<{ xpRewards: number }>>;
  errors: {
    xpRewards?: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const ChallengeFormReward: React.FC<Props> = ({
  formData,
  setFormData,
  errors,
  handleInputChange,
}) => {
  const xpLevels = [
    { level: "novice", values: [50, 100, 150], color: "bg-green-500" },
    { level: "adept", values: [200, 300, 400], color: "bg-yellow-500" },
    { level: "master", values: [500, 750, 1000], color: "bg-red-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-gray-300 mb-1 font-medium flex items-center">
          <Award size={16} className="mr-2 text-yellow-400" />
          XP Rewards <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="xpRewards"
          value={formData.xpRewards}
          onChange={handleInputChange}
          min={0}
          className={`w-full bg-gray-800 border ${
            errors.xpRewards ? "border-red-500" : "border-gray-700"
          } rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
          placeholder="XP points for completing the challenge"
        />
        {errors.xpRewards && (
          <p className="text-sm text-red-500 mt-1">{errors.xpRewards}</p>
        )}

        <div className="mt-2">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
            <span>Suggested XP values:</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {xpLevels.map(({ level, values, color }) => (
              <div key={level} className="bg-gray-800 p-2 rounded-lg">
                <div className="text-xs font-medium capitalize mb-1 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${color} mr-1`} />
                  {level}
                </div>

                <div className="flex flex-wrap gap-1">
                  {values.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          xpRewards: value,
                        }))
                      }
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300"
                    >
                      {value} XP
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeFormReward;
