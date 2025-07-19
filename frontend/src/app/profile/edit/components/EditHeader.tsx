import React, { useState } from "react";
import { Camera, X } from "lucide-react";
import { UserIF, User } from "@/types/user.types";
import { InventoryIF } from "@/types/inventory.types";

interface Props {
  userData: UserIF;
  user: User;
  currentBanner: string | null;
  currentAvatar: string | null;
  updateBanner: (item: InventoryIF) => void;
  updateAvatar: (item: InventoryIF) => void;
}

const EditHeader: React.FC<Props> = ({
  userData,
  user,
  currentBanner,
  currentAvatar,
  updateBanner,
  updateAvatar,
}) => {
  const [showBannerSelector, setShowBannerSelector] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const selectBanner = (item: InventoryIF) => {
    updateBanner(item);
    setShowBannerSelector(false);
  };

  const selectAvatar = (item: InventoryIF) => {
    updateAvatar(item);
    setShowAvatarSelector(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profile Banner
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Customize your profile appearance
            </p>
          </div>
          <button
            onClick={() => setShowBannerSelector(!showBannerSelector)}
            className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 border border-blue-500/20"
          >
            <Camera size={16} />
            Change Banner
          </button>
        </div>

        <div
          className="relative h-56 rounded-2xl bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 overflow-hidden border border-gray-700/50 backdrop-blur-sm"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {currentBanner ? (
            <>
              <img
                src={currentBanner}
                alt="Profile Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div
                onClick={() =>
                  selectBanner({
                    _id: "",
                    image: "",
                    description: "",
                    isActive: false,
                    name: "",
                    rarity: "Common",
                  })
                }
                className={`absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md cursor-pointer transform transition-all duration-300 ease-in-out hover:bg-red-500/80 ${
                  isHovering ? "scale-100 opacity-100" : "scale-75 opacity-60"
                }`}
              >
                <X
                  size={18}
                  className="text-white transition-transform duration-300 hover:rotate-90"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <Camera size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium">No banner selected</p>
                <p className="text-gray-500 text-sm">
                  Choose from your collection
                </p>
              </div>
            </div>
          )}
        </div>

        {showBannerSelector && (
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Select Banner</h3>
              <button
                onClick={() => setShowBannerSelector(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userData.inventory?.ownedBanners.map((item, index) => (
                <div
                  key={item._id}
                  className={`relative h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                    user.banner === item._id
                      ? "border-blue-500 shadow-lg shadow-blue-500/25"
                      : "border-gray-600/50 hover:border-blue-400/50"
                  }`}
                  onClick={() => selectBanner(item)}
                >
                  <img
                    src={item.image}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {user.banner === item._id && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="bg-blue-600 text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-6 mt-12">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profile Avatar
            </h2>
            <p className="text-gray-400 text-sm mt-1">Your unique identity</p>
          </div>
          <button
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 border border-blue-500/20"
          >
            <Camera size={16} />
            Change Avatar
          </button>
        </div>

        <div className="flex items-start gap-6">
          <div className="relative">
            {currentAvatar ? (
              <div
                className="relative"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {currentAvatar ? (
                  <>
                    <img
                      src={currentAvatar}
                      alt="Current Avatar"
                      className="w-32 h-32 rounded-2xl border-4 border-gray-700/50 object-cover shadow-xl"
                    />

                    <button
                      onClick={() =>
                        selectAvatar({
                          _id: "",
                          image: "",
                          description: "",
                          isActive: false,
                          name: "",
                          rarity: "Common",
                        })
                      }
                      className={`absolute top-0 right-0 p-2 rounded-full bg-black/60 backdrop-blur-md cursor-pointer transform transition-all duration-300 ease-in-out hover:bg-red-500/80 ${
                        isHovering
                          ? "scale-100 opacity-100"
                          : "scale-75 opacity-60"
                      }`}
                    >
                      <X
                        size={18}
                        className="text-white transition-transform duration-300 hover:rotate-90"
                      />
                    </button>
                  </>
                ) : (
                  <div className="w-32 h-32 rounded-2xl border-4 border-gray-700/50 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-xl">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                        <Camera size={32} />
                      </div>
                      <span className="text-gray-400 text-sm font-medium">
                        No Avatar
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl border-4 border-gray-700/50 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                    <Camera size={32} />
                  </div>
                  <span className="text-gray-400 text-sm font-medium">
                    No Avatar
                  </span>
                </div>
              </div>
            )}
          </div>

          {showAvatarSelector && (
            <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 flex-1 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Select Avatar</h3>
                <button
                  onClick={() => setShowAvatarSelector(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {userData.inventory?.ownedAvatars.map((item, index) => (
                  <div
                    key={item._id}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer group ${
                      user.avatar === item._id
                        ? "border-blue-500 shadow-lg shadow-blue-500/25"
                        : "border-gray-600/50 hover:border-blue-400/50"
                    }`}
                    onClick={() => selectAvatar(item)}
                  >
                    <img
                      src={item.image}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {user.avatar === item._id && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="bg-blue-600 h-4 w-4 rounded-full border-2 border-white shadow-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditHeader;
