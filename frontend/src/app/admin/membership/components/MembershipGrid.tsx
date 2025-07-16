import React from "react";
import { CreditCard, Eye, Edit, EyeOff, CheckCircle } from "lucide-react";
import { MembershipPlanIF } from "@/types/membership.types";



type MembershipGridProps = {
  plans: MembershipPlanIF[];
  handleViewPlan: (plan: MembershipPlanIF) => void;
  setPlanToEdit: (plan: MembershipPlanIF) => void;
  setShowPlanModal: (show: boolean) => void;
  handleToggleActive: (_id: string, isActive: boolean) => void;
};

const MembershipGrid: React.FC<MembershipGridProps> = ({
  plans,
  handleViewPlan,
  setPlanToEdit,
  setShowPlanModal,
  handleToggleActive,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <CreditCard size={48} className="text-white opacity-40" />
            </div>
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                plan.isActive
                  ? "bg-green-500/70 text-green-100"
                  : "bg-red-500/70 text-gray-100"
              }`}
            >
              {plan.isActive ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="flex flex-col items-center -mt-10 relative z-10 px-6">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-gray-900 mb-3 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                ${plan.price}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors text-center">
              {plan.name}
            </h3>

            <div className="mb-2 flex items-center space-x-1">
              <div
                className={`w-3 h-3 rounded-full ${
                  plan.isFeatured ? "bg-yellow-500" : "bg-transparent"
                }`}
              ></div>
              <p className="text-gray-400 text-sm">
                {plan.type || "Silver"}
              </p>
            </div>

            <p className="text-gray-400 mb-6 line-clamp-2 text-center">
              {plan.description || "No description available"}
            </p>

            <div className="flex justify-between items-center w-full mb-6">
              <div className="text-gray-500 text-sm">
                Features: {plan.features?.length || 0}
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
        </div>
      ))}
    </div>
  );
};

export default MembershipGrid;
