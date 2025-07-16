import React from "react";
import { Bell, Search, Settings, X } from "lucide-react";
import { ConversationIF } from "@/types/conversation.types";
import { UserIF } from "@/types/user.types";


interface Props {
  isGroupChat: boolean;
  currentConversationData: ConversationIF;
  otherUser: UserIF | null;
  setShowUserInfo: (show: boolean) => void;
}

const formatDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ChatInfoPanel: React.FC<Props> = ({
  isGroupChat,
  currentConversationData,
  otherUser,
  setShowUserInfo,
}) => {
  const group = currentConversationData.group;

  const avatarContent = isGroupChat
    ? group?.image ? (
        <img
          src={group.image}
          alt="Group"
          className="w-full h-full object-cover"
        />
      ) : (
        group?.name?.[0] || "G"
      )
    : otherUser?.avatar ? (
        <img
          src={otherUser.avatar.image}
          alt="User"
          className="w-full h-full object-cover"
        />
      ) : (
        otherUser?.username?.[0] || "U"
      );

  return (
    <div className="p-4 border-b border-gray-700 flex flex-col items-center relative">
      <button
        onClick={() => setShowUserInfo(false)}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>

      <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-semibold overflow-hidden">
        {avatarContent}
      </div>

      <h3 className="mt-4 font-semibold text-lg">
        {isGroupChat ? group?.name : otherUser?.username}
      </h3>

      <p className="text-sm text-gray-400">
        {isGroupChat
          ? `Created on ${formatDate(group?.createdAt || new Date())}`
          : otherUser?.isOnline
          ? "Online"
          : "Offline"}
      </p>

      <div className="flex items-center mt-4 space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
          <Search size={18} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInfoPanel;
