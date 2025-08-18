import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";
import FilterDropdown from "./FilterDropdown";

type Props = {
  filterChange: (filter: any) => void;
};

const MarketTabs: React.FC<Props> = ({ filterChange }:Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");


  useEffect(() => {
    filterChange({
      searchQuery,
      category,
      sortOption,});
  }, [category, searchQuery, sortOption]);

  return (
    <>
      <div  className="relative bg-gray-800 bg-opacity-80 z-10 backdrop-blur-sm p-6 rounded-b-xl border-x border-b border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl pl-10 border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <FilterDropdown
                options={[
                  { label: "All Categories", value: "" },
                  { label: "Avatars", value: "avatar" },
                  { label: "Banners", value: "banner" },
                  { label: "Badges", value: "badge" },
                ]}
                currentValue={category}
                onSelect={(value) => setCategory(value)}
                icon={<Filter className="h-5 w-5 mr-2" />}
                placeholder="Filter"
              />
            </div>

            <div className="relative">
              <FilterDropdown
                options={[
                  { label: "Price: Low to High", value: "price-asc" },
                  { label: "Price: High to Low", value: "price-desc" },
                  { label: "Limited Time Only", value: "limited" },
                  { label: "Exclusive Items", value: "exclusive" },
                ]}
                currentValue={sortOption}
                onSelect={(value) => setSortOption(value)}
                icon={<TrendingUp className="h-5 w-5 mr-2" />}
                placeholder="Sort By"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketTabs;
