import React from "react";
import { Search, Filter, Grid, List, Plus } from "lucide-react";

type MarketToolbarProps = {
  marketItems: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  setShowMarketItemModal: (value: boolean) => void;
  setMarketItemToEdit: (value: any) => void;
};

const MarketToolbar: React.FC<MarketToolbarProps> = ({
  marketItems,
  searchTerm,
  setSearchTerm,
  setSelectedCategory,
  viewMode,
  setViewMode,
  setShowMarketItemModal,
  setMarketItemToEdit,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Market Items
          <span className="ml-3 text-sm bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">
            {marketItems.length} items
          </span>
        </h2>
        <p className="text-gray-400 mt-1">Manage all market items</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800/80 border border-gray-700/50 rounded-full px-5 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 group-hover:shadow-md group-hover:shadow-indigo-500/20"
          />
          <button className="absolute right-4 top-2.5">
            <Search size={18} className="text-indigo-400" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <select onChange={(e) => setSelectedCategory(e.target.value)} className="bg-gray-900 border border-indigo-900/30 rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all">
              <option value="" >All Categories</option>
              <option value="avatar" >Avatar</option>
              <option value="banner" >Banner</option>
              <option value="badge" >Badge</option>
            </select>
            <Filter size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>

        </div>

        <div className="flex items-center bg-gray-900 rounded-lg border border-indigo-900/30 overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${viewMode === "grid" ? "bg-indigo-600" : "hover:bg-gray-800"}`}
          >
            <Grid size={16} className="text-white" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${viewMode === "list" ? "bg-indigo-600" : "hover:bg-gray-800"}`}
          >
            <List size={16} className="text-white" />
          </button>
        </div>

        <button
          onClick={() => {
            setMarketItemToEdit(null);
            setShowMarketItemModal(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center transition-all duration-300 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} className="mr-2" />
          Add New Item
        </button>
      </div>
    </div>
  );
};

export default MarketToolbar;
