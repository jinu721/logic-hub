"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Users, Lock, Globe, ChevronRight, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllGroups } from "@/services/client/clientServices";
import { useToast } from "@/context/Toast";

interface Group {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    groupType: "public-open" | "public-approval";
    category?: string;
    tags?: string[];
    members: any[];
    createdBy: any;
    createdAt: Date;
}

const CATEGORIES = [
    "All",
    "General",
    "Programming",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "DevOps",
    "Security",
    "AI/ML",
    "Other",
];

const POPULAR_TAGS = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "TypeScript",
    "Java",
    "C++",
    "Algorithms",
    "System Design",
    "Competitive Programming",
];

export default function GroupsExplorePage() {
    const router = useRouter();
    const { showToast } = useToast() as any;

    const [groups, setGroups] = useState<Group[]>([]);
    const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<"all" | "public-open" | "public-approval">("all");
    const [sortBy, setSortBy] = useState<"newest" | "popular" | "name">("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchGroups();
    }, [selectedCategory, selectedType, currentPage]);

    const fetchGroups = async () => {
        try {
            setIsLoading(true);
            const params: any = {
                page: currentPage,
                limit: itemsPerPage,
            };

            if (selectedCategory !== "All") {
                params.category = selectedCategory;
            }

            if (selectedType !== "all") {
                params.type = selectedType;
            }

            if (selectedTags.length > 0) {
                params.tags = selectedTags.join(",");
            }

            if (searchQuery.trim()) {
                params.search = searchQuery;
            }

            const response = await getAllGroups(params);
            setGroups(response.groups || []);
            setTotalItems(response.totalItems || 0);
            setFilteredGroups(response.groups || []);
        } catch (error: any) {
            console.error("Error fetching groups:", error);
            showToast({ type: "error", message: "Failed to load groups" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery !== undefined) {
                fetchGroups();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        applySorting();
    }, [sortBy, groups]);

    const applySorting = () => {
        let sorted = [...groups];

        switch (sortBy) {
            case "newest":
                sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "popular":
                sorted.sort((a, b) => (b.members?.length || 0) - (a.members?.length || 0));
                break;
            case "name":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        setFilteredGroups(sorted);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleGroupClick = (groupId: string) => {
        router.push(`/groups/${groupId}`);
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            {/* Header */}
            <div className="bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Explore Groups</h1>
                            <p className="text-gray-400">Join communities and collaborate with developers</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {totalItems} groups found
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search groups by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 sticky top-32 space-y-6">
                            <div className="flex items-center gap-2 text-white font-semibold mb-4">
                                <Filter className="w-5 h-5" />
                                <span>Filters</span>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-3">Category</h3>
                                <div className="space-y-2">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-3">Group Type</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedType("all")}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedType === "all"
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                            }`}
                                    >
                                        All Types
                                    </button>
                                    <button
                                        onClick={() => setSelectedType("public-open")}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedType === "public-open"
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                            }`}
                                    >
                                        <Globe className="w-4 h-4" />
                                        Open
                                    </button>
                                    <button
                                        onClick={() => setSelectedType("public-approval")}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedType === "public-approval"
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                                            }`}
                                    >
                                        <Lock className="w-4 h-4" />
                                        Approval Required
                                    </button>
                                </div>
                            </div>

                            {/* Tags Filter */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-400 mb-3">Popular Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {POPULAR_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag)
                                                    ? "bg-indigo-600 text-white"
                                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedType("all");
                                    setSelectedTags([]);
                                    setSearchQuery("");
                                }}
                                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>

                    {/* Groups Grid */}
                    <div className="lg:col-span-3">
                        {/* Sort Options */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="text-sm text-gray-400">
                                Showing {filteredGroups.length} of {totalItems} groups
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-indigo-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="name">Name (A-Z)</option>
                            </select>
                        </div>

                        {/* Groups List */}
                        {isLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                        ) : filteredGroups.length === 0 ? (
                            <div className="text-center py-20">
                                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">No groups found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search query</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredGroups.map((group) => (
                                        <div
                                            key={group._id}
                                            onClick={() => handleGroupClick(group._id)}
                                            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-indigo-500 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                                    {group.image ? (
                                                        <img src={group.image} alt={group.name} className="w-full h-full rounded-xl object-cover" />
                                                    ) : (
                                                        <Users className="w-8 h-8 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors truncate">
                                                            {group.name}
                                                        </h3>
                                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                                    </div>
                                                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                                                        {group.description || "No description available"}
                                                    </p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <Users className="w-3.5 h-3.5" />
                                                            <span>{group.members?.length || 0} members</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {group.groupType === "public-open" ? (
                                                                <>
                                                                    <Globe className="w-3.5 h-3.5" />
                                                                    <span>Open</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lock className="w-3.5 h-3.5" />
                                                                    <span>Approval</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {group.tags && group.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {group.tags.slice(0, 3).map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 bg-gray-800 text-indigo-300 rounded text-[10px] font-medium border border-indigo-500/20"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {group.tags.length > 3 && (
                                                                <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-[10px]">
                                                                    +{group.tags.length - 3}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-10 h-10 rounded-lg transition-colors ${currentPage === pageNum
                                                                ? "bg-indigo-600 text-white"
                                                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
