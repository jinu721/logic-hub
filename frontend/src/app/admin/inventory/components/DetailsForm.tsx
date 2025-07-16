import React, { ChangeEvent } from "react";
import { Check } from "lucide-react";

interface FormData {
  name: string;
  description: string;
  isActive: boolean;
}

interface Errors {
  name?: string;
  description?: string;
}

interface RarityOption {
  name: string;
  color: string;
}

interface Props {
  formData: FormData;
  errors: Errors;
  rarityOptions: RarityOption[];
  selectedRarity: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setSelectedRarity: (rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary") => void;
}

const DetailsForm: React.FC<Props> = ({
  formData,
  errors,
  rarityOptions,
  selectedRarity,
  handleInputChange,
  setSelectedRarity,
}) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full bg-gray-700 text-white px-3 py-2 rounded-md border ${
            errors.name ? "border-red-500" : "border-gray-600"
          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all shadow-sm`}
          placeholder="Enter item name"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`w-full bg-gray-700 text-white px-3 py-2 rounded-md border ${
            errors.description ? "border-red-500" : "border-gray-600"
          } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all h-24 shadow-sm`}
          placeholder="Describe this item"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Rarity
        </label>
        <div className="flex flex-wrap gap-2">
          {rarityOptions.map((rarity) => (
            <button
              key={rarity.name}
              type="button"
              className={`py-2 px-4 rounded-b-lg h-8 w-35 text-white text-sm font-medium transition-all ${
                selectedRarity === rarity.name
                  ? `${rarity.color} ring-2 ring-white ring-opacity-50 shadow-lg scale-105`
                  : `${rarity.color} opacity-70 hover:opacity-100`
              }`}
              onClick={() => setSelectedRarity(rarity.name as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary")}
            >
              {selectedRarity === rarity.name && (
                <Check size={14} className="inline mr-1" />
              )}
              {rarity.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-start mt-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
          />
          <div className="relative w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-500 peer-focus:ring-1 peer-focus:ring-blue-500 dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm"></div>
          <span className="ml-3 text-sm font-medium text-gray-300">Active</span>
        </label>
      </div>
    </div>
  );
};

export default DetailsForm;
