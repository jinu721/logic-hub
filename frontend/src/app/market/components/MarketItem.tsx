import React from "react";
import { Clock, Gem, PlusCircle, Star } from "lucide-react";
import { MarketItemIF } from "@/types/market.types";

interface MarketItemProps {
  item: MarketItemIF;
  onPurchase: (item: MarketItemProps["item"]) => void;
  userXP: number;
  userInventory: {
    ownedAvatars?: { _id: string }[];
    ownedBanners?: { _id: string }[];
    ownedBadges?: { _id: string }[];
  };
  isPremiumUser?: boolean;
}

const MarketItem: React.FC<MarketItemProps> = ({
  item,
  onPurchase,
  userInventory,
  userXP,
  isPremiumUser,
}) => {
  const isOwned = (): boolean => {
    switch (item.category) {
      case "avatar":
        return (
          userInventory.ownedAvatars?.some((a) => a._id === item.itemId._id) ??
          false
        );
      case "banner":
        return (
          userInventory.ownedBanners?.some((b) => b._id === item.itemId._id) ??
          false
        );
      case "badge":
        return (
          userInventory.ownedBadges?.some((b) => b._id === item.itemId._id) ??
          false
        );
      default:
        return false;
    }
  };

  const canAfford = userXP >= item.costXP;

  const getTimeRemaining = (expiresAt?: string): string => {
    if (!expiresAt) return "";

    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) return "Expired";

    const diffDays = Math.floor(diffMs / 86400000);
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);

    if (diffDays > 0) {
      return `${diffDays}d ${diffHrs}h`;
    } else {
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      return `${diffHrs}h ${diffMins}m`;
    }
  };

  return (
    <div className="group relative bg-gradient-to-b  from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all hover:border-purple-500 hover:shadow-purple-500/20 hover:shadow-xl">
      {item.limitedTime && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
            <Clock className="h-3 w-3 mr-1" />
            {item.expiresAt
              ? getTimeRemaining(
                  item.expiresAt ? (item.expiresAt as string) : ""
                )
              : "Limited"}
          </div>
        </div>
      )}

      {item.isExclusive && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center backdrop-blur-sm">
            <Gem className="h-3 w-3 mr-1" />
            Exclusive
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
        <div className="h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img
            src={item.itemId?.image || "/api/placeholder/400/300"}
            alt={item.name}
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              item.category === "avatar"
                ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                : item.category === "banner"
                ? "bg-green-900/50 text-green-300 border border-green-700"
                : "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
            }`}
          >
            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
          {item.name}
        </h3>

        <p className="text-gray-400 text-sm mb-6 h-12 overflow-hidden">
          {item.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2 relative">
              <div className="absolute inset-0 bg-yellow-400 blur-sm opacity-20 rounded-full"></div>
              <Star className="h-5 w-5 text-yellow-400 relative z-10" />
            </div>
            <span className="text-yellow-400 font-bold">{item.costXP} XP</span>
          </div>

          {isOwned() ? (
            <button
              disabled
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg flex items-center opacity-75 cursor-not-allowed"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Owned
            </button>
          ) : !canAfford ? (
            <button
              disabled
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-lg flex items-center opacity-50 cursor-not-allowed"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              XP Short
            </button>
          ) : item.isExclusive ? (
            <button
              onClick={() => onPurchase(item)}
              className="cursor-pointer bg-gradient-to-r from-yellow-600 to-yellow-900 hover:from-yellow-900 hover:to-yellow-600 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Exclusive
            </button>
          ) : (
            <button
              onClick={() => onPurchase(item)}
              className="cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketItem;
