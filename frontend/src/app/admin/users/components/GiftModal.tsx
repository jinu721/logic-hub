import { Dispatch, SetStateAction } from "react";
import { Gift, X, Search } from "lucide-react";
import { InventoryIF } from "@/types/inventory.types";
import Spinner from "@/components/shared/CustomLoader";


interface GiftModalProps {
  giftType: string;
  inventoryItems: InventoryIF[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  inventoryLoading:boolean;
  setShowGiftModal: Dispatch<SetStateAction<boolean>>;
  handleGiftItem: (item: InventoryIF) => void;
}

const GiftModal = ({
  giftType,
  inventoryItems,
  searchQuery,
  setSearchQuery,
  setShowGiftModal,
  inventoryLoading,
  handleGiftItem,
}: GiftModalProps) => {
  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-900 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Gift size={18} className="mr-2 text-blue-400" />
            Gift {giftType.charAt(0).toUpperCase() + giftType.slice(1)}
          </h3>
          <button
            onClick={() => setShowGiftModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={`Search ${giftType}...`}
              className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <div className="overflow-y-auto max-h-64">
            {inventoryLoading ? (
                <Spinner/>
            ) :inventoryItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {inventoryItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    onClick={() => handleGiftItem(item)}
                  >
                    <div
                      className={`${
                        giftType === "banners" ? "h-24" : "h-20"
                      } w-full overflow-hidden bg-gray-800`}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <div className="text-white text-sm font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-gray-400 text-xs mt-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                {searchQuery
                  ? `No ${giftType} found matching "${searchQuery}"`
                  : `No ${giftType} available`}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-900 flex justify-end">
          <button
            onClick={() => setShowGiftModal(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;
