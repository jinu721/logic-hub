import React from "react";
import { Eye, Ban } from "lucide-react";
import { UserIF } from "@/types/user.types";

interface Props {
  user: UserIF;
  handleViewUser: (user: UserIF) => void;
  handleBanUser: (userId: string) => void;
}

const UserGrid: React.FC<Props> = ({ user, handleViewUser, handleBanUser }) => {
  return (
    <div
      key={user._id}
      className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
    >
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {user.banner ? (
          <img
            src={user.banner.image}
            alt="User banner"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
            New Escaper
          </div>
        )}

        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
            user.isBanned
              ? "bg-red-500/70 text-green-100"
              : "bg-green-500/70 text-gray-100"
          }`}
        >
          {user.isBanned ? "Banned" : "Active"}
        </div>
      </div>

      <div className="flex flex-col items-center -mt-10 relative z-10 px-6">
        <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-gray-900 mb-3">
          {user.avatar ? (
            <img
              src={user.avatar.image}
              alt={user.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors text-center">
          {user.username}
        </h3>

        <div className="mb-2 flex items-center space-x-1">
          <div
            className={`w-3 h-3 rounded-full ${
              user.isVerified ? "bg-blue-500" : "bg-transparent"
            }`}
          ></div>
          <p className="text-gray-400 text-sm">
            {user.role || "Member"}
          </p>
        </div>

        <p className="text-gray-400 mb-6 line-clamp-2 text-center">
          {user.bio || "No bio available"}
        </p>

        <div className="flex justify-between items-center w-full mb-6">
          <div className="text-gray-500 text-sm">
            ID: {user._id?.substring(0, 8)}...
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
    </div>
  );
};

export default UserGrid;
