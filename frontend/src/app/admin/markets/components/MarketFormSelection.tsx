import React from "react";
import { AlertCircle, Check } from "lucide-react"; 
import { InventoryIF } from "@/types/inventory.types";

type ErrorsType = {
  itemId?: string;
};

type Props = {
  formData: any;
  errors: ErrorsType;
  availableItems: InventoryIF[];
  selectedItem?: InventoryIF | null;
  handleItemSelect: (item: InventoryIF) => void;
};

const MarketFormSelection: React.FC<Props> = ({
  formData,
  errors,
  availableItems,
  selectedItem,
  handleItemSelect,
}) => {
  const capitalizedCategory =
    formData.category.charAt(0).toUpperCase() + formData.category.slice(1);

  const isAvatar = formData.category === 'avatar';
  const isBadge = formData.category === 'badge';
  const isBanner = formData.category === 'banner';

  const getItemImageClasses = () => {
    if (isAvatar) {
      return "w-12 h-12 rounded-full";
    } else if (isBadge) {
      return "w-12 h-12 rounded-lg";
    } else if (isBanner) {
      return "w-full h-16 rounded-md";
    }
    return "w-12 h-12 rounded-lg";
  };

  const getContainerClasses = () => {
    if (isBanner) {
      return "grid grid-cols-1 sm:grid-cols-2 gap-3";
    }
    return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3";
  };

  const getItemClasses = (isSelected: boolean) => {
    const baseClasses = "p-3 rounded-lg cursor-pointer border transition-all hover:scale-105";
    const selectedClasses = isSelected 
      ? "bg-indigo-900/40 border-indigo-500 shadow-lg shadow-indigo-500/20"
      : "bg-gray-800/50 border-gray-700 hover:border-gray-600";
    
    if (isBanner) {
      return `${baseClasses} ${selectedClasses}`;
    }
    return `${baseClasses} ${selectedClasses} text-center`;
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Select {capitalizedCategory} Item
        </h3>

        {errors.itemId && (
          <div className="mb-3 p-2 bg-red-900/30 rounded-lg border border-red-500/30 flex items-start">
            <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5" />
            <p className="text-sm text-red-400">{errors.itemId}</p>
          </div>
        )}

        {availableItems.length > 0 ? (
          <div className={getContainerClasses()}>
            {availableItems.map((item) => {
              const isSelected = formData.itemId === item._id;

              return (
                <div
                  key={item._id}
                  onClick={() => handleItemSelect(item)}
                  className={getItemClasses(isSelected)}
                >
                  {isBanner ? (
                    // Banner layout - horizontal
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className={getItemImageClasses()}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate font-medium">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          ID: {(item._id as string).substring(0, 6)}...
                        </div>
                      </div>
                      {isSelected && (
                        <div className="bg-indigo-500 rounded-full p-1 flex-shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                  ) : (
                    // Avatar/Badge layout - vertical compact
                    <>
                      <div className="relative mb-2">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className={`${getItemImageClasses()} mx-auto object-cover bg-gray-800 border border-gray-700`}
                        />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 bg-indigo-500 rounded-full p-1">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-white truncate font-medium mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {(item._id as string).substring(0, 6)}...
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-gray-800/30 rounded-lg border border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              No {formData.category} items available. Please add some items first.
            </p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-900/30">
          <h4 className="text-indigo-400 font-medium text-sm mb-2">Selected Item</h4>
          <div className="flex items-center space-x-3">
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className={`${getItemImageClasses()} object-cover bg-gray-800 border border-gray-700 flex-shrink-0`}
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-medium text-sm truncate">
                {selectedItem.name}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {capitalizedCategory} • ID: {formData.itemId.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketFormSelection;