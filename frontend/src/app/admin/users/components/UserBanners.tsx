import React from "react";
import { CollectionCard } from "./CollectionCard";
import { UserIF } from "@/types/user.types";



interface UserBannersProps {
  user: UserIF;
  handleGiftClick: (type: "banners") => void;
}

const UserBanners: React.FC<UserBannersProps> = ({
  user,
  handleGiftClick,
}) => {
  const banners = user.inventory.ownedBanners || [];

  return (
    <CollectionCard
      title="Banner Collection"
      buttonText="Gift Banner"
      onButtonClick={() => handleGiftClick("banners")}
      itemCount={banners.length}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div
              key={index}
              className="bg-gray-700 rounded-lg overflow-hidden border border-transparent hover:border-blue-500 transition-colors"
            >
              <div className="h-24 w-full overflow-hidden">
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              </div>

              {user.banner && user.banner._id === banner._id && (
                <div className="bg-gray-800 p-2">
                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              )}

              <div className="p-2 text-sm text-gray-300">
                {
                  "Banner"
                }
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No banners owned</p>
        )}
      </div>
    </CollectionCard>
  );
};

export default UserBanners;
