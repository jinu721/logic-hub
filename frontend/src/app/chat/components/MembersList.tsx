import { ConversationIF } from "@/types/conversation.types";
import { UserIF } from "@/types/user.types";
import { Crown, MoreVertical, Shield, UserMinus, UserPlus } from "lucide-react";
import React from "react";

interface Props {
  currentConversationData: ConversationIF;
  userRole: "admin" | "owner" | "member";
  showAllMembers: boolean;z
  setShowAllMembers: (value: boolean) => void;
  toggleMenu: (userId: string) => void;
  openMenuId: string | null;
  handleMakeAdmin: (userId: string) => void;
  handleRemoveAdmin: (userId: string) => void;
  handleRemoveMember: (userId: string) => void;
  canManageMember: (user: UserIF) => boolean;
  setShowAddMembers: (value: boolean) => void;
}

const MembersList: React.FC<Props> = ({
  currentConversationData,
  userRole,
  showAllMembers,
  setShowAllMembers,
  toggleMenu,
  openMenuId,
  handleMakeAdmin,
  handleRemoveAdmin,
  handleRemoveMember,
  canManageMember,
  setShowAddMembers,
}) => {
  const participants = currentConversationData?.participants || [];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-300">
          Members ({participants.length})
        </h3>
        {participants.length > 5 && (
          <button
            onClick={() => setShowAllMembers(!showAllMembers)}
            className="text-xs text-purple-400 hover:text-purple-300"
          >
            {showAllMembers ? "Show less" : "See all"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {(showAllMembers ? participants : participants.slice(0, 5)).map((member) => {
          const isOwner =
            currentConversationData.group?.createdBy?._id === member._id;
          const isAdmin = currentConversationData.group?.admins.some(
            (admin) => admin._id === member._id
          );

          return (
            <div
              key={member._id}
              className="flex items-center justify-between py-2 px-1 hover:bg-gray-800 rounded-md transition-colors"
            >
              <div className="flex items-center">
                <div className="relative">
                  {member.avatar?.image ? (
                    <img
                      src={member.avatar.image}
                      alt={member.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        isOwner
                          ? "bg-yellow-600"
                          : isAdmin
                          ? "bg-blue-600"
                          : "bg-green-600"
                      }`}
                    >
                      {member.username?.[0]?.toUpperCase() || "M"}
                    </div>
                  )}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                      member.isOnline ? "bg-green-500" : "bg-gray-500"
                    } rounded-full border-2 border-gray-800`}
                  ></div>
                </div>

                <div className="ml-3">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">{member.username}</h4>
                    {isOwner && (
                      <span className="ml-2 flex items-center text-xs text-yellow-400 font-medium">
                        <Crown size={12} className="mr-1" />
                      </span>
                    )}
                    {isAdmin && !isOwner && (
                      <span className="ml-2 flex items-center text-xs text-blue-400 font-medium">
                        <Shield size={12} className="mr-1" />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {canManageMember(member) && (
                <div className="relative">
                  <button
                    className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                    onClick={() => toggleMenu(member._id)}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenuId === member._id && (
                    <div className="absolute right-0 mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {userRole === "owner" && !isOwner && (
                          <>
                            {isAdmin ? (
                              <button
                                onClick={() => handleRemoveAdmin(member._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded-md"
                              >
                                <Shield size={14} className="mr-2 text-red-400" />
                                Remove Admin Role
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMakeAdmin(member._id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 rounded-md"
                              >
                                <Shield size={14} className="mr-2 text-blue-400" />
                                Make Admin
                              </button>
                            )}
                          </>
                        )}
                        {!isOwner && (
                          <button
                            onClick={() => handleRemoveMember(member._id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-md"
                          >
                            <UserMinus size={14} className="mr-2" />
                            Remove from Group
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(userRole === "admin" || userRole === "owner") && (
        <button
          onClick={() => setShowAddMembers(true)}
          className="flex items-center mt-4 text-sm text-purple-400 hover:text-purple-300"
        >
          <UserPlus size={16} className="mr-1" />
          Invite new members
        </button>
      )}
    </div>
  );
};

export default MembersList;
