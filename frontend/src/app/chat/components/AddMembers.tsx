import { UserIF } from "@/types/user.types";
import { X, Search, Minus, Plus } from "lucide-react";

type Chat = {
  type: string;
  otherUser: UserIF;
};

type Conversation = {
  participants: UserIF[];
};

type AddMembersProps = {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedUsersAdd: UserIF[];
  handleRemoveUser: (userId: string) => void;
  handleAddUser: (user: UserIF) => void;
  handleAddSelectedMembers: () => void;
  setShowAddMembers: (value: boolean) => void;
  availableMembers: Chat[];
  currentConversationData: Conversation;
};

const AddMembers: React.FC<AddMembersProps> = ({
  searchText,
  setSearchText,
  selectedUsersAdd,
  handleRemoveUser,
  handleAddUser,
  handleAddSelectedMembers,
  setShowAddMembers,
  availableMembers,
  currentConversationData,
}) => (
  <div className="mb-6 bg-gray-700 p-3 rounded-lg">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-medium text-gray-300">Add Members</h3>
      <button
        onClick={() => setShowAddMembers(false)}
        className="text-gray-400 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>

    <div className="relative mb-3">
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search users..."
        className="w-full bg-gray-800 text-gray-300 text-sm rounded-md py-2 pl-8 pr-4 border border-gray-600 focus:outline-none focus:border-purple-500"
      />
      <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
    </div>

    {selectedUsersAdd.length > 0 && (
      <div className="mb-3">
        <p className="text-xs text-gray-400 mb-2">Selected Users:</p>
        <div className="flex flex-wrap gap-2">
          {selectedUsersAdd.map((user) => (
            <div
              key={user.userId}
              className="bg-gray-600 rounded-full px-3 py-1 flex items-center"
            >
              <span className="text-xs text-gray-200 mr-1">
                {user.username}
              </span>
              <button
                onClick={() => handleRemoveUser(user.userId)}
                className="text-gray-400 hover:text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="max-h-40 overflow-y-auto mb-3">
      {availableMembers
        .filter((user) => user.type === "one-to-one")
        .map((chat) => {
          const isAlreadyMember = currentConversationData.participants.some(
            (member) => member.userId === chat.otherUser.userId
          );
          const isSelected = selectedUsersAdd.some(
            (selected) => selected.userId === <chat className="otherUser use"></chat>
          );

          return (
            <div
              key={chat.otherUser.userId}
              className={`flex items-center justify-between p-2 hover:bg-gray-600 rounded-md ${
                isAlreadyMember ? "opacity-60" : "cursor-pointer"
              }`}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold">
                  {chat.otherUser.username?.[0] || "U"}
                </div>
                <span className="ml-2 text-sm">{chat.otherUser.username}</span>
              </div>

              {isAlreadyMember ? (
                <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                  Already in group
                </span>
              ) : isSelected ? (
                <button
                  onClick={() => handleRemoveUser(chat.otherUser.userId)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Minus size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleAddUser(chat.otherUser)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          );
        })}

      {availableMembers.length === 0 && (
        <div className="py-3 text-center text-sm text-gray-400">
          No users found
        </div>
      )}
    </div>

    <button
      onClick={handleAddSelectedMembers}
      disabled={selectedUsersAdd.length === 0}
      className={`w-full py-2 rounded-md text-sm font-medium ${
        selectedUsersAdd.length > 0
          ? "bg-purple-600 hover:bg-purple-700 text-white"
          : "bg-gray-600 text-gray-400 cursor-not-allowed"
      }`}
    >
      Add Selected Users
    </button>
  </div>
);

export default AddMembers;
