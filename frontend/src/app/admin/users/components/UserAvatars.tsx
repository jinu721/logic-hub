import React from "react";
import { CollectionCard } from "./CollectionCard";
import { UserIF } from "@/types/user.types";


interface UserAvatarsProps {
  user: UserIF;
  handleGiftClick: (type: "avatars") => void;
}

const UserAvatars: React.FC<UserAvatarsProps> = ({
  user,
  handleGiftClick,
}) => {
  const avatars = user.inventory.ownedAvatars || [];

  console.log("OWned Avatarsss",avatars)

  return (
    <CollectionCard
      title="Avatar Collection"
      buttonText="Gift Avatar"
      onButtonClick={() => handleGiftClick("avatars")}
      itemCount={avatars.length}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {avatars.length > 0 ? (
          avatars.map((avatar) => (
            <div key={avatar._id} className="group">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gray-700 overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-all mx-auto">
                <img
                  src={avatar.image}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                {user.avatar && user.avatar._id === avatar._id && (
                  <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                    <div className="backdrop-blur-2xl text-white text-xs rounded-full px-2 py-0.5">
                      Active
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center mt-2 text-sm text-gray-300 truncate">
                {"Avatar"}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No avatars owned</p>
        )}
      </div>
    </CollectionCard>
  );
};

export default UserAvatars;
