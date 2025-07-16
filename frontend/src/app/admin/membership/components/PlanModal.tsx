"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { X } from "lucide-react";
import MembershipPlanView from "./MembershipFormView";
import MembershipFormDetails from "./MembershipFormDetails";
import MembershipFormFeatures from "./MembershipFormFeatures";
import MembershipFormPricing from "./MembershipFormPricing";
import { MembershipPlanIF } from "@/types/membership.types";


interface Errors {
  name?: string;
  price?: string;
  discountAmount?: string;
  discountDate?: string;
}

interface PlanModalProps {
  plan?: MembershipPlanIF;
  onClose: () => void;
  onSave: (data: MembershipPlanIF, isEdit: boolean) => void;
  availableFeatures?: string[];
  isViewOnly?: boolean;
}

const PlanModal: React.FC<PlanModalProps> = ({
  plan,
  onClose,
  onSave,
  availableFeatures = [],
  isViewOnly = false,
}) => {
  const [formData, setFormData] = useState<MembershipPlanIF>({
    name: "",
    price: 0,
    description: "",
    type: "silver",
    isActive: true,
    isFeatured: false,
    features: [],
    discount: {
      active: false,
      amount: 0,
      type: "percentage",
      validUntil: "",
    },
  });

  const [customFeature, setCustomFeature] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [activeTab, setActiveTab] = useState<"details" | "features" | "pricing">("details");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        ...plan,
        features: plan.features || [],
        discount: plan.discount || {
          active: false,
          amount: "",
          type: "percentage",
          validUntil: "",
        },
      });
    }
  }, [plan]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    validateForm();
  };

const handleDiscountChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;

  const newValue = type === "checkbox" && "checked" in e.target
    ? (e.target as HTMLInputElement).checked
    : value;

    console.log("New Value", newValue);

    console.log("Name", name);
    console.log("Value", value);
    console.log("Type", type);

  setFormData((prev) => ({
    ...prev,
    discount: {
      ...prev.discount,
      [name]: newValue,
    },
  }));
};

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Valid price is required";
    }

    if (formData.discount.active) {
      const discountAmount = formData.discount.amount;

      if (!discountAmount || discountAmount <= 0 || isNaN(discountAmount)) {
        newErrors.discountAmount = "Valid discount amount is required";
      }

      if (formData.discount.type === "percentage" && discountAmount > 100) {
        newErrors.discountAmount = "Percentage discount cannot exceed 100%";
      }

      if (
        formData.discount.type === "fixed" &&
        discountAmount > formData.price
      ) {
        newErrors.discountAmount = "Discount cannot exceed the price";
      }

      if (!formData.discount.validUntil) {
        newErrors.discountDate = "Valid expiration date is required";
      }
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

    const submittedPlan: MembershipPlanIF = {
      ...formData,
      price: formData.price,
    };

    if (formData.discount.active) {
      submittedPlan.discount.amount = formData.discount.amount;
    }

    onSave(submittedPlan, !!plan?._id);
  };

  const getEffectivePrice = (): number => {
    if (!formData.discount.active || !formData.discount.amount) {
      return Number(formData.price) || 0;
    }

    const price = formData.price || 0;
    const discountAmount = formData.discount.amount || 0;

    if (formData.discount.type === "percentage") {
      return Math.max(0, price - (price * discountAmount) / 100);
    }

    return Math.max(0, price - discountAmount);
  };

  const addFeature = () => {
    if (customFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, customFeature.trim()],
      }));
      setCustomFeature("");
    }
  };

  const toggleFeature = (feature: string) => {
    const exists = formData.features.includes(feature);
    setFormData((prev) => ({
      ...prev,
      features: exists
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const formatDateForInput = (date: string | Date): string => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-indigo-900/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-indigo-600/20">
        <div className="flex justify-between items-center p-6 border-b border-indigo-900/30 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
          <h2 className="text-2xl font-bold text-white">
            {isViewOnly
              ? `${plan?.name || "Plan"} Details`
              : plan?._id
              ? `Edit ${plan.name}`
              : "Create New Subscription Plan"}
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
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "details"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-gray-400 hover:text-indigo-300"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Plan Details
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "features"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-gray-400 hover:text-indigo-300"
              }`}
              onClick={() => setActiveTab("features")}
            >
              Features
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "pricing"
                  ? "border-b-2 border-indigo-500 text-indigo-400"
                  : "text-gray-400 hover:text-indigo-300"
              }`}
              onClick={() => setActiveTab("pricing")}
            >
              Pricing & Discounts
            </button>
          </div>
        )}

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <form onSubmit={handleSubmit}>
            {isViewOnly ? (
              <MembershipPlanView formData={plan as MembershipPlanIF} />
            ) : (
              <>
                {activeTab === "details" && (
                  <MembershipFormDetails
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange as any}
                  />
                )}
                {activeTab === "features" && (
                  <MembershipFormFeatures
                    formData={formData}
                    customFeature={customFeature}
                    setCustomFeature={setCustomFeature}
                    addFeature={addFeature}
                    removeFeature={removeFeature}
                    availableFeatures={availableFeatures}
                    toggleFeature={toggleFeature}
                  />
                )}
                {activeTab === "pricing" && (
                  <MembershipFormPricing
                    formData={formData}
                    errors={errors}
                    handleInputChange={handleInputChange as any}
                    handleDiscountChange={handleDiscountChange}
                    getEffectivePrice={getEffectivePrice}
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
                    ? plan?._id
                      ? "Updating..."
                      : "Creating..."
                    : plan?._id
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
