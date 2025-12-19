"use client";

import { searchUser } from "@/services/client/clientServices";
import { UserIF } from "@/types/user.types";
import { Eye, Search, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SearchUsers() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showResults, setShowResults] = useState<boolean>(false);

  const [searchResults, setSearchResults] = useState<UserIF[]>([]);

  const router = useRouter();

  useEffect(() => {
    console.log("Search Query:", searchQuery);
    async function getUsers() {
      const result = await searchUser(searchQuery);
      console.log("Search Results:", result);
      setSearchResults(result.users);
    }
    getUsers();
  }, [searchQuery]);

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  const handleViewProfile = (username:string) => {
    router.push(`/profile/${username}`);
  };


  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="text-blue-500" />
          Find Escapers
        </h2>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="flex items-center relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search escapers by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="bg-gray-900 border border-gray-700 rounded-md pl-10 pr-10 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {showResults && (
                <div className="absolute mt-2 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                  {searchQuery.length > 0 ? (
                    <div className="p-2">
                      {searchResults.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                          {searchResults.map((user) => (
                            <div
                              key={user.userId || user._id}
                              className="flex items-center justify-between px-3 py-2 hover:bg-gray-700 rounded-md cursor-pointer"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewProfile(user.username);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar.image}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">
                                    {user.username}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Level {user.stats.level} • {"view profile"}
                                  </div>
                                </div>
                              </div>
                              <button onClick={(e) =>{     e.stopPropagation(); handleViewProfile(user.username)}}  className="text-blue-400 hover:text-blue-300 p-1">
                                
                                <Eye size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-3 py-4 text-center text-gray-400">
                          No escapers found matching ~ {searchQuery} ~
                        </div>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 text-center text-sm text-gray-400">
              Search by username, level, specialty or badges to find fellow
              escapers and view their profiles
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
