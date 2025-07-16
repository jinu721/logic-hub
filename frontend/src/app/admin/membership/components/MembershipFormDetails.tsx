import { MembershipPlanIF } from "@/types/membership.types";
import React from "react";


type Errors = {
  name?: string;
};

type Props = {
  formData: MembershipPlanIF;
  errors: Errors;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

const MembershipFormDetails: React.FC<Props> = ({ formData, errors, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Plan Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 bg-gray-800 border ${
            errors.name ? "border-red-500" : "border-gray-700"
          } rounded-lg focus:outline-none focus:border-indigo-500 text-white`}
          placeholder="Premium Plan"
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
          placeholder="Describe what's included in this plan..."
        ></textarea>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Billing Type
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
        >
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Status
        </label>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive || false}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="ml-2 text-gray-300">
            Active plan (available for purchase)
          </label>
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-300">
          Featured Plan
        </label>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            checked={formData.isFeatured || false}
            onChange={handleInputChange}
            className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isFeatured" className="ml-2 text-gray-300">
            Highlight this plan as featured
          </label>
        </div>
      </div>
    </div>
  );
};

export default MembershipFormDetails;
