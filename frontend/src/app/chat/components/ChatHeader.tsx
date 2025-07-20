import React from "react";
import { Info, Menu, X } from "lucide-react";
import { ConversationIF } from "@/types/conversation.types";
import { useRouter } from "next/navigation";


interface Props {
  isGroupChat: boolean;
  showSidebar: boolean;
  showUserInfo: boolean;
  conversationData: ConversationIF;
  currentConversationData: ConversationIF;
  onlineStatus: boolean;
  setShowSidebar: (value: boolean) => void;
  setShowUserInfo: (value: boolean) => void;
  formatLastSeenAgo: (lastSeen?: Date | string) => string;
}

const ChatHeader: React.FC<Props> = ({
  isGroupChat,
  showSidebar,
  showUserInfo,
  currentConversationData,
  setShowSidebar,
  onlineStatus,
  setShowUserInfo,
  formatLastSeenAgo,
}) => {
  const router = useRouter();
  const onlineCount = currentConversationData && currentConversationData.participants?.filter(
    (p) => p.isOnline
  ).length || 0;

  const totalParticipants = currentConversationData && currentConversationData.participants?.length || 0;

  const group = currentConversationData && currentConversationData.group;
  const user = currentConversationData && currentConversationData.otherUser;
  return (
    <div className="h-16 border-b border-gray-700 px-4 flex items-center justify-between bg-gray-800">
      <div className="flex items-center">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-1 mr-4 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
        >
          {showSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="flex items-center">
          {isGroupChat ? (
            group?.image ? (
              <img
                src={group.image}
                className="w-10 h-10 rounded-full object-cover"
                alt="Group"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-semibold text-white">
                {group?.name?.[0] || "G"}
              </div>
            )
          ) : user?.avatar ? (
            <img
             onClick={() => router.push(`/profile/${user.username}`)}
              src={user.avatar.image}
              className="w-10 h-10 cursor-pointer rounded-full object-cover"
              alt="User"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-semibold text-white">
              {user?.username?.[0] || "U"}
            </div>
          )}

          <div className="ml-3">
            <h3 className="font-semibold">
              {isGroupChat ? group?.name : user?.username}
            </h3>
            <div className="flex items-center text-xs text-gray-400">
              {!isGroupChat && onlineStatus && (
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              )}
              {isGroupChat
                ? `${onlineCount} online • ${totalParticipants} members`
                : onlineStatus
                ? "Online"
                : formatLastSeenAgo(String(user?.lastSeen))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">

        <button
          onClick={() => setShowUserInfo(!showUserInfo)}
          className={`p-2 rounded-full transition-colors ${
            showUserInfo
              ? "bg-purple-600 text-white"
              : "hover:bg-gray-700 text-gray-400 hover:text-white"
          }`}
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
