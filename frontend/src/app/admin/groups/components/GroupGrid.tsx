import React from 'react';
import { Eye, Ban, Check, Users, Calendar, Lock, Globe, User } from 'lucide-react';
import { GroupIF } from '@/types/group.types';



type Props = {
  groups: GroupIF[];
  handleViewGroup: (group: GroupIF) => void;
  handleToggleGroupStatus: (id: string) => void;
};

const GroupGrid: React.FC<Props> = ({ groups, handleViewGroup, handleToggleGroupStatus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div
          key={group._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-32 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/50 to-purple-600/50 mix-blend-overlay opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
            {group.image ? (
              <img
                src={group.image}
                alt="Group banner"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {group.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                !group.isDeleted ? 'bg-green-500/70 text-gray-100' : 'bg-red-500/70 text-green-100'
              }`}
            >
              {!group.isDeleted ? 'Active' : 'Inactive'}
            </div>
          </div>

          <div className="flex flex-col items-center -mt-10 relative z-10 px-6">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-gray-900 mb-3 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
              {group.groupType === 'public-approval' ? (
                <Lock size={30} className="text-white" />
              ) : (
                <Globe size={30} className="text-white" />
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors text-center">
              {group.name}
            </h3>

            <div className="mb-2 flex items-center space-x-2">
              <User size={14} className="text-gray-400" />
              <p className="text-gray-400 text-sm">{group.createdBy.username}</p>
            </div>

            <p className="text-gray-400 mb-4 line-clamp-2 text-center">
              {group.description || 'No description available'}
            </p>

            <div className="flex justify-between w-full mb-2">
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Users size={14} />
                <span>{group.memberCount} members</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Calendar size={14} />
                <span>{new Date(group.createdAt ? group.createdAt : Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center w-full mb-6">
              <div className="text-gray-500 text-sm">ID: {group._id?.substring(0, 8)}...</div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewGroup(group)}
                  className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-indigo-600/30"
                >
                  <Eye size={16} className="text-white" />
                </button>
                <button
                  onClick={() => handleToggleGroupStatus(group._id || "")}
                  className={`bg-gray-800 ${
                    !group.isDeleted ? 'hover:bg-amber-600' : 'hover:bg-green-600'
                  } p-2 rounded-lg transition-all duration-300 hover:shadow-lg`}
                >
                  {!group.isDeleted ? (
                    <Ban size={16} className="text-white" />
                  ) : (
                    <Check size={16} className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupGrid;
