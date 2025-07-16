"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Crown,
  Plus,
  Search,
  Info,
  Users,
  Star,
  Shield,
  Camera,
  Upload,
  X,
  Sparkles,
} from "lucide-react";
import { createGroup, getCrrentUserFriends } from "@/services/client/clientServices";
import Link from "next/link";
import { useToast } from "@/context/Toast";

const GroupCreationUI = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [step, setStep] = useState(1);
  const [groupImage, setGroupImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [availableMembers, setAvailableMembers] = useState([]);
  const {showToast} = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getCrrentUserFriends();
        console.log("Fetched Friends :- ", response.data);
        setAvailableMembers(response.data);
      } catch (err) {
        showToast({ type: "error", message: "Error fetching friends", duration: 3000 });
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      if (!file.type.match("image.*")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setGroupImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMembers = availableMembers
    .filter(
      (member) =>
        member?.otherUser?.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !selectedMembers.some(
          (selected) => selected._id === member.otherUser._id
        )
    )
    .map((member) => member.otherUser);

  console.log("FIltered", filteredMembers);

  console.log(JSON.stringify(filteredMembers));

  const addMember = (member) => {
    setSelectedMembers([...selectedMembers, member]);
  };

  const removeMember = (memberId) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member.id !== memberId)
    );
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handlecreateGroup = async () => {
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("description", groupDescription);
    formData.append("groupType", isPrivate ? "public-approval" : "public-open"); 
    formData.append(
      "members",
      JSON.stringify(selectedMembers.map((m) => m._id))
    );
    if (groupImage) {
      formData.append("groupImage", groupImage);
    }
  
    try {
      const response = await createGroup(formData);
      console.log("Group created:", response);
      setStep(3);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen p-3 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
        <div className="bg-gray-900 p-3 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-purple-400" size={20} />
            <h1 className="text-lg font-bold text-purple-300">
              Create New Escape Group
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-full bg-purple-900 border border-purple-500 text-purple-300 text-xs flex items-center gap-1">
              <Sparkles size={12} />
            </div>
          </div>
        </div>

        <div className="relative h-1 bg-gray-700">
          <div
            className="absolute top-0 left-0 h-full bg-purple-500 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="p-4">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-base font-semibold text-purple-300 mb-3">
                Group Details
              </h2>

              <div className="space-y-3">
                <div>
                  <div className="mb-4">
                    <label className="block text-xs font-medium mb-2">
                      Group Profile Image
                    </label>

                    {previewImage ? (
                      <div className="relative w-24 h-24 mx-auto group">
                        <img
                          src={previewImage}
                          alt="Group profile"
                          className="w-full h-full object-cover rounded-full border-3 border-purple-500 shadow-lg transform transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full"></div>
                          <div className="flex gap-1 z-10">
                            <button
                              onClick={() => fileInputRef.current.click()}
                              className="bg-purple-600 text-white p-1 rounded-full hover:bg-purple-700 transition-colors duration-200"
                              aria-label="Change image"
                            >
                              <Camera size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setPreviewImage(null);
                                setGroupImage(null);
                              }}
                              className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                              aria-label="Remove image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                          isDragging
                            ? "border-purple-500 bg-purple-900/20"
                            : "border-gray-700 hover:border-purple-500 hover:bg-gray-800"
                        }`}
                      >
                        <div className="bg-purple-900/30 p-2 rounded-full mb-2 transform transition-transform duration-300 hover:scale-110">
                          <Upload className="h-5 w-5 text-purple-300" />
                        </div>
                        <p className="text-xs text-center px-4">
                          <span className="font-medium text-purple-300">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG or GIF (max 5MB)
                        </p>

                        {isDragging && (
                          <div className="absolute inset-0 bg-purple-900/10 rounded-lg flex items-center justify-center animate-pulse">
                            <p className="text-sm font-medium text-purple-300">
                              Drop your image here
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("File size should be less than 5MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setPreviewImage(e.target.result);
                            setGroupImage(file);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <label className="block text-xs font-medium mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => {
                      if(e.target.value.trim().length>=0){
                        setGroupName(e.target.value)
                      }
                    }}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter a unique group name..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-sm h-20 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="What is this group about?"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-md border border-gray-700 flex-1">
                    <input
                      type="checkbox"
                      id="isPrivate"
                      checked={isPrivate}
                      onChange={() => setIsPrivate(!isPrivate)}
                      className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-purple-500 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="isPrivate"
                      className="flex items-center gap-1 cursor-pointer text-sm"
                    >
                      <Shield size={14} />
                      <span>Private Group</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={nextStep}
                  disabled={!groupName}
                  className={`px-4 py-2 text-sm rounded-md flex items-center gap-1 ${
                    !groupName
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  } transition-all duration-200`}
                >
                  <span>Next Step</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <h2 className="text-base font-semibold text-purple-300 mb-3">
                Invite Members
              </h2>

              <div className="relative">
                <Search
                  className="absolute left-3 top-2 text-gray-500"
                  size={16}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for members..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-400">
                  Selected Members ({selectedMembers.length})
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-1 bg-gray-900 rounded-full pl-2 pr-1 py-1 border border-gray-700"
                    >
                      {member.avatar ? (
                        <img
                          src={member.avatar.image}
                          alt={member.username}
                          className=" h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className=" bg-gradient-to-r h-6 w-6 rounded-full from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs">{member.username}</span>
                      <button
                        onClick={() => removeMember(member._id)}
                        className="h-4 w-4 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-md overflow-hidden">
                  {filteredMembers.length > 0 ? (
                    <div className="max-h-48 overflow-y-auto">
                      {filteredMembers.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-2 hover:bg-gray-800 cursor-pointer border-b border-gray-700 last:border-0 transition-colors"
                          onClick={() => addMember(member)}
                        >
                          <div className="flex items-center gap-2">
                            {member.avatar ? (
                              <img
                                src={member.avatar.image}
                                alt={member.username}
                                className=" h-6 w-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className=" bg-gradient-to-r h-6 w-6 rounded-full from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                {member.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium">
                                {member.username}
                              </div>
                              {/* <div className="text-xs text-gray-400">
                                Lvl {member.level} • {member.xp.toLocaleString()} XP
                              </div> */}
                            </div>
                          </div>
                          <button className="p-1 rounded-md bg-purple-900 hover:bg-purple-800 text-purple-300">
                            <Plus size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">
                      No friends`` found
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-3">
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-sm rounded-md border border-gray-700 hover:bg-gray-800 transition-all duration-200"
                >
                  Back
                </button>

                <button
                  onClick={handlecreateGroup}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm rounded-md ${
                    isLoading
                      ? "bg-purple-800"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white flex items-center gap-1 transition-all duration-200`}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Group</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-900 text-purple-300 mb-3">
                <Star className="h-8 w-8 animate-pulse" />
              </div>

              <h2 className="text-xl font-bold text-purple-300">
                Group Created Successfully!
              </h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                Your group ~{groupName}~ has been created. Members have been
                notified and can now join the group.
              </p>

              <div className="bg-gray-900 rounded-md p-3 inline-block">
                <div className="text-purple-300 text-sm font-medium">
                  Rewards Earned
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-purple-900/40 px-2 py-1 rounded-full">
                    <Star size={12} className="text-purple-300" />
                  </div>
                  <div className="flex items-center gap-1 bg-purple-900/40 px-2 py-1 rounded-full">
                    <Crown size={12} className="text-yellow-400" />
                    <span className="text-xs">Creator Badge</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link  href={"/chat"} className="px-4 py-2 text-sm rounded-md bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200">
                  Go to Chats
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 flex items-center gap-1 max-w-xs text-center">
        <Info size={12} />
        <span>Creating a group will earn you XP and exclusive badges.</span>
      </div>
    </div>
  );
};

export default GroupCreationUI;
