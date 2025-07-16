"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X, Clock } from "lucide-react";
import MarketFormDetails from "./MarketFormDetails";
import MarketFormSelection from "./MarketFormSelection";
import MarketFormSettings from "./MarketFormSettings";
import { InventoryIF } from "@/types/inventory.types";



interface MarketItemModalProps {
  marketItem?: any;
  onClose: () => void;
  onSave: (item: any, id?: string) => Promise<void>;
  availableItems: InventoryIF[];
  setSelectedItemType: (type: string) => void;
  isViewOnly?: boolean;
}

const MarketItemModal: React.FC<MarketItemModalProps> = ({
  marketItem,
  onClose,
  onSave,
  availableItems,
  setSelectedItemType,
  isViewOnly = false,
}) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    costXP: 0,
    itemType: "",
    itemId:"" ,
    category: "avatar",
    available: true,
    limitedTime: false,
    isExclusive: false,
    expiresAt: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryIF | null>(null);

  useEffect(() => {
    if (marketItem) {
      setFormData({
        ...marketItem,
        expiresAt: marketItem.expiresAt || "",
      });

      if (marketItem.itemId) {
        const item = availableItems.find((i) => i._id === marketItem.itemId);
        setSelectedItem(item || null);
      }
    }
  }, [marketItem, availableItems]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    let updatedValue: string | boolean = value;

    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      updatedValue = e.target.checked;
    }

    setFormData((prev:any) => ({ ...prev, [name]: updatedValue }));
    validateForm();
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const category: string = e.target.value;
    setFormData({
      ...formData,
      category,
      itemType:
        category === "avatar"
          ? "Avatar"
          : category === "banner"
          ? "Banner"
          : "Badges",
      itemId: "",
    });
    setSelectedItemType(`${category}s`);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: InventoryIF) => {
    setFormData({
      ...formData,
      itemId: item._id as string,
    });
    setSelectedItem(item);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (
      !formData.costXP ||
      isNaN(Number(formData.costXP)) ||
      Number(formData.costXP) < 0
    ) {
      newErrors.costXP = "Valid XP cost is required";
    }
    if (!formData.itemId) newErrors.itemId = "You must select an item";
    if (formData.limitedTime && !formData.expiresAt) {
      newErrors.expiresAt =
        "Expiration date is required for limited time items";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const submittedItem: any = {
      ...formData,
      costXP: parseInt(String(formData.costXP), 10),
    };

    onSave(submittedItem, marketItem?._id);
  };

  const formatDateForInput = (dateString: string | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-gray-900 border border-indigo-900/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-indigo-600/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-indigo-900/30 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
          <h2 className="text-2xl font-bold text-white">
            {isViewOnly
              ? `${marketItem?.name || "Market Item"} Details`
              : marketItem?._id
              ? `Edit ${marketItem.name}`
              : "Add New Market Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {!isViewOnly && (
          <div className="flex border-b border-indigo-900/30">
            {["details", "selection", "settings"].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-3 font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-indigo-500 text-indigo-400"
                    : "text-gray-400 hover:text-indigo-300"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "details"
                  ? "Basic Details"
                  : tab === "selection"
                  ? "Item Selection"
                  : "Availability Settings"}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <form onSubmit={handleSubmit}>
            {isViewOnly ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-indigo-400 mb-4">
                      Item Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400">Item Name</div>
                        <div className="text-white text-lg">
                          {formData.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Description</div>
                        <div className="text-white">
                          {formData.description || "No description"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Category</div>
                        <div className="text-white capitalize">
                          {formData.category}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Cost</div>
                        <div className="text-white text-xl font-bold">
                          {formData.costXP} XP
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-indigo-400 mb-4">
                      Status & Availability
                    </h3>
                    <div className="space-y-2">
                      <div className="flex space-x-4">
                        <div>
                          <div className="text-sm text-gray-400">
                            Availability
                          </div>
                          <div className="text-white">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                formData.available
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {formData.available
                                ? "Available"
                                : "Not Available"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">
                            Exclusivity
                          </div>
                          <div className="text-white">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                formData.isExclusive
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {formData.isExclusive
                                ? "Exclusive Item"
                                : "Standard Item"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">
                          Time Availability
                        </div>
                        <div className="text-white">
                          {formData.limitedTime ? (
                            <div className="flex items-center">
                              <Clock
                                size={16}
                                className="text-orange-500 mr-2"
                              />
                              <span>
                                Limited Time - Expires on{" "}
                                {new Date(
                                  formData.expiresAt || ""
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          ) : (
                            <span>Always Available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-indigo-400 mb-4">
                    Item Preview
                  </h3>
                  {selectedItem ? (
                    <div className="bg-gray-800/70 rounded-lg p-4 border border-indigo-900/30">
                      <div className="aspect-square w-full max-w-xs mx-auto bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center mb-4">
                        <div className="text-center">
                          <div className="text-lg font-medium text-white mb-2">
                            {selectedItem.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formData.category.charAt(0).toUpperCase() +
                              formData.category.slice(1)}{" "}
                            Item
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Item ID</div>
                      <div className="text-white text-xs bg-gray-800 p-2 rounded border border-gray-700 font-mono">
                        {formData.itemId}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700 flex items-center justify-center text-gray-400">
                      No item selected
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {activeTab === "details" && (
                  <MarketFormDetails
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange}
                    handleCategoryChange={handleCategoryChange}
                  />
                )}
                {activeTab === "selection" && (
                  <MarketFormSelection
                    formData={formData}
                    errors={errors}
                    availableItems={availableItems}
                    selectedItem={selectedItem}
                    handleItemSelect={handleItemSelect}
                  />
                )}
                {activeTab === "settings" && (
                  <MarketFormSettings
                    formData={formData}
                    errors={errors}
                    selectedItem={selectedItem}
                    handleInputChange={handleInputChange}
                    formatDateForInput={formatDateForInput}
                  />
                )}
              </>
            )}
            <div className="flex justify-end pt-4 border-t border-indigo-900/30 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 mr-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                {isViewOnly ? "Close" : "Cancel"}
              </button>
              {!isViewOnly && (
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-200"
                >
                  {isLoading
                    ? marketItem?._id
                      ? "Updating..."
                      : "Creating..."
                    : marketItem?._id
                    ? "Update Item"
                    : "Add to Market"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarketItemModal;
