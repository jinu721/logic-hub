"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Search,
} from "lucide-react";
import {
  getMarketItems,
  getMyProfile,
  purchaseMarketItem,
} from "@/services/client/clientServices";
import PurchaseConfirmationModal from "./ItemConform";
import { useToast } from "@/context/Toast";
import MarketItem from "./MarketItem";
import MarketTabs from "./MarketTabs";
import { MarketItemIF } from "@/types/market.types";
import Spinner from "@/components/shared/CustomLoader";

const BlackMarketPage = () => {
  const [userXP, setUserXP] = useState<number>(0);
  const [items, setItems] = useState<MarketItemIF[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [puchaseModal, setPurchaseModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<MarketItemIF | null>(null);
  const [userInventory, setUserInventory] = useState<{
    ownedAvatars: { _id: string }[];
    ownedBanners: { _id: string }[];
    ownedBadges: { _id: string }[];
  }>({
    ownedAvatars: [],
    ownedBanners: [],
    ownedBadges: [],
  });
  const [user, setUser] = useState<any>(null);

  const { showToast } = useToast() as any;

  const fetchItems = async (filter?: {category: string; searchQuery: string; sortOption: string}) => {
    try {
      setIsLoading(true);
      const itemData = await getMarketItems(filter,1,100);
      console.log("Items:", itemData);
      setItems(itemData.marketItems);
    } catch (error) {
      console.error("Error fetching items:", error);
      showToast({ type: "error", message: "Error fetching items" });
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getMyProfile();
        setUserXP(userData.user.stats.xpPoints);
        setUserInventory({
          ownedAvatars: userData.user.inventory.ownedAvatars,
          ownedBanners: userData.user.inventory.ownedBanners,
          ownedBadges: userData.user.inventory.ownedBadges,
        });
        setUser(userData.user);
        await fetchItems();
        console.log("User:", userData.user);
      } catch (error) {
        console.error("Error fetching items:", error);
        showToast({ type: "error", message: "Error fetching items" });
      }
    };
    fetchData();
  },[]);

  const handlePurchase = (item: MarketItemIF) => {
    setPurchaseModal(true);
    setSelectedItem(item);
  };

  const handleConfirmModal = async () => {
    try {
      if(!selectedItem) return;
      await purchaseMarketItem(selectedItem?._id as string);
      setUserXP(userXP - selectedItem?.costXP);
      if (selectedItem?.category === "avatar") {
        setUserInventory((prev:any) => ({
          ...prev,
          ownedAvatars: [...prev.ownedAvatars, selectedItem.itemId],
        }));
      } else if (selectedItem?.category === "banner") {
        setUserInventory((prev:any) => ({
          ...prev,
          ownedBanners: [...prev.ownedBanners, selectedItem.itemId],
        }));
      } else if (selectedItem?.category === "badge") {
        setUserInventory((prev:any) => ({
          ...prev,
          ownedBadges: [...prev.ownedBadges, selectedItem.itemId],
        }));
      }
      setSelectedItem(null);
      setPurchaseModal(false);
      showToast({
        type: "success",
        message: "Item purchased successfully!",
      });
    } catch (err: any) {
      showToast({
        type: "error",
        message: err.message || "Error Purchasing Item",
      });
    }
  };

  const handleFilterChange = (filter: {
    category: string;
    searchQuery: string;
    sortOption: string;
  }) => {
    if(user){
      fetchItems(filter); 
    }
  };

  const handleCloseModal = async () => {
    setPurchaseModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20 blur-3xl"></div>
          <div className="relative pt-16 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 p-1 rounded-lg mb-4">
                  <div className="bg-gray-900 px-4 py-1 rounded">
                    <span className="text-xs uppercase tracking-wider font-medium text-purple-300">
                      The Underground
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-blue-400 mb-2">
                  Black Market
                </h1>
                <p className="text-gray-300 text-lg max-w-lg">
                  Unleash your potential with exclusive items. Transform your
                  experience with premium rewards.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center bg-gray-800 bg-opacity-80 pl-6 pr-8 py-4 rounded-xl border border-gray-700 shadow-lg backdrop-blur-sm">
                  <div className="mr-4 relative">
                    <div className="absolute inset-0 bg-yellow-400 blur-md opacity-30 rounded-full"></div>
                    <Star className="h-8 w-8 text-yellow-400 relative z-10" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Your Balance</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {userXP.toLocaleString()} XP
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 -mt-12 pb-24">
          <MarketTabs filterChange={handleFilterChange} />

          <div className="mb-12">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items
                .filter((item) => item.limitedTime)
                .slice(0, 4)
                .map((item) => (
                  <MarketItem
                    key={item._id || item.name}
                    item={item}
                    userInventory={userInventory}
                    userXP={userXP}
                    onPurchase={handlePurchase}
                    isPremiumUser={user.membership.isActive}
                  />
                ))}
            </div>
          </div>

          <div>
            {isLoading ? (
              <Spinner />
            ) : items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <MarketItem
                    key={item._id || item.name}
                    item={item}
                    onPurchase={handlePurchase}
                    userInventory={userInventory}
                    userXP={userXP}
                    isPremiumUser={user.membership.isActive}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-800 bg-opacity-50 rounded-xl">
                <Search className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-400 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  Try adjusting your search or filters to find what youre
                  looking for
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {puchaseModal && (
        <PurchaseConfirmationModal
          isOpen={puchaseModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmModal}
          item={selectedItem}
          userXP={userXP}
          isPremiumUser={user.membership.isActive}
        />
      )}
    </>
  );
};

export default BlackMarketPage;

// const style = document.createElement("style");
// style.textContent = `
//   .hide-scrollbar::-webkit-scrollbar {
//     display: none;
//   }
//   .hide-scrollbar {
//     -ms-overflow-style: none;
//     scrollbar-width: none;
//   }
// `;
// document.head.appendChild(style);
