import React from "react";
import { Edit, ChevronDown, UserCheck, Check} from "lucide-react";
import { GroupIF } from "@/types/group.types";
import { ConversationIF } from "@/types/conversation.types";


interface Props {
  userRole: "admin" | "owner" | "member";
  showEditGroup: boolean;
  setShowEditGroup: React.Dispatch<React.SetStateAction<boolean>>;
  groupUpdateData: Partial<GroupIF>;
  setGroupUpdateData: React.Dispatch<React.SetStateAction<Partial<GroupIF>>>;
  currentConversationData: ConversationIF;
  handleImageUploadGroup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveChanges: () => void;
  showJoinRequests: boolean;
  setShowJoinRequests: React.Dispatch<React.SetStateAction<boolean>>;
  handleRequestAprrove: (userId: string) => void;
}

const GroupAdminActions: React.FC<Props> = ({
  userRole,
  showEditGroup,
  setShowEditGroup,
  groupUpdateData,
  setGroupUpdateData,
  currentConversationData,
  handleImageUploadGroup,
  handleSaveChanges,
  showJoinRequests,
  setShowJoinRequests,
  handleRequestAprrove,
}) => {
  const isAdmin = userRole === "admin" || userRole === "owner";

  if (!isAdmin) return null;

  return (
    <div className="mb-4 space-y-4">
      <div>
        <button
          onClick={() => setShowEditGroup(!showEditGroup)}
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-700 mb-2"
        >
          <div className="flex items-center">
            <Edit size={16} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-300">Edit Group</span>
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              showEditGroup ? "rotate-180" : ""
            }`}
          />
        </button>

        {showEditGroup && (
          <div className="bg-gray-700 rounded-lg p-3 space-y-3 mb-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Group Name</label>
              <input
                type="text"
                value={groupUpdateData.name || ""}
                onChange={(e) =>
                  setGroupUpdateData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full bg-gray-800 text-gray-300 text-sm rounded-md py-2 px-3 border border-gray-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={groupUpdateData.description || ""}
                onChange={(e) =>
                  setGroupUpdateData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-gray-800 text-gray-300 text-sm rounded-md py-2 px-3 border border-gray-600 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Group Avatar</label>
              <div className="flex items-center space-x-3">
                {groupUpdateData.image ? (
                  <img
                    src={groupUpdateData.image}
                    alt={groupUpdateData.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-lg font-semibold">
                    {currentConversationData.group?.name?.[0] || "G"}
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  id="group-avatar"
                  onChange={handleImageUploadGroup}
                  className="hidden"
                />
                <label
                  htmlFor="group-avatar"
                  className="bg-gray-600 hover:bg-gray-500 text-xs text-white py-1 px-3 rounded-md cursor-pointer"
                >
                  Change Avatar
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Group Privacy</label>
              <div className="flex space-x-3">
                {["public-open", "public-approval"].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      value={type}
                      checked={groupUpdateData.groupType === type}
                      onChange={(e) =>
                        setGroupUpdateData((prev) => ({
                          ...prev,
                          groupType: e.target.value as "public-open" | "public-approval",
                        }))
                      }
                      className="hidden"
                    />
                    <div className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center mr-2">
                      {groupUpdateData.groupType === type && (
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      )}
                    </div>
                    <span className="text-xs capitalize">{type === "public-open" ? "Public" : "Private"}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveChanges}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowJoinRequests(!showJoinRequests)}
          className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-700 mb-2"
        >
          <div className="flex items-center">
            <UserCheck size={16} className="text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-300">Join Requests</span>
            { currentConversationData.group && currentConversationData.group.userRequests && currentConversationData.group.userRequests.length > 0 && (
              <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                {currentConversationData.group.userRequests.length}
              </span>
            )}
          </div>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${
              showJoinRequests ? "rotate-180" : ""
            }`}
          />
        </button>

        {showJoinRequests && (
          <div className="bg-gray-700 rounded-lg p-3 space-y-3 mb-3">
            { currentConversationData.group && currentConversationData.group.userRequests && currentConversationData.group.userRequests.length > 0 ? (
              currentConversationData.group.userRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-semibold">
                      {request.username?.[0] || "U"}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{request.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRequestAprrove(request._id)}
                    className="p-1 bg-purple-600 hover:bg-purple-700 rounded-md"
                  >
                    <Check size={14} className="text-white" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-2">No pending requests</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupAdminActions;
