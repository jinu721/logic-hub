import React from "react";
import {
  Upload,
  Lock,
  Globe,
  User,
  Calendar,
  Users,
  Trash,
  AlertTriangle,
} from "lucide-react";
import { GroupIF } from "@/types/group.types";


interface Errors {
  name?: string;
  description?: string;
}

interface Props {
  formData: GroupIF;
  mode: string;
  errors: Errors;
  totalMemberCount: number;
  deleteConfirm: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEdit: () => void;
  handleDeleteClick: () => void;
  setFormData: React.Dispatch<React.SetStateAction<GroupIF>>;
}

const GroupForm: React.FC<Props> = ({
  formData,
  mode,
  errors,
  totalMemberCount,
  deleteConfirm,
  handleChange,
  handleImageChange,
  handleEdit,
  handleDeleteClick,
  setFormData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1">
        <div className="flex flex-col items-center">
          <div className="mb-4 w-full aspect-square bg-gray-800 rounded-xl overflow-hidden border-2 border-dashed border-indigo-500/30 flex items-center justify-center relative">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Group image"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                {formData.groupType === "public-approval" ? (
                  <Lock size={64} className="text-indigo-400 mb-3" />
                ) : (
                  <Globe size={64} className="text-indigo-400 mb-3" />
                )}
                <p className="text-gray-400 text-sm">Group Logo</p>
              </div>
            )}

            {mode !== "view" && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200">
                  <Upload size={16} className="mr-2" />
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={mode === "view"}
                  />
                </label>
              </div>
            )}
          </div>

          {mode !== "create" && (
            <div className="w-full space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-indigo-900/30">
                <h4 className="text-white font-medium mb-3">Group Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User size={14} className="text-indigo-400 mr-2" />
                    <span className="text-gray-400">Created by:</span>
                    <span className="text-white ml-2">
                      {formData.createdBy.username}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className="text-indigo-400 mr-2" />
                    <span className="text-gray-400">Created on:</span>
                    <span className="text-white ml-2">
                      {new Date(formData?.createdAt as string).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users size={14} className="text-indigo-400 mr-2" />
                    <span className="text-gray-400">Members:</span>
                    <span className="text-white ml-2">{totalMemberCount}</span>
                  </div>
                </div>
              </div>

              {mode === "view" && (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors duration-200"
                  >
                    Edit Group
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 border border-red-700/30 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <Trash size={16} className="mr-2" />
                    {deleteConfirm ? "Confirm Delete" : "Delete Group"}
                  </button>
                  {deleteConfirm && (
                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 text-sm text-red-300 flex items-start">
                      <AlertTriangle
                        size={16}
                        className="mr-2 mt-0.5 flex-shrink-0"
                      />
                      <span>
                        This action is permanent and will remove all group data
                        including posts and member connections.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="col-span-1 lg:col-span-2 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Group Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={mode === "view"}
            className={`w-full bg-gray-800/50 border ${
              errors.name ? "border-red-500" : "border-indigo-900/30"
            } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200`}
            placeholder="Enter group name"
          />
          {errors.name && (
            <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={mode === "view"}
            rows={5}
            className={`w-full bg-gray-800/50 border ${
              errors.description ? "border-red-500" : "border-indigo-900/30"
            } rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200`}
            placeholder="Enter group description"
          />
          {errors.description && (
            <p className="mt-1 text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Group Type
            </label>
            <div className="flex space-x-4">
              {(["public-open", "public-approval"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex items-center p-3 rounded-lg border ${
                    formData.groupType === type
                      ? "border-indigo-600 bg-indigo-600/10"
                      : "border-indigo-900/30 bg-gray-800/50"
                  } cursor-pointer ${
                    mode === "view" ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="groupType"
                    checked={formData.groupType === type}
                    onChange={() =>
                      setFormData({ ...formData, groupType: type  })
                    }
                    disabled={mode === "view"}
                    className="hidden"
                  />
                  {type === "public-open" ? (
                    <Globe
                      size={18}
                      className={
                        formData.groupType === type
                          ? "text-indigo-400"
                          : "text-gray-400"
                      }
                    />
                  ) : (
                    <Lock
                      size={18}
                      className={
                        formData.groupType === type
                          ? "text-indigo-400"
                          : "text-gray-400"
                      }
                    />
                  )}
                  <span
                    className={`ml-2 ${
                      formData.groupType === type
                        ? "text-indigo-300"
                        : "text-gray-400"
                    }`}
                  >
                    {type === "public-open" ? "Public" : "Private"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <div className="relative inline-block w-full">
              <select
                name="isDeleted"
                value={formData.isDeleted.toString()}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isDeleted: e.target.value === "true",
                  })
                }
                disabled={mode === "view"}
                className="w-full bg-gray-800/50 border border-indigo-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                <option value="false">Active</option>
                <option value="true">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;
