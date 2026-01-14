"use client";

import { useState, useEffect } from "react";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllGroups } from "@/services/client/clientServices";
import { useToast } from "@/context/Toast";
import FilterSidebar from "./FilterSidebar";
import GroupCard from "./GroupCard";
import GroupDetailModal from "./GroupDetailModal";
import socket from "@/utils/socket.helper";
import { useSelector } from "react-redux";

interface Group {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    groupType: "public-open" | "public-approval";
    category?: string;
    tags?: string[];
    members: any[];
    admins: any[];
    userRequests: any[];
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

export default function GroupExplore() {
    const { showToast } = useToast() as any;
    const user = useSelector((state: any) => state.user.user);

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
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
    const [requestedGroups, setRequestedGroups] = useState<string[]>([]);

    const itemsPerPage = 12;

    useEffect(() => {
        fetchGroups();
    }, [selectedCategory, selectedType, currentPage]);

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

    const handleClearFilters = () => {
        setSelectedCategory("All");
        setSelectedType("all");
        setSelectedTags([]);
        setSearchQuery("");
    };

    const handleGroupClick = (group: Group) => {
        setSelectedGroup(group);
    };

    const handleJoinGroup = async (groupId: string) => {
        const group = groups.find((g) => g._id === groupId);
        if (!group) return;

        if (group.groupType === "public-approval") {
            setRequestedGroups((prev) => [...prev, groupId]);
        } else {
            setJoinedGroups((prev) => [...prev, groupId]);
        }

        socket.emit("update_group", {
            type: "join_group",
            groupId,
            userId: user?.userId as string,
            members: [],
        });

        showToast({
            type: "success",
            message: group.groupType === "public-approval"
                ? "Join request sent!"
                : "Successfully joined group!",
        });

        setSelectedGroup(null);
    };

    const isGroupJoined = (group: Group) => {
        const userId = user?.userId;
        return (
            joinedGroups.includes(group._id) ||
            group.members?.some((member) => member.userId === userId) ||
            group.admins?.some((admin) => admin.userId === userId)
        );
    };

    const isGroupPending = (group: Group) => {
        const userId = user?.userId;
        return (
            requestedGroups.includes(group._id) ||
            group.userRequests?.some((req) => req.toString() === userId?.toString())
        );
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Header */}
            <div className="bg-gray-900/60 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                Explore Groups
                            </h1>
                            <p className="text-gray-400">Join communities and collaborate with developers</p>
                        </div>
                        <div className="text-sm text-gray-500 bg-gray-800/50 px-4 py-2 rounded-xl">
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
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <FilterSidebar
                            categories={CATEGORIES}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            popularTags={POPULAR_TAGS}
                            selectedTags={selectedTags}
                            toggleTag={toggleTag}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onClearFilters={handleClearFilters}
                        />
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
                                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:border-indigo-500"
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
                                        <GroupCard
                                            key={group._id}
                                            group={group}
                                            onClick={() => handleGroupClick(group)}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
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
                                                        className={`w-10 h-10 rounded-xl transition-colors font-medium ${currentPage === pageNum
                                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30"
                                                                : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
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
                                            className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Group Detail Modal */}
            {selectedGroup && (
                <GroupDetailModal
                    group={selectedGroup}
                    onClose={() => setSelectedGroup(null)}
                    onJoin={handleJoinGroup}
                    isJoined={isGroupJoined(selectedGroup)}
                    isPending={isGroupPending(selectedGroup)}
                />
            )}
        </div>
    );
}
