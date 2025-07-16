import React from "react";
import { Edit, Trash } from "lucide-react";
import { InventoryIF } from "@/types/inventory.types";


interface InventoryListProps {
  currentItems: InventoryIF[];
  handleEditItem: (item: InventoryIF) => void;
  handleDeleteItem: (id: string) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({
  currentItems,
  handleEditItem,
  handleDeleteItem,
}) => {
  return (
    <div className="space-y-4">
      {currentItems.map((item) => (
        <div
          key={item._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-16 w-16 rounded-lg overflow-hidden mr-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay"></div>
            <img
              src={
                item.image ||
                "https://source.unsplash.com/random/300x150/?game"
              }
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-grow">
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
              {item.name}
            </h3>
            <p className="text-gray-400 text-sm line-clamp-1">
              {item.description}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                item.rarity === "Common"
                  ? "bg-gray-700/70 text-gray-200"
                  : item.rarity === "Uncommon"
                  ? "bg-green-600/70 text-green-100"
                  : item.rarity === "Rare"
                  ? "bg-blue-600/70 text-blue-100"
                  : item.rarity === "Epic"
                  ? "bg-purple-600/70 text-purple-100"
                  : "bg-yellow-600/70 text-yellow-100"
              }`}
            >
              {item.rarity}
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                item.isActive
                  ? "bg-green-500/70 text-green-100"
                  : "bg-red-500/70 text-red-100"
              }`}
            >
              {item.isActive ? "Active" : "Inactive"}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditItem(item)}
                className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30"
              >
                <Edit size={16} className="text-white" />
              </button>
              <button
                onClick={() => handleDeleteItem(item._id as string)}
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

export default InventoryList;
