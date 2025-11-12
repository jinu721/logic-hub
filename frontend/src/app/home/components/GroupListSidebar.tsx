import React, { useEffect, useState } from "react";
import { Search, Users, Crown, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import socket from "@/utils/socket.helper";
import { useToast } from "@/context/Toast";
import { getAllGroups } from "@/services/client/clientServices";
import { GroupIF } from "@/types/group.types";
import Link from "next/link";

type Params = {
  user: any;
};

const GroupsSidebar = ({ user }: Params) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [requestedGroups, setRequestedGroups] = useState<string[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { showToast } = useToast() as any;

  const [isLoading, setIsLoading] = useState(false);
  const [groupData, setGroupData] = useState([]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleUserJoin = async (groupId: string, groupType: string) => {
    if (groupType === "public-approval") {
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
    socket.on("group_updated", ({}) => {});
  };

  const fetchGroupData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllGroups({
        search: searchTerm,
        type: selectedCategory,
        page: currentPage,
        limit: itemsPerPage,
      });
      setGroupData(data.groups);
      setTotalItems(data.totalItems);
    } catch (error) {
      showToast({
        title: "Error",
        message: "Failed to load groups. Please try again later.",
        type: "error",
      });
      console.error("Error fetching domains:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchGroupData();
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchGroupData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const categories = ["all", "public-approval", "public-open"];

  return (
    <div className="space-y-6">
      {!user?.membership?.isActive && (
        <div className="bg-gradient-to-br from-purple-900/30 via-indigo-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden  top-6">
          <div className="relative p-6 pb-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Crown size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Go Premium</h3>
                  <p className="text-xs text-purple-300">Unlock everything</p>
                </div>
              </div>
              <Link href={"/premiumplans"} >
                <div className="w-full cursor-pointer bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Crown size={16} />
                    <span>Upgrade Now</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="bg-gray-950/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden sticky top-6">
        <div className="p-6 pb-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Groups</h3>
                <p className="text-xs text-gray-400">Join and collaborate</p>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 4).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                }`}
              >
                {category === "all" ? "All" : category}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <Users size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-2">Searching Group ...</p>
            </div>
          ) : groupData.length > 0 ? (
            groupData.map((group: GroupIF) => {
              const userId = user?.userId;
              const hasPendingRequest =
                group.groupType === "public-approval" &&
                (group.userRequests?.some(
                  (req) => req.toString() === userId?.toString()
                ) ||
                  requestedGroups.includes(group._id || ""));

              const isAlreadyMember =
                group.members?.some((member) => member.userId === user.userId) ||
                group.admins?.some((admin) => admin.userId === user.userId);

              const hasJoined =
                joinedGroups.includes(group._id || "") || isAlreadyMember;

              return (
                <div
                  key={group._id}
                  className="bg-gray-900/60 hover:bg-gray-900/80 rounded-xl p-4 border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/30 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {group.name.charAt(0).toUpperCase() +
                          (group.name.split(" ")[1]?.charAt(0)?.toUpperCase() ||
                            "")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {group.name}
                          </h4>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 space-x-2">
                          <span className="truncate">{group.groupType}</span>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Users size={10} />
                            <span>
                              {group.members?.length + group.admins?.length ||
                                0}
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{group.groupType.split("-")[1]}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                    {group.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-1">
                        {[...group.admins, ...group.members]
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((user, i) => (
                            <div
                              key={user.userId || i}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border-2 border-gray-900 ${
                                i === 0
                                  ? "bg-indigo-500 text-white"
                                  : i === 1
                                  ? "bg-purple-500 text-white"
                                  : "bg-pink-500 text-white"
                              }`}
                            >
                              {user.username?.charAt(0).toUpperCase() || "?"}
                            </div>
                          ))}
                        {(group.admins?.length || 0) +
                          (group.members?.length || 0) >
                          3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-300">
                            +
                            {(group.admins?.length || 0) +
                              (group.members?.length || 0) -
                              3}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      {hasJoined ? (
                        <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-green-300 bg-green-900/30 border border-green-700/50">
                          ✓ Joined
                        </div>
                      ) : hasPendingRequest ? (
                        <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-yellow-300 bg-yellow-900/30 border border-yellow-700/50">
                          <Clock size={12} className="inline mr-1" />
                          Pending
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            handleUserJoin?.(group._id || "", group.groupType)
                          }
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg"
                        >
                          <Plus size={12} className="inline mr-1" />
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Users size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-2">No groups found</p>
              <p className="text-xs text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </div>

        {totalPages > 1 && !isLoading && groupData.length > 0 && (
          <div className="px-4 pb-3 border-t border-gray-700/30">
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-400">
                  {currentPage} of {totalPages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-2 py-1 text-xs text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {groupData.length > 0 && (
          <div className="p-4 pt-0">
            <button className="w-full text-indigo-400 hover:text-indigo-300 text-sm font-medium py-2 transition-colors flex items-center justify-center space-x-1">
              <span>View All Groups</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsSidebar;