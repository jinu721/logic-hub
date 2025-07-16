"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Trophy,
  CheckCircle,
  Gift,
} from "lucide-react";

interface MembershipPlan {
  features: string[];
}

interface Membership {
  isActive: boolean;
  planId: MembershipPlan;
}

interface User {
  membership: Membership;
}

interface SettingsPremiumProps {
  user: User;
  handleCancelMembership: () => void;
}

const SettingsPremium: FC<SettingsPremiumProps> = ({ user, handleCancelMembership }) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <CreditCard className="h-5 w-5 text-purple-300" />
        <h3 className="text-lg font-bold text-white">Premium Membership</h3>
      </div>

      {user.membership.isActive ? (
        <div className="p-4 bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border border-yellow-400/30 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-xl border border-yellow-400/30">
              <Trophy className="h-6 w-6 text-yellow-300" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-yellow-200">
                Premium Active
              </h4>
              <p className="text-yellow-300/80 text-xs">Membership is active</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {user.membership.planId.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center space-x-2 p-2 bg-yellow-900/20 border border-yellow-700/30 rounded-xl"
              >
                <CheckCircle className="h-4 w-4 text-yellow-300 flex-shrink-0" />
                <span className="text-xs text-yellow-100">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleCancelMembership}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-red-400/25 hover:scale-105"
          >
            Cancel Membership
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-400/30 rounded-2xl backdrop-blur-sm">
          <div className="text-center mb-4">
            <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-400/30 inline-block mb-3">
              <Gift className="h-8 w-8 text-purple-300" />
            </div>
            <h4 className="text-lg font-bold text-purple-200 mb-1">
              Upgrade to Premium
            </h4>
            <p className="text-purple-300/80 text-xs">
              Unlock exclusive features
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {["Unlimited Access", "Double XP Rewards", "Premium Badge", "Exclusive Items"].map(
              (feature) => (
                <div
                  key={feature}
                  className="flex items-center space-x-2 p-2 bg-purple-900/20 border border-purple-700/30 rounded-xl"
                >
                  <CheckCircle className="h-4 w-4 text-purple-300 flex-shrink-0" />
                  <span className="text-xs text-purple-100">{feature}</span>
                </div>
              )
            )}
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/premiumplans")}
              className="bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 hover:from-purple-600 hover:via-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-xl hover:shadow-purple-400/25 transform hover:scale-105"
            >
              Get Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPremium;
