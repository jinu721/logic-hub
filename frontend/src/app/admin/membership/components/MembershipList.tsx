import React from "react";
import { Eye, Edit, EyeOff, CheckCircle, Star } from "lucide-react";
import { MembershipPlanIF } from "@/types/membership.types";

type MembershipListProps = {
  plans: MembershipPlanIF[];
  handleViewPlan: (plan: MembershipPlanIF) => void;
  setPlanToEdit: (plan: MembershipPlanIF) => void;
  setShowPlanModal: (show: boolean) => void;
  handleToggleActive: (_id: string, isActive: boolean) => void;
};

const MembershipList: React.FC<MembershipListProps> = ({
  plans,
  handleViewPlan,
  setPlanToEdit,
  setShowPlanModal,
  handleToggleActive,
}) => {
  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div
          key={plan._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-indigo-500/50 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              ${plan.price}
            </span>
          </div>

          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {plan.name}
              </h3>
              {plan.isFeatured && (
                <div className="ml-2 bg-yellow-500 rounded-full p-1">
                  <Star size={12} className="text-white" />
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm line-clamp-1">
              {plan.description || "No description available"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-indigo-600/70 text-indigo-100">
              {plan.type || "Silver"}
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                plan.isActive
                  ? "bg-green-500/70 text-green-100"
                  : "bg-red-500/70 text-gray-100"
              }`}
            >
              {plan.isActive ? "Active" : "Inactive"}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleViewPlan(plan)}
                className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30"
              >
                <Eye size={16} className="text-white" />
              </button>
              <button
                onClick={() => {
                  setPlanToEdit(plan);
                  setShowPlanModal(true);
                }}
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30"
              >
                <Edit size={16} className="text-white" />
              </button>
              <button
                onClick={() => handleToggleActive(plan._id as string, plan.isActive)}
                className="bg-gray-800 hover:bg-amber-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/30"
              >
                {plan.isActive ? (
                  <EyeOff size={16} className="text-white" />
                ) : (
                  <CheckCircle size={16} className="text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembershipList;
