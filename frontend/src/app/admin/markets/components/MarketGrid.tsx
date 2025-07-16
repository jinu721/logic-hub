import React from "react";
import { Clock, Crown, Edit, Trash } from "lucide-react";
import { MarketItemIF } from "@/types/market.types";


type MarketGridProps = {
  marketItems: MarketItemIF[];
  categoryIcons: Record<string, React.ReactNode>;
  categoryColors: Record<string, string>;
  handleEditMarketItem: (item: MarketItemIF) => void;
  handleDeleteMarketItem: (id: string) => void;
  formatDate: (date: string) => string;
};

const MarketGrid: React.FC<MarketGridProps> = ({
  marketItems,
  categoryIcons,
  categoryColors,
  handleEditMarketItem,
  handleDeleteMarketItem,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {marketItems.map((item) => (
        <div
          key={item._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                {categoryIcons[item.category]}
              </div>
            </div>
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${categoryColors[item.category]}`}
            >
              {item.category}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors line-clamp-1">
              {item.name}
            </h3>

            <div className="flex mb-3">
              {item.limitedTime && (
                <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-md text-xs">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-gray-300">
                    Expires: {formatDate(item.expiresAt as string)}
                  </span>
                </div>
              )}
              {item.isExclusive && (
                <div className="ml-2 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-md text-xs flex items-center">
                  <Crown size={12} className="mr-1" />
                  Exclusive
                </div>
              )}
            </div>

            <p className="text-gray-400 mb-4 line-clamp-2 text-sm">
              {item.description || "No description available"}
            </p>

            {!item.available && (
              <div className="mb-4 bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-md inline-block">
                Not Available
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-gray-800">
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
        </div>
      ))}
    </div>
  );
};

export default MarketGrid;
