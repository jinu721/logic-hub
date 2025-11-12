"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Shield,
  X,
  Star,
  Info,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { createGroup, getCrrentUserFriends } from "@/services/client/clientServices";
import { useToast } from "@/context/Toast";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
}

interface Friend {
  _id: string;
  otherUser: User;
}

interface GroupCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ValidationErrors {
  groupName?: string;
  groupDescription?: string;
}

const GroupCreationModal: React.FC<GroupCreationModalProps> = ({ isOpen, onClose }) => {
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Friend[]>([]);
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { showToast } = useToast() as any;

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchUsers = async () => {
      try {
        const response = await getCrrentUserFriends();
        setAvailableMembers(response.data || []);
      } catch (err: any) {
        console.log("Error fetching friends", err);
        showToast({ 
          type: "error", 
          message: "Error fetching friends", 
          duration: 3000 
        });
      }
    };
    
    fetchUsers();
  }, [isOpen, showToast]);

  const validateGroupName = (name: string): string | undefined => {
    if (!name.trim()) return "Group name is required";
    if (name.length < 3) return "Group name must be at least 3 characters";
    if (name.length > 50) return "Group name must be less than 50 characters";
    return undefined;
  };

  const validateGroupDescription = (description: string): string | undefined => {
    if (!description.trim()) return "Group description is required";
    if (description.length < 10) return "Description must be at least 10 characters";
    if (description.length > 200) return "Description must be less than 200 characters";
    return undefined;
  };

  const handleGroupNameChange = (value: string) => {
    setGroupName(value);
    const error = validateGroupName(value);
    setErrors(prev => ({ ...prev, groupName: error }));
  };

  const handleGroupDescriptionChange = (value: string) => {
    setGroupDescription(value);
    const error = validateGroupDescription(value);
    setErrors(prev => ({ ...prev, groupDescription: error }));
  };

  const filteredMembers = availableMembers
    .filter(
      (member) =>
        member?.otherUser?.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !selectedMembers.some((sel) => sel.userId === member.otherUser.userId)
    )
    .map((member) => member.otherUser);

  const addMember = (member: User) => {
    setSelectedMembers((prev) => [...prev, member]);
  };

  const removeMember = (id: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.userId !== id));
  };

  const nextStep = () => {
    const nameError = validateGroupName(groupName);
    const descriptionError = validateGroupDescription(groupDescription);
    
    setErrors({
      groupName: nameError,
      groupDescription: descriptionError,
    });

    if (!nameError && !descriptionError) {
      setStep(2);
    }
  };

  const prevStep = () => setStep(1);

  const handleCreateGroup = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", groupName);
      formData.append("description", groupDescription);
      formData.append("groupType", isPrivate ? "public-approval" : "public-open");
      formData.append("members", JSON.stringify(selectedMembers.map((m) => m._id)));

      await createGroup(formData as any);
      setStep(3);
    } catch (error) {
      console.error("Error creating group:", error);
      showToast({ 
        type: "error", 
        message: "Failed to create group", 
        duration: 3000 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setGroupName("");
    setGroupDescription("");
    setIsPrivate(false);
    setSearchQuery("");
    setSelectedMembers([]);
    setStep(1);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md  bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 w-full max-w-2xl rounded-lg shadow-lg text-white relative">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-3 text-purple-300">
            <Users size={20} />
            <h2 className="text-lg font-semibold">Create Escape Group</h2>
          </div>
          <button 
            onClick={resetModal}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => handleGroupNameChange(e.target.value)}
                  className={`w-full bg-gray-800 border ${
                    errors.groupName ? 'border-red-500' : 'border-gray-600'
                  } focus:border-purple-500 focus:outline-none p-3 rounded-md transition-colors`}
                  placeholder="Enter group name"
                />
                {errors.groupName && (
                  <p className="text-red-400 text-sm mt-1">{errors.groupName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => handleGroupDescriptionChange(e.target.value)}
                  className={`w-full bg-gray-800 border ${
                    errors.groupDescription ? 'border-red-500' : 'border-gray-600'
                  } focus:border-purple-500 focus:outline-none p-3 rounded-md transition-colors resize-none`}
                  placeholder="What is this group about?"
                  rows={4}
                />
                {errors.groupDescription && (
                  <p className="text-red-400 text-sm mt-1">{errors.groupDescription}</p>
                )}
              </div>

              <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield size={16} className="text-purple-400" />
                    <div>
                      <label className="text-sm font-medium">Private Group</label>
                      <p className="text-xs text-gray-400">Requires approval to join</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(!isPrivate)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  className="bg-purple-600 px-6 py-2 rounded-md hover:bg-purple-700 text-sm font-medium transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Add Members</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 focus:border-purple-500 focus:outline-none rounded-md pl-10 pr-3 py-2 text-sm transition-colors"
                    placeholder="Search members..."
                  />
                </div>

                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between bg-gray-800 p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => addMember(member)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm">{member.username}</span>
                        </div>
                        <Plus size={16} className="text-gray-400" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">
                        {searchQuery ? "No friends found matching your search" : "No friends available"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedMembers.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Selected Members ({selectedMembers.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center bg-purple-800 px-3 py-1 rounded-full text-sm gap-2"
                      >
                        <span>{member.username}</span>
                        <button 
                          onClick={() => removeMember(member.userI)}
                          className="hover:bg-purple-700 rounded-full p-1 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="text-sm px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={isLoading}
                  className="bg-purple-600 px-6 py-2 rounded-md text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Group"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-700 text-white">
                <Star size={24} />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">
                  Group Created Successfully!
                </h3>
                <p className="text-sm text-gray-400">
                  Group ~{groupName}~ was created successfully.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/chat`}
                  className="inline-block bg-purple-600 px-4 py-2 rounded-md text-white text-sm hover:bg-purple-700 transition-colors"
                >
                  Go to Chat
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 text-xs text-gray-500 text-center border-t border-gray-800">
          <div className="flex items-center justify-center gap-1">
            <Info size={12} />
            <span>Creating a group gives you XP and badges!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreationModal;