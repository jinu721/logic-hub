"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Image,
  Badge,
} from "lucide-react";
import MarketItemModal from "./MarketItemModal";
import {
  createMarketItem,
  deleteMarketItem,
  updateMarketItem,
  getMarketItems,
  getItems,
} from "@/services/client/clientServices";
import socket from "@/utils/socket.helper";
import { useToast } from "@/context/Toast";
import DeleteConfirmationModal from "@/components/shared/Delete";
import Headers from "./Headers";
import MarketToolbar from "./MarketToolbar";
import MarketGrid from "./MarketGrid";
import MarketList from "./MarketList";
import { MarketItemIF } from "@/types/market.types";
import Spinner from "@/components/shared/CustomLoader";
import Pagination from "@/components/shared/Pagination";
import { InventoryIF } from "@/types/inventory.types";

const MarketManagement: React.FC = () => {
  const [showMarketItemModal, setShowMarketItemModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [marketItemToEdit, setMarketItemToEdit] = useState<MarketItemIF | null>(
    null
  );
  const [marketItems, setMarketItems] = useState<MarketItemIF[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [availableItems, setAvailableItems] = useState<InventoryIF[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItemType, setSelectedItemType] = useState("avatars");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemID] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { showToast } = useToast() as any;

  const fetchMarketItems = async (
    searchTerm: string,
    selectedCategory: string,
    page: number,
    limit: number
  ) => {
    try {
      setIsLoading(true);
      const response = await getMarketItems({searchQuery:searchTerm,category:selectedCategory}, page, limit);
      console.log("Market Items", response);
      const data = response.marketItems;
      setTotalItems(response.totalItems);
      setMarketItems(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketItems(searchTerm,selectedCategory, currentPage, limit);
  }, [searchTerm,selectedCategory, currentPage]);


  useEffect(()=>{
    const fetchAvailableItems = async () => {
      try {
        const response = await getItems(selectedItemType, "", 1, 100);
        console.log("Available Items", response);
        setAvailableItems(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchAvailableItems();
  },[selectedItemType])



  const categoryIcons: Record<string, React.ReactNode> = {
    avatar: <Users size={18} />,
    banner: <Image size={18} />,
    badge: <Badge size={18} />,
  };

  const categoryColors: Record<string, string> = {
    avatar: "bg-purple-500/70 text-purple-100",
    banner: "bg-blue-500/70 text-blue-100",
    badge: "bg-green-500/70 text-green-100",
  };

  const handleEditMarketItem = (item: MarketItemIF) => {
    setMarketItemToEdit(item);
    setShowMarketItemModal(true);
  };

  const handleDeleteMarketItem = (itemId: string) => {
    setSelectedItemID(itemId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmModal = async () => {
    if (!selectedItemId) return;
    setIsLoading(true);
    try {
      await deleteMarketItem(selectedItemId);
      setMarketItems((prev) =>
        prev.filter((item) => item._id !== selectedItemId)
      );
      showToast({
        type: "success",
        message: "Item deleted successfully",
        duration: 3000,
      });
      setDeleteModalOpen(false);
    } catch {
      showToast({
        type: "error",
        message: "Error deleting item",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketItemSaved = async (
    newItem: MarketItemIF,
    itemId?: string
  ) => {
    try {
      if (itemId) {
        await updateMarketItem(itemId, newItem);
        setMarketItems((prev) =>
          prev.map((item) => (item._id === itemId ? newItem : item))
        );
      } else {
        await createMarketItem(newItem);
        setMarketItems((prev) => [newItem, ...prev]);
        socket.emit("admin_add_market_item", newItem);
      }
    } catch {
      showToast({
        type: "error",
        message: "Error saving item",
        duration: 3000,
      });
    }
    setShowMarketItemModal(false);
    setMarketItemToEdit(null);
  };

  const handleCloseModal = () => {
    setShowMarketItemModal(false);
    setMarketItemToEdit(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No expiration";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="bg-gray-950 text-white min-h-screen">
        <div className="ml-20">
          <Headers marketItems={marketItems} />

          <div className="p-8">
            <MarketToolbar
              marketItems={marketItems}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setSelectedCategory={setSelectedCategory}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setShowMarketItemModal={setShowMarketItemModal}
              setMarketItemToEdit={setMarketItemToEdit}
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : marketItems.length === 0 ? (
              <div className="empty-state h-85 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  No Items Found
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <MarketGrid
                marketItems={marketItems}
                categoryIcons={categoryIcons}
                categoryColors={categoryColors}
                handleEditMarketItem={handleEditMarketItem}
                handleDeleteMarketItem={handleDeleteMarketItem}
                formatDate={formatDate}
              />
            ) : (
              <MarketList
                marketItems={marketItems}
                categoryIcons={categoryIcons}
                categoryColors={categoryColors}
                handleEditMarketItem={handleEditMarketItem}
                handleDeleteMarketItem={handleDeleteMarketItem}
                formatDate={formatDate}
              />
            )}

            {marketItems.length > 0 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
              />
            )}
          </div>
        </div>

        {showMarketItemModal && (
          <MarketItemModal
            marketItem={marketItemToEdit as MarketItemIF}
            onSave={handleMarketItemSaved}
            onClose={handleCloseModal}
            setSelectedItemType={setSelectedItemType}
            availableItems={availableItems}
          />
        )}

        {deleteModalOpen && (
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirmModal}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );
};

export default MarketManagement;
