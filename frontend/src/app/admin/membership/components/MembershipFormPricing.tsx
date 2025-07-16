import { MembershipPlanIF } from "@/types/membership.types";
import React from "react";



type Errors = {
  price?: string;
  discountAmount?: string;
  discountDate?: string;
};

type Props = {
  formData: MembershipPlanIF;
  errors: Errors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleDiscountChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  getEffectivePrice: () => number;
  formatDateForInput: (date: string | Date) => string;
};

const MembershipFormPricing: React.FC<Props> = ({
  formData,
  errors,
  handleInputChange,
  handleDiscountChange,
  getEffectivePrice,
  formatDateForInput,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Base Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-400">₹</span>
            </div>
            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full pl-8 pr-4 py-2 bg-gray-800 border ${
                errors.price ? "border-red-500" : "border-gray-700"
              } rounded-lg focus:outline-none focus:border-indigo-500 text-white`}
              placeholder="999.00"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-500">{errors.price}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium text-indigo-400">
            Time-Limited Discount
          </h3>
          <div className="ml-auto">
            <input
              type="checkbox"
              name="active"
              id="discountActive"
              checked={formData.discount.active}
              onChange={handleDiscountChange}
              className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
            />
            <label htmlFor="discountActive" className="ml-2 text-gray-300">
              Apply discount
            </label>
          </div>
        </div>

        {formData.discount.active && (
          <div className="bg-gray-800/70 rounded-lg p-4 border border-indigo-900/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Discount Type
                </label>
                <select
                  name="type"
                  value={formData.discount.type}
                  onChange={handleDiscountChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Discount Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-400">
                      {formData.discount.type === "percentage" ? "%" : "₹"}
                    </span>
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.discount.amount}
                    onChange={handleDiscountChange}
                    min="0"
                    step={
                      formData.discount.type === "percentage" ? "1" : "0.01"
                    }
                    max={
                      formData.discount.type === "percentage" ? "100" : undefined
                    }
                    className={`w-full pl-8 pr-4 py-2 bg-gray-800 border ${
                      errors.discountAmount
                        ? "border-red-500"
                        : "border-gray-700"
                    } rounded-lg focus:outline-none focus:border-indigo-500 text-white`}
                    placeholder={
                      formData.discount.type === "percentage" ? "15" : "250.00"
                    }
                  />
                </div>
                {errors.discountAmount && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.discountAmount}
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formatDateForInput(formData.discount.validUntil)}
                  onChange={handleDiscountChange}
                  min={formatDateForInput(new Date())}
                  className={`w-full px-4 py-2 bg-gray-800 border ${
                    errors.discountDate
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-lg focus:outline-none focus:border-indigo-500 text-white`}
                />
                {errors.discountDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.discountDate}
                  </p>
                )}
              </div>
            </div>

            {parseFloat(formData.price?.toString()) > 0 &&
              parseFloat(formData.discount?.amount?.toString()) > 0 && (
                <div className="mt-4 p-3 bg-indigo-900/30 rounded-lg border border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 text-sm">
                        Effective Price:
                      </span>
                      <span className="ml-2 text-xl font-bold text-white">
                        ₹{getEffectivePrice().toFixed(2)}
                      </span>
                      <span className="ml-2 text-sm line-through text-gray-500">
                        ₹{parseFloat(formData.price.toString()).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-indigo-400 text-sm">
                      {formData.discount.type === "percentage"
                        ? `${formData.discount.amount}% off`
                        : `₹${parseFloat(formData.discount.amount.toString()).toFixed(2)} off`}
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipFormPricing;
