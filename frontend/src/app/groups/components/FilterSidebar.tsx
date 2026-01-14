import { Search, Filter, Users, X } from "lucide-react";

interface FilterSidebarProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedType: "all" | "public-open" | "public-approval";
    setSelectedType: (type: "all" | "public-open" | "public-approval") => void;
    popularTags: string[];
    selectedTags: string[];
    toggleTag: (tag: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onClearFilters: () => void;
}

export default function FilterSidebar({
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    popularTags,
    selectedTags,
    toggleTag,
    searchQuery,
    setSearchQuery,
    onClearFilters,
}: FilterSidebarProps) {
    return (
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sticky top-24 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-700/50">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Filters</h3>
                    <p className="text-xs text-gray-400">Refine your search</p>
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Category</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCategory === category
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
                                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type Filter */}
            <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Access Type</h4>
                <div className="space-y-2">
                    <button
                        onClick={() => setSelectedType("all")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedType === "all"
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
                                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                            }`}
                    >
                        All Types
                    </button>
                    <button
                        onClick={() => setSelectedType("public-open")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedType === "public-open"
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
                                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                            }`}
                    >
                        🌍 Open Groups
                    </button>
                    <button
                        onClick={() => setSelectedType("public-approval")}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedType === "public-approval"
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
                                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                            }`}
                    >
                        🔒 Approval Required
                    </button>
                </div>
            </div>

            {/* Tags Filter */}
            <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTags.includes(tag)
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-200"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <button
                onClick={onClearFilters}
                className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
                <X className="w-4 h-4" />
                Clear All Filters
            </button>
        </div>
    );
}
