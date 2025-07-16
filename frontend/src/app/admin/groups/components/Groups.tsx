"use client";

import React, { useState, useEffect } from "react";
import GroupModal from "./GroupModal";
import socket from "@/utils/socket.helper";
import {
  getAllGroups,
  getConversation,
} from "@/services/client/clientServices";
import { useToast } from "@/context/Toast";
import Header from "./Headers";
import GroupToolbar from "./GroupToolbar";
import GroupGrid from "./GroupGrid";
import GroupList from "./GroupList";
import { GroupIF } from "@/types/group.types";
import Spinner from "@/components/shared/CustomLoader";
import Pagination from "@/components/shared/Pagination";

interface Conversation {
  _id: string;
  [key: string]: any;
}

const Groups: React.FC = () => {
  const [activeTab] = useState<string>("groups");
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
  const [groups, setGroups] = useState<GroupIF[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewGroup, setViewGroup] = useState<GroupIF | Record<string, never>>(
    {}
  );
  const [selectedConversation, setSelectedConversation] = useState<
    Conversation | Record<string, never>
  >({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;
  const [totalItems, setTotalItems] = useState<number>(0);

  const { showToast } = useToast() as any;

  const fetchGroupData = async () => {
    setIsLoading(true);
    try {
      const data = await getAllGroups({
        search: searchTerm,
      });
      console.log("Group Data", data.data);
      setGroups(data.data.groups);
      setTotalItems(data.data.totalItems);
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
    fetchGroupData();
  }, [searchTerm]);

  useEffect(() => {
    const getConversationData = async () => {
      try {
        const data = await getConversation((viewGroup as any)._id);
        setSelectedConversation(data.data);
      } catch (err: any) {
        showToast({
          type: "error",
          message: err.message || "Error getting conversation",
          duration: 3000,
        });
      }
    };

    if (viewGroup && (viewGroup as GroupIF)._id) {
      getConversationData();
    }
  }, [viewGroup]);

  const handleViewGroup = (group: GroupIF) => {
    setViewGroup(group);
    setShowGroupModal(true);
  };

  const handleToggleGroupStatus = async (groupId: string) => {
    try {
      setIsLoading(true);
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group._id === groupId
            ? { ...group, isActive: !group.isDeleted }
            : group
        )
      );
      setIsLoading(false);
    } catch (error) {
      console.error(`Error toggling group status:`, error);
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone."
      )
    ) {
      try {
        setIsLoading(true);
        setGroups((prevGroups) =>
          prevGroups.filter((group) => group._id !== groupId)
        );
        setIsLoading(false);
      } catch (error) {
        console.error(`Error deleting group:`, error);
        setIsLoading(false);
      }
    }
  };

  const handleGroupSaved = (updatedGroup: GroupIF, isEdit: boolean) => {
    if (isEdit) {
      socket.emit("update_group", {
        type: "edit_group_info",
        conversationId: (selectedConversation as Conversation)._id,
        groupId: (viewGroup as GroupIF)._id,
        newGroupData: updatedGroup,
      });
      setGroups(
        groups.map((group) =>
          group._id === updatedGroup._id ? updatedGroup : group
        )
      );
    } else {
      setGroups([updatedGroup, ...groups]);
    }
    setShowGroupModal(false);
  };

  const handleCloseModal = () => {
    setShowGroupModal(false);
    setViewGroup({});
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="ml-20">
        <Header groups={groups} />
        <div className="p-8">
          <GroupToolbar
            activeTab={activeTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            groups={groups}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
          ) : groups.length === 0 ? (
            <div className="empty-state h-85 flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                No Items Found
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <GroupGrid
              groups={groups}
              handleViewGroup={handleViewGroup}
              handleToggleGroupStatus={handleToggleGroupStatus}
            />
          ) : (
            <GroupList
              groups={groups}
              handleViewGroup={handleViewGroup as any}
              handleToggleGroupStatus={handleToggleGroupStatus}
              handleDeleteGroup={handleDeleteGroup}
            />
          )}

          {!isLoading && groups.length > 0 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          )}
        </div>
      </div>

      {showGroupModal && (
        <GroupModal
          group={viewGroup as GroupIF}
          onClose={handleCloseModal}
          onSave={handleGroupSaved as any}
          isEdit={Object.keys(viewGroup).length > 0}
          onDelete={handleDeleteGroup}
        />
      )}
    </div>
  );
};

export default Groups;
