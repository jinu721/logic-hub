"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Users,
  Code,
  Settings,
  LogOut,
  Trophy,
} from "lucide-react";

import LevelModal from "./LevelModal";
import {
  createLevel,
  deleteLevel,
  getLevels,
  updateLevel,
  getItems,
} from "@/services/client/clientServices";
import DeleteConfirmationModal from "@/components/shared/Delete";
import { useToast } from "@/context/Toast";
import Headers from "./Headers";
import LevelsToolbar from "./LevelToolbar";
import LevelsGrid from "./LevelGrid";
import LevelsList from "./LevelList";
import { LevelIF } from "@/types/level.types";
import Pagination from "@/components/shared/Pagination";
import Spinner from "@/components/shared/CustomLoader";
import { InventoryIF } from "@/types/inventory.types";

const LevelManagement: React.FC = () => {
  const [activeTab] = useState("levels");
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState<LevelIF | null>(null);
  const [levels, setLevels] = useState<LevelIF[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Inventory items for gift selection
  const [avatars, setAvatars] = useState<InventoryIF[]>([]);
  const [banners, setBanners] = useState<InventoryIF[]>([]);
  const [badges, setBadges] = useState<InventoryIF[]>([]);

  const { showToast } = useToast() as any;

  const fetchLevels = async (
    page: number,
    limit: number
  ) => {
    try {
      setIsLoading(true);
      const response = await getLevels(page, limit);
      console.log("Levels", response);
      const data = response.levels;
      setTotalItems(response.totalItems);
      setLevels(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch inventory items for gift selection
  const fetchInventoryItems = async () => {
    try {
      const [avatarsRes, bannersRes, badgesRes] = await Promise.all([
        getItems("avatar", "", 1, 100),
        getItems("banner", "", 1, 100),
        getItems("badge", "", 1, 100),
      ]);
      setAvatars(avatarsRes.data || []);
      setBanners(bannersRes.data || []);
      setBadges(badgesRes.data || []);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  useEffect(() => {
    fetchLevels(currentPage, limit);
    fetchInventoryItems();
  }, [currentPage]);

  const handleEditLevel = (level: LevelIF) => {
    setLevelToEdit(level);
    setShowLevelModal(true);
  };

  const handleDeleteLevel = (levelId: string) => {
    setLevelToDelete(levelId);
    setDeleteModalOpen(true);
  };

  const handleDeleteLevelConfirmModal = async () => {
    if (!levelToDelete) return;
    try {
      setIsLoading(true);
      await deleteLevel(levelToDelete);
      setLevels((prev) => prev.filter((lvl) => lvl._id !== levelToDelete));
      showToast({
        type: "success",
        message: "LevelIF deleted successfully",
        duration: 3000,
      });
    } catch {
      showToast({
        type: "error",
        message: "Error deleting level",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
      setLevelToDelete(null);
    }
  };

  const handleLevelSaved = async (newLevel: LevelIF, levelId?: string) => {
    try {
      if (levelId) {
        await updateLevel(levelId, newLevel);
        setLevels((prev) =>
          prev.map((lvl) => (lvl._id === levelId ? newLevel : lvl))
        );
        showToast({
          type: "success",
          message: "LevelIF updated successfully",
          duration: 3000,
        });
      } else {
        await createLevel(newLevel);
        setLevels((prev) => [newLevel, ...prev]);
        showToast({
          type: "success",
          message: "LevelIF created successfully",
          duration: 3000,
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        message: error?.response?.data?.message || "Error saving level",
        duration: 3000,
      });
    }
    setShowLevelModal(false);
    setLevelToEdit(null);
  };

  const handleCloseModal = () => {
    setShowLevelModal(false);
    setLevelToEdit(null);
  };

  const getLevelColor = (level: number) => {
    if (level <= 10) return "from-green-500 to-emerald-600";
    if (level <= 20) return "from-blue-500 to-indigo-600";
    if (level <= 30) return "from-indigo-500 to-purple-600";
    if (level <= 40) return "from-purple-500 to-pink-600";
    return "from-red-500 to-pink-600";
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-gray-950 border-r border-indigo-900/30 flex flex-col items-center py-8 z-20">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-600/30">
          <Package size={24} className="text-white" />
        </div>

        <div className="flex flex-col items-center space-y-6 mt-8">
          <button className="sidebar-btn">
            <Users size={20} />
          </button>
          <button className="sidebar-btn">
            <Code size={20} />
          </button>
          <button className="sidebar-btn active">
            <Trophy size={20} />
          </button>
          <button className="sidebar-btn">
            <Settings size={20} />
          </button>
        </div>

        <div className="mt-auto">
          <button className="w-12 h-12 bg-red-500/10 hover:bg-red-500/30 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-300">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="ml-20">
        <Headers activeTab={activeTab} levels={levels} />
        <div className="p-8">
          <LevelsToolbar
            levels={levels}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setLevelToEdit={setLevelToEdit}
            setShowLevelModal={setShowLevelModal}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
          ) : levels.length === 0 ? (
            <div className="empty-state h-85 flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                No Items Found
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <LevelsGrid
              levels={levels}
              getLevelColor={getLevelColor}
              handleEditLevel={handleEditLevel}
              handleDeleteLevel={handleDeleteLevel}
            />
          ) : (
            <LevelsList
              levels={levels}
              getLevelColor={getLevelColor}
              handleEditLevel={handleEditLevel}
              handleDeleteLevel={handleDeleteLevel}
            />
          )}

          {!isLoading && levels.length > 0 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          )}
        </div>
      </div>

      {showLevelModal && (
        <LevelModal
          level={levelToEdit as any}
          onSave={handleLevelSaved}
          onClose={handleCloseModal}
          avatars={avatars}
          banners={banners}
          badges={badges}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteLevelConfirmModal}
        isLoading={isLoading}
      />
    </div>
  );
};

export default LevelManagement;
