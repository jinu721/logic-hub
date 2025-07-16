import { MarketItemIF } from "@/types/market.types";
import React, { ChangeEvent } from "react";


type ErrorsType = {
  name?: string;
  costXP?: string;
};

type Props = {
  formData: MarketItemIF;
  errors: ErrorsType;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const MarketFormDetails: React.FC<Props> = ({
  formData,
  errors,
  handleInputChange,
  handleCategoryChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Item Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.name ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:outline-none focus:border-indigo-500 text-white`}
          placeholder="Galaxy Avatar"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="col-span-2">
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
          placeholder="Describe this market item..."
        ></textarea>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Item Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
        >
          <option value="avatar">Avatar</option>
          <option value="banner">Banner</option>
          <option value="badge">Badge</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Cost (XP) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            name="costXP"
            value={formData.costXP || ""}
            onChange={handleInputChange}
            min={0}
            step={1}
            className={`w-full px-4 py-2 bg-gray-800 border ${
              errors.costXP ? "border-red-500" : "border-gray-700"
            } rounded-lg focus:outline-none focus:border-indigo-500 text-white`}
            placeholder="500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-400">XP</span>
          </div>
        </div>
        {errors.costXP && (
          <p className="mt-1 text-sm text-red-500">{errors.costXP}</p>
        )}
      </div>
    </div>
  );
};

export default MarketFormDetails;
