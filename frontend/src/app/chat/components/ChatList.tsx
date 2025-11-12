import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Search } from "lucide-react";
import { ConversationIF } from "@/types/conversation.types";

interface Props {
  activeTab: "groups" | "personal";
  currentUsersChats: ConversationIF[];
  selectedChatId: string;
  currentUserId: string;
  loading: boolean;
  handleTabChange: (tab: "groups" | "personal") => void;
  handleChatSelection: (chatId: string) => void;
  handleNewGroup: () => void;
  handleSearchChats: (searchTerm: string) => void;
}

const ChatList: React.FC<Props> = ({
  activeTab,
  currentUsersChats,
  selectedChatId,
  currentUserId,
  loading,
  handleTabChange,
  handleChatSelection,
  handleNewGroup,
  handleSearchChats,
}) => {
  const filteredChats = currentUsersChats.filter((chat) =>
    activeTab === "groups" ? chat.type === "group" : chat.type === "one-to-one"
  );

  console.log("FILTERED CHATS", filteredChats);


  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Link
              href="/home"
              className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-lg font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
          <div>
            <h3 className="font-semibold">Chats</h3>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            onChange={(e) => handleSearchChats(e.target.value)}
            placeholder="Search..."
            className="w-full bg-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="flex border-b border-gray-700">
        <button
          onClick={() => handleTabChange("groups")}
          className={`flex-1 cursor-pointer py-3 text-sm font-medium ${
            activeTab === "groups"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400"
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => handleTabChange("personal")}
          className={`flex-1 cursor-pointer py-3 text-sm font-medium ${
            activeTab === "personal"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400"
          }`}
        >
          Personal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">
            {activeTab === "groups" ? "Groups" : "Personal"}
          </h3>
          {loading ? (
            <div className="flex items-center p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-700">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-lg font-semibold text-white">
                {activeTab === "groups" ? "G" : "P"}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{"Loading..."}</h4>
                </div>
              </div>
            </div>
          ) : filteredChats.length > 0 ? (
            filteredChats
              .sort((a, b) => {
                const aTime = a.latestMessage?.createdAt
                  ? new Date(a.latestMessage.createdAt).getTime()
                  : 0;
                const bTime = b.latestMessage?.createdAt
                  ? new Date(b.latestMessage.createdAt).getTime()
                  : 0;
                return bTime - aTime;
              })
              .map((chat) => (
                <div
                  key={chat._id}
                  className={`flex items-center p-3 rounded-lg mb-2 cursor-pointer transition-all duration-200 ${
                    selectedChatId === chat._id
                      ? "bg-gray-700 ring-1 ring-purple-500/50"
                      : "hover:bg-gray-700/80"
                  }`}
                  onClick={() => handleChatSelection(chat._id)}
                >
                  <div className="relative">
                    {chat.type === "group" && chat.group?.image ? (
                      <img
                        src={chat.group.image}
                        alt="Group"
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    ) : chat.type === "one-to-one" && chat.otherUser?.avatar ? (
                      <img
                        src={chat.otherUser.avatar.image}
                        alt="User"
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-semibold text-white">
                        {chat.type === "group" && chat.group
                          ? chat.group.name?.[0] || "G"
                          : chat.type === "one-to-one" && chat.otherUser
                          ? chat.otherUser.username?.[0] || "U"
                          : "C"}
                      </div>
                    )}

                    {chat.type === "one-to-one" && chat.otherUser && (
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 ${
                          chat.otherUser.isOnline
                            ? "bg-green-500"
                            : "bg-gray-500"
                        } rounded-full border-2 border-gray-800`}
                      />
                    )}
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-white truncate">
                        {chat.type === "group" && chat.group
                          ? chat.group.name
                          : chat.type === "one-to-one" && chat.otherUser
                          ? chat.otherUser.username
                          : "Chat"}
                      </h4>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                        {chat.latestMessage?.createdAt
                          ? new Date(
                              chat.latestMessage.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-row space-x-1 flex-1 min-w-0">
                        {chat.typingUsers.length > 0 ? (
                          <p className="text-sm text-purple-400 font-medium truncate">
                            {chat.typingUsers.map((user, index) => (
                              <span key={user.userId}>
                                {user.username}
                                {index < chat.typingUsers.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}{" "}
                            is typing...
                          </p>
                        ) : (
                          <>
                            <p className="text-sm text-purple-400 font-medium flex-shrink-0">
                              {chat.type === "group" &&
                                chat.latestMessage?.sender.username}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {chat.latestMessage?.type === "text"
                                ? chat.latestMessage.content
                                : chat.latestMessage?.type === "image"
                                ? "Image"
                                : chat.latestMessage?.type === "audio"
                                ? "Audio"
                                : chat.latestMessage?.type === "sticker"
                                ? "Sticker"
                                : "No messages yet"}
                            </p>
                          </>
                        )}
                      </div>

                      {chat.unreadCounts &&
                        chat.unreadCounts[currentUserId] > 0 && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium ml-2 flex-shrink-0">
                            {chat.unreadCounts[currentUserId]}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-700">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-lg font-semibold text-white">
                {activeTab === "groups" ? "G" : "P"}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{"No chats available"}</h4>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleNewGroup}
          className="w-full cursor-pointer py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium flex items-center justify-center transition-colors"
        >
          <MessageSquare size={18} className="mr-2" />
          New Group
        </button>
      </div>
    </>
  );
};

export default ChatList;
