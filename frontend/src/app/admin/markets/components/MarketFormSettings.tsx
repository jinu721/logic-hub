import React from "react";
import { Clock } from "lucide-react";
import { MarketItemIF } from "@/types/market.types";


type ErrorsType = {
  expiresAt?: string;
};

type ItemType = {
  image: string;
};

type Props = {
  formData: MarketItemIF;
  errors: ErrorsType;
  selectedItem?: ItemType | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatDateForInput: (date: string | Date) => string;
};

const MarketFormSettings: React.FC<Props> = ({
  formData,
  errors,
  selectedItem,
  handleInputChange,
  formatDateForInput,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-base font-medium text-gray-300 mb-4">Availability Settings</h3>

          <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="available"
                id="available"
                checked={formData.available}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
              />
              <label htmlFor="available" className="ml-2 text-gray-300">
                Available for purchase
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isExclusive"
                id="isExclusive"
                checked={formData.isExclusive}
                onChange={handleInputChange}
                className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
              />
              <label htmlFor="isExclusive" className="ml-2 text-gray-300">
                Exclusive item
              </label>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="limitedTime"
                  id="limitedTime"
                  checked={formData.limitedTime}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
                />
                <label htmlFor="limitedTime" className="ml-2 text-gray-300">
                  Limited time offer
                </label>
              </div>

              {formData.limitedTime && (
                <div className="ml-6 mt-2">
                  <label className="block mb-1 text-sm font-medium text-gray-400">
                    Expires on <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formatDateForInput(formData.expiresAt || "")}
                    onChange={handleInputChange}
                    min={formatDateForInput(new Date())}
                    className={`w-full px-4 py-2 bg-gray-800 border ${
                      errors.expiresAt ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:border-indigo-500 text-white`}
                  />
                  {errors.expiresAt && (
                    <p className="mt-1 text-sm text-red-500">{errors.expiresAt}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-300 mb-4">Item Summary</h3>

          <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-900/30">
            {selectedItem ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
                      <img src={selectedItem.image} alt="Selected item" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{formData.name || "Unnamed Item"}</h4>
                    <p className="text-sm text-gray-400">
                      {formData.category.charAt(0).toUpperCase() +
                        formData.category.slice(1)}{" "}
                      • {formData.costXP || 0} XP
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.available && (
                    <span className="bg-green-900/30 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full">
                      Available
                    </span>
                  )}
                  {formData.isExclusive && (
                    <span className="bg-yellow-900/30 border border-yellow-500/30 text-yellow-400 text-xs px-2 py-1 rounded-full">
                      Exclusive
                    </span>
                  )}
                  {formData.limitedTime && (
                    <span className="bg-orange-900/30 border border-orange-500/30 text-orange-400 text-xs px-2 py-1 rounded-full flex items-center">
                      <Clock size={12} className="mr-1" />
                      Limited Time
                    </span>
                  )}
                </div>

                {formData.description && (
                  <p className="text-sm text-gray-300 mt-2">{formData.description}</p>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <p>Select an item to see summary</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketFormSettings;
