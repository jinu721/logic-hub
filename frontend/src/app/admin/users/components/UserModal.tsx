import React, { useState, useEffect } from 'react';
import { BadgeCheckIcon, X, Award, Image, User, Shield } from 'lucide-react';
import { getItems, giftItem } from '@/services/client/clientServices';
import socket from '@/utils/socket.helper';
import { useToast } from '@/context/Toast';
import UserInfo from './UserInfo';
import UserAvatars from './UserAvatars';
import { TabButton } from './TabButton';
import UserBadges from './UserBadges';
import UserBanners from './UserBanners';
import GiftModal from './GiftModal';
import { formatDate } from '@/utils/date.format';
import { UserIF } from '@/types/user.types';
import { InventoryIF } from '@/types/inventory.types';


type Props = {
  user:UserIF,
  setShowItemModal:React.Dispatch<React.SetStateAction<boolean>>,
  onClose:()=>void,
  onBanUser:(userId:string,status:boolean)=>void
}

const UserModal = ({ user,setShowItemModal,  onClose,  onBanUser }:Props) => {
  const [activeTab, setActiveTab] = useState("info");
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftType, setGiftType] = useState("avatars");
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItems,setInventoryItems] = useState([]);
  const [inventoryLoading,setInventryLoading] = useState(false);

  const {showToast} = useToast() as any;

  const fetchItems = async (type:string,search:string) => {
    try{
      setInventryLoading(true);
      const items = await getItems(type,search);
      setInventoryItems(items.data);
    }catch(err){
      console.log(err);
      showToast({type:"error",message:`Failed To Fetch ${type}`});
    }finally{
      setInventryLoading(false);
    }
  }


  
  useEffect(() => {
    fetchItems(giftType,searchQuery);
  },[searchQuery]);

  if (!user) return null;
  
  const handleGiftClick = (type:string) => {
    setGiftType(type);
    setSearchQuery("");
    fetchItems(type,searchQuery)
    setShowGiftModal(true);
  };

  const handleGiftItem = async(item:InventoryIF) => {
    try{
      await giftItem(giftType,item._id as string,user.userId);
      setShowGiftModal(false);
      setShowItemModal(false);
      showToast({
        type: "success",
        message: "Item gifted successfully",
        duration: 3000,
      })
      socket.emit("admin_gift_user", {item,userId:user.userId,type:giftType});
    }catch(err){
      console.log(`Error gift item: ${err}`);
      showToast({
        type: "error",
        message: "Error gift item",
        duration: 3000,
      })
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
        <div className="relative">
          <div className="h-36 md:h-48 overflow-hidden">
            {user.banner ? (
              <img src={user.banner.image} alt="User banner" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 flex items-center justify-center">
                <div className="text-white text-opacity-10 text-4xl font-bold">
                  {user.username}
                </div>
              </div>
            )}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-gray-900 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="absolute -bottom-16 left-6 md:left-8 flex flex-col items-center">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gray-800 p-1 shadow-lg overflow-hidden ring-4 ring-gray-800">
              {user.avatar ? (
                <img src={user.avatar.image} alt={user.username} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 rounded-full text-white text-3xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          <div className="absolute -bottom-14 left-32 md:left-44">
            <div className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-white">
                {user.username}
              </span>
              {user.isVerified && (
                <BadgeCheckIcon size={20} className="ml-2 text-blue-400" />
              )}
              {user.isBanned && (
                <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Banned
                </span>
              )}
            </div>
            <div className="text-gray-400 text-sm flex items-center">
              <span>ID: {user.userId.slice(0, 8)}...</span>
              <span className="mx-2">•</span>
              <span>{formatDate(user.timestamp)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-20 p-4 md:p-6 flex-grow overflow-y-auto">
          <div className="flex overflow-x-auto pb-2 space-x-1 md:space-x-2 mb-6 scrollbar-thin scrollbar-thumb-gray-700">
            <TabButton
              active={activeTab === "info"} 
              onClick={() => setActiveTab("info")}
              icon={<User size={16} />}
              label="Profile"
            />
            <TabButton 
              active={activeTab === "avatars"} 
              onClick={() => setActiveTab("avatars")}
              icon={<Image size={16} />}
              label="Avatars"
            />
            <TabButton 
              active={activeTab === "badges"} 
              onClick={() => setActiveTab("badges")}
              icon={<Award size={16} />}
              label="Badges"
            />
            <TabButton 
              active={activeTab === "banners"} 
              onClick={() => setActiveTab("banners")}
              icon={<Image size={16} />}
              label="Banners"
            />
          </div>

          {activeTab === "info" && (
            <UserInfo user={user} />
          )}

          {activeTab === "avatars" && (
            <UserAvatars user={user} handleGiftClick={handleGiftClick} />
          )}

          {activeTab === "badges" && (
            <UserBadges user={user} handleGiftClick={handleGiftClick} />
          )}

          {activeTab === "banners" && (
            <UserBanners user={user} handleGiftClick={handleGiftClick} />
          )}

        </div>
        
        <div className="p-4 bg-gray-900 flex flex-wrap gap-2 justify-end">
          <button
            onClick={() => onBanUser(user.userId, !user.isBanned)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
              user.isBanned
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {user.isBanned ? (
              <>
                <User size={16} className="mr-2" />
                Unban User
              </>
            ) : (
              <>
                <Shield size={16} className="mr-2" />
                Ban User
              </>
            )}
          </button>
        </div>
      </div>

      {showGiftModal && (
        <GiftModal 
          giftType={giftType}
          inventoryItems={inventoryItems}
          handleGiftItem={handleGiftItem}
          searchQuery={searchQuery}
          inventoryLoading={inventoryLoading}
          setSearchQuery={setSearchQuery}
          setShowGiftModal={setShowGiftModal}
        />
      )}
    </div>
  );
};



export default UserModal;