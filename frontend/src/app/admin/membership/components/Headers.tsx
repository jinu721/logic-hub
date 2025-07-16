import { MembershipPlanIF } from "@/types/membership.types";
import { PurchaseIF } from "@/types/purchase.types";
import React from "react";

type HeaderProps = {
  activeTab: "plans" | "history";
  setActiveTab: (tab: "plans" | "history") => void;
  plans: MembershipPlanIF[];      
  history: PurchaseIF[];
};

const Headers: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  plans,
  history,
}) => {
  return (
    <>
      <div className="pt-10 mx-8 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Subscription Plans
        </h1>
      </div>

      <div className="mx-8 mb-6">
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-1 border border-indigo-900/30 inline-flex">
          <button
            onClick={() => setActiveTab("plans")}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === "plans"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20"
                : "hover:bg-gray-800/50 text-gray-400 hover:text-indigo-300"
            }`}
          >
            <span className="font-medium">Plans</span>
            {activeTab === "plans" && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 text-xs font-bold rounded-full">
                {plans.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20"
                : "hover:bg-gray-800/50 text-gray-400 hover:text-indigo-300"
            }`}
          >
            <span className="font-medium">History</span>
            {activeTab === "history" && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 text-xs font-bold rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Headers;
