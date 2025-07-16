import React from "react";
import { Edit, Trash } from "lucide-react";
import { InventoryIF } from "@/types/inventory.types";



interface InventoryGridProps {
  currentItems: InventoryIF[];
  handleEditItem: (item: InventoryIF) => void;
  handleDeleteItem: (id: string) => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({
  currentItems,
  handleEditItem,
  handleDeleteItem,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentItems.map((item) => (
        <div
          key={item._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src={
                item.image ||
                "https://source.unsplash.com/random/300x150/?game"
              }
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                item.isActive
                  ? "bg-green-500/70 text-green-100"
                  : "bg-red-500/70 text-red-100"
              }`}
            >
              {item.isActive ? "Active" : "Inactive"}
            </div>
            <div
              className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
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
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
              {item.name}
            </h3>
            <p className="text-gray-400 mb-6 line-clamp-2">
              {item.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-sm">
                ID: {item._id?.substring(0, 8)}...
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
        </div>
      ))}
    </div>
  );
};

export default InventoryGrid;
