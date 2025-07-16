import React from "react";
import { CheckCircle } from "lucide-react";
import { MembershipPlanIF } from "@/types/membership.types";



type Props = {
  formData: MembershipPlanIF;
};

const MembershipPlanView: React.FC<Props> = ({ formData }) => {
  const isDiscountExpired = (): boolean => {
    if (!formData.discount?.validUntil) return false;
    const expiryDate = new Date(formData.discount.validUntil);
    return expiryDate < new Date();
  };

  const getEffectivePrice = (): number => {
    if (!formData.discount?.active) return formData.price;

    const { type, amount } = formData.discount as {
      type: "percentage" | "fixed";
      amount: number;
    };

    if (type === "percentage") {
      return formData.price - (formData.price * amount) / 100;
    } else {
      return Math.max(0, formData.price - amount);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-indigo-400 mb-4">
            Plan Details
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Plan Name</div>
              <div className="text-white text-lg">{formData.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Description</div>
              <div className="text-white">
                {formData.description || "No description"}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Billing Interval</div>
              <div className="text-white">{formData.type || "silver"}</div>
            </div>

            <div className="flex space-x-4">
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className="text-white">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      formData.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Featured</div>
                <div className="text-white">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      formData.isFeatured
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {formData.isFeatured ? "Featured" : "Not Featured"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-indigo-400 mb-4">Pricing</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-400">Base Price</div>
              <div className="text-white text-xl font-bold">
                ₹{Number(formData.price).toFixed(2)}
              </div>
            </div>

            {formData.discount?.active && (
              <div>
                <div className="text-sm text-gray-400">Discount</div>
                <div className="text-white">
                  {formData.discount.type === "percentage"
                    ? `${formData.discount.amount}% off`
                    : `₹${formData.discount.amount.toFixed(2)} off`}
                  {formData.discount.validUntil && (
                    <span
                      className={`ml-2 text-sm ${
                        isDiscountExpired()
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {isDiscountExpired()
                        ? "(Expired)"
                        : `(Valid until ${new Date(
                            formData.discount.validUntil
                          ).toLocaleDateString()})`}
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <div className="text-sm text-gray-400">Effective Price</div>
                  <div className="text-white text-xl font-bold">
                    ₹{getEffectivePrice().toFixed(2)}
                    {formData.price > 0 && (
                      <span className="ml-2 text-sm line-through text-gray-500">
                        ₹{Number(formData.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-indigo-400 mb-4">Features</h3>
        {formData.features?.length ? (
          <ul className="space-y-2">
            {formData.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                <span className="text-white">{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No features added to this plan</p>
        )}
      </div>
    </div>
  );
};

export default MembershipPlanView;
