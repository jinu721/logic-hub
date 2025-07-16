import React from "react";
import { Eye, Ban, Check } from "lucide-react";
import { UserIF } from "@/types/user.types";

interface Props {
  user: UserIF;
  handleViewUser: (user: UserIF) => void;
  handleBanUser: (userId: string) => void;
}

const UserList: React.FC<Props> = ({ user, handleViewUser, handleBanUser }) => {
  return (
    <div
      key={user._id}
      className="group bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
    >
      <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-indigo-500/50">
        {user.avatar?.image ? (
          <img
            src={user.avatar.image}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
            {user.username}
          </h3>
          {user.isVerified && (
            <div className="ml-2 bg-blue-500 rounded-full p-1">
              <Check size={12} className="text-white" />
            </div>
          )}
        </div>
        <p className="text-gray-400 text-sm line-clamp-1">
          {user.bio || "No bio available"}
        </p>
      </div>

      <div className="flex items-center space-x-4">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
            user.role === "admin"
              ? "bg-purple-600/70 text-purple-100"
              : "bg-gray-700/70 text-gray-200"
          }`}
        >
          {user.role || "Member"}
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
            user.isBanned
              ? "bg-red-500/70 text-gray-100"
              : "bg-green-500/70 text-green-100"
          }`}
        >
          {user.isBanned ? "Banned" : "Active"}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleViewUser(user)}
            className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30"
          >
            <Eye size={16} className="text-white" />
          </button>
          <button
            onClick={() => handleBanUser(user._id)}
            className="bg-gray-800 hover:bg-red-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
          >
            <Ban size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
