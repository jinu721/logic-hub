import React from "react";
import { Plus, Trash, CheckCircle, Check } from "lucide-react";

type Props = {
  formData: {
    features: string[];
  };
  customFeature: string;
  setCustomFeature: (value: string) => void;
  addFeature: () => void;
  removeFeature: (feature: string) => void;
  availableFeatures?: string[];
  toggleFeature: (feature: string) => void;
};

const MembershipFormFeatures: React.FC<Props> = ({
  formData,
  customFeature,
  setCustomFeature,
  addFeature,
  removeFeature,
  availableFeatures,
  toggleFeature,
}) => {
  return (
    <div>
      <div className="mb-6">
        <label className="block mb-3 text-base font-medium text-gray-300">
          Plan Features
        </label>

        <div className="flex mb-4">
          <input
            type="text"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-indigo-500 text-white"
            placeholder="Add custom feature..."
          />
          <button
            type="button"
            onClick={addFeature}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Current Plan Features ({formData.features.length})
          </h4>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            {formData.features.length > 0 ? (
              <ul className="space-y-2">
                {formData.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-white">{feature}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="p-1 hover:bg-red-900/40 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-2">
                No features added to this plan
              </p>
            )}
          </div>
        </div>

        {availableFeatures?.length && availableFeatures.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">
              Available Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {availableFeatures?.map((feature, index) => {
                const isSelected = formData.features.includes(feature);
                return (
                  <div
                    key={index}
                    onClick={() => toggleFeature(feature)}
                    className={`p-2 rounded-lg cursor-pointer flex items-center transition-colors ${
                      isSelected
                        ? "bg-indigo-600/30 border border-indigo-500/50"
                        : "bg-gray-800/50 border border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mr-2 rounded-sm flex items-center justify-center ${
                        isSelected
                          ? "bg-indigo-500"
                          : "border border-gray-600"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-white text-sm">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipFormFeatures;
