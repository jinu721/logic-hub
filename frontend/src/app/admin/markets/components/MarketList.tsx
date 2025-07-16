import React from "react";
import { Edit, Trash, Crown, Calendar, ShoppingCart } from "lucide-react";
import { MarketItemIF } from "@/types/market.types";


type MarketListProps = {
  marketItems: MarketItemIF[];
  categoryIcons: Record<string, React.ReactNode>;
  categoryColors: Record<string, string>;
  handleEditMarketItem: (item: MarketItemIF) => void;
  handleDeleteMarketItem: (id: string) => void;
  formatDate: (date: string) => string;
};

const MarketList: React.FC<MarketListProps> = ({
  marketItems,
  categoryIcons,
  categoryColors,
  handleEditMarketItem,
  handleDeleteMarketItem,
  formatDate,
}) => {
  return (
    <div className="space-y-4">
      {marketItems.map((item) => (
        <div
          key={item._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
            {categoryIcons[item.category] || <ShoppingCart size={20} />}
          </div>

          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {item.name}
              </h3>
              {item.isExclusive && (
                <div className="ml-2 bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-md text-xs flex items-center">
                  <Crown size={10} className="mr-1" />
                  Exclusive
                </div>
              )}
              {!item.available && (
                <div className="ml-2 bg-red-500/20 text-red-300 px-2 py-0.5 rounded-md text-xs">
                  Not Available
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm line-clamp-1">
              {item.description || "No description available"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {item.limitedTime && (
              <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-md text-xs">
                <Calendar size={12} className="text-gray-400" />
                <span className="text-gray-300">
                  {formatDate(item.expiresAt as string)}
                </span>
              </div>
            )}

            <div
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                categoryColors[item.category] || "bg-blue-500/70 text-blue-100"
              }`}
            >
              {item.category}
            </div>

            <div className="text-gray-500 text-sm">
              Cost: <span className="text-indigo-400">{item.costXP} XP</span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditMarketItem(item)}
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30"
              >
                <Edit size={16} className="text-white" />
              </button>
              <button
                onClick={() => handleDeleteMarketItem(item._id as string)}
                className="bg-gray-800 hover:bg-red-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
              >
                <Trash size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketList;
