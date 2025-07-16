"use client";

import React, { useEffect, useState } from "react";

import ItemModal from "./ItemModal";
import DeleteConfirmationModal from "@/components/shared/Delete";
import { useToast } from "@/context/Toast";
import Headers from "./Headers";
import InventoryToolbar from "./InventoryToolbar";
import InventoryGrid from "./InventoryGrid";
import InventoryList from "./InventoryList";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "@/services/client/clientServices";
import { InventoryIF } from "@/types/inventory.types";
import Pagination from "@/components/shared/Pagination";
import Spinner from "@/components/shared/CustomLoader";

const AdminInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"avatars" | "banners" | "badges">(
    "avatars"
  );
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemToEdit, setItemToEdit] = useState<InventoryIF | null>(null);
  const [items, setItems] = useState<InventoryIF[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 3;

  const { showToast } = useToast() as any;

  const fetchItems = async (
    type: string,
    searchTerm: string,
    page: number,
    limit: number
  ) => {
    try {
      setIsLoading(true);
      const response = await getItems(type, searchTerm, page, limit);
      const data = response.data;
      console.log("Items", data);
      setTotalItems(data.length);
      setItems(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(activeTab, searchTerm, currentPage, limit);
  }, [searchTerm, currentPage,activeTab]);

  useEffect(() => {});

  const handleEditItem = (item: InventoryIF) => {
    console.log("clicked");
    console.log(item);
    setItemToEdit(item);
    setShowItemModal(true);
  };

  const handleDeleteItem = async (itemId: string) => {
    setDeleteModalOpen(true);
    setDeleteItemId(itemId);
  };

  const handleConformModal = async () => {
    if (!deleteItemId) return;
    try {
      setIsLoading(true);
      await deleteItem(activeTab, deleteItemId);
      setItems(items.filter((item) => item._id !== deleteItemId));
      showToast({
        type: "success",
        message: "InventoryIF deleted successfully",
        duration: 3000,
      });
      setDeleteModalOpen(false);
    } catch (error) {
      console.error(`Error deleting ${activeTab}:`, error);
      showToast({
        type: "error",
        message: "Error deleting item",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemSaved = async (newItem: InventoryIF, isEdit: boolean) => {
    try {
      if (isEdit) {
        setItems((prev) =>
          prev.map((item) => (item._id === newItem._id ? newItem : item))
        );
        await updateItem(activeTab, newItem._id as string, newItem);
      } else {
        setItems((prev) => [newItem, ...prev]);
        console.log("Create");
        console.log(activeTab, newItem);
        await createItem(activeTab, newItem);
      }
      setShowItemModal(false);
      setItemToEdit(null);
    } catch (error: any) {
      console.log(error);
      showToast({ type: "error", message: "Error saving item" });
    }
  };

  const handleCloseModal = () => {
    setShowItemModal(false);
    setItemToEdit(null);
  };

  return (
    <>
      <div className="bg-gray-950 text-white min-h-screen">
        <div className="ml-20">
          <Headers activeTab={activeTab} setActiveTab={setActiveTab} items={items} />

          <div className="p-8">
            <InventoryToolbar
              activeTab={activeTab}
              items={items}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setItemToEdit={setItemToEdit}
              setShowItemModal={setShowItemModal}
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : items.length === 0 ? (
              <div className="empty-state h-85 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  No {activeTab.slice(0, -1)} Found
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <InventoryGrid
                currentItems={items}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}
              />
            ) : (
              <InventoryList
                currentItems={items}
                handleEditItem={handleEditItem}
                handleDeleteItem={handleDeleteItem}
              />
            )}
            {!isLoading && items.length > 0 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
              />
            )}
          </div>
        </div>

        {showItemModal && (
          <ItemModal
            type={activeTab}
            onClose={handleCloseModal}
            onSave={handleItemSaved}
            itemToEdit={itemToEdit as InventoryIF | undefined}
          />
        )}
      </div>

      {deleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConformModal}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default AdminInventory;
