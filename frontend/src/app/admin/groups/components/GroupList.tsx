import React from 'react';
import { Eye, Ban, Check, Trash, Lock, Globe, User, Users, Calendar } from 'lucide-react';
import { GroupIF } from '@/types/group.types';


type Props = {
  groups: GroupIF[];
  handleViewGroup: (group: GroupIF) => void;
  handleToggleGroupStatus: (id: string) => void;
  handleDeleteGroup: (id: string) => void;
};

const GroupList: React.FC<Props> = ({
  groups,
  handleViewGroup,
  handleToggleGroupStatus,
  handleDeleteGroup,
}) => {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group._id}
          className="group bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 flex items-center hover:shadow-lg hover:shadow-indigo-600/10 transition-all duration-300 border border-indigo-900/30 hover:border-indigo-500/70"
        >
          <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-indigo-500/50 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
            {group.groupType === 'public-approval' ? (
              <Lock size={24} className="text-white" />
            ) : (
              <Globe size={24} className="text-white" />
            )}
          </div>

          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {group.name}
              </h3>
            </div>
            <p className="text-gray-400 text-sm line-clamp-1">
              {group.description || 'No description available'}
            </p>
            <div className="flex space-x-4 mt-1 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <User size={12} />
                <span>{group.createdBy.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={12} />
                <span>{group.memberCount} members</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={12} />
                <span>{new Date(group.createdAt ? group.createdAt : Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                group.groupType === 'public-approval'
                  ? 'bg-purple-600/70 text-purple-100'
                  : 'bg-blue-600/70 text-blue-100'
              }`}
            >
              {group.groupType === 'public-approval' ? 'Private' : 'Public'}
            </div>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                !group.isDeleted
                  ? 'bg-green-500/70 text-gray-100'
                  : 'bg-red-500/70 text-gray-100'
              }`}
            >
              {!group.isDeleted ? 'Active' : 'Inactive'}
            </div>

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
              <button
                onClick={() => handleDeleteGroup(group._id || "")}
                className="bg-gray-800 hover:bg-red-600 p-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/30"
              >
                <Trash size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupList;
