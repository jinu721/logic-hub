"use client";

import React, { useEffect, useState } from "react";
import { banUser, getUsers } from "@/services/client/clientServices";
import UserModal from "./UserModal";
import Headers from "./Headers";
import UserToolbar from "./UserToolbar";
import UserGrid from "./UserGrid";
import UserList from "./UserList";
import { UserIF } from "@/types/user.types";
import Spinner from "@/components/shared/CustomLoader";
import Pagination from "@/components/shared/Pagination";
import DeleteConfirmationModal from "@/components/shared/Delete";

const UsersPage: React.FC = () => {
  const [activeTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selcetedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<UserIF[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewUser, setViewUser] = useState<UserIF | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchUsers = async (
    searchTerm: string,
    page: number,
    limit: number
  ) => {
    try {
      setIsLoading(true);
      const response = await getUsers(searchTerm, page, limit);
      console.log("Users", response);
      const data = response.users.users;
      setTotalItems(response.users.totalItems);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(searchTerm, currentPage, limit);
  }, [searchTerm, currentPage]);

  const handleViewUser = (user: UserIF) => {
    setViewUser(user);
    setShowItemModal(true);
  };

  const handleBanUser = async (userId: string) => {
    setSelectedUserId(userId);
    setShowConfirmModal(true);
  };

  const handleConfimModal = async () => {
    try {
      setIsLoading(true);
      await banUser(selcetedUserId);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === selcetedUserId
            ? { ...user, isBanned: !user.isBanned }
            : user
        )
      );
    } catch (error) {
      console.error(`Error banning :`, error);
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowItemModal(false);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="ml-20">
        <Headers activeTab={activeTab} filteredItems={users} />

        <div className="p-8">
          <UserToolbar
            activeTab={activeTab}
            items={users}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setShowItemModal={setShowItemModal}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state h-85 flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                No Items Found
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <UserGrid
                  key={user._id}
                  user={user}
                  handleViewUser={handleViewUser}
                  handleBanUser={handleBanUser}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <UserList
                  key={user._id}
                  user={user}
                  handleViewUser={handleViewUser}
                  handleBanUser={handleBanUser}
                />
              ))}
            </div>
          )}

          {!isLoading && users.length > 0 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          )}
        </div>
      </div>

      {showItemModal && viewUser && (
        <UserModal
          user={viewUser}
          setShowItemModal={setShowItemModal}
          onClose={handleCloseModal}
          onBanUser={handleBanUser}
        />
      )}
      {showConfirmModal && (
        <DeleteConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleConfimModal}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default UsersPage;
