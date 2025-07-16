import React from "react";
import { CreditCard, Clock } from "lucide-react";
import { PurchaseIF } from "@/types/purchase.types";




type HistoryListProps = {
  history: PurchaseIF[];
  getStatusStyles: (status: string) => string;
  formatDate: (date: string | Date) => string;
};

const MembershipHistory: React.FC<HistoryListProps> = ({
  history,
  getStatusStyles,
  formatDate,
}) => {
  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                  <CreditCard size={24} className="text-white opacity-70" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.planId.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <span>${item.amount.toFixed(2)}</span>
                    <span>•</span>
                    <span>User : {item.userId?.username || "Anonymous"}</span>
                  </div>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${getStatusStyles(
                  item.status
                )}`}
              >
                {item.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Period</p>
                <div className="flex items-center">
                  <Clock size={16} className="text-indigo-400 mr-2" />
                  <p className="text-sm text-gray-300">
                    {formatDate(item.startedAt)} to {formatDate(item.expiresAt)}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                <div className="flex items-center">
                  <CreditCard size={16} className="text-indigo-400 mr-2" />
                  <p className="text-sm text-gray-300">Razorpay</p>
                </div>
              </div>

              <div className="flex justify-end items-center space-x-2 mt-2 md:mt-0"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembershipHistory;
