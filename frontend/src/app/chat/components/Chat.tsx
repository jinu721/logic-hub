"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "react-image-crop/dist/ReactCrop.css";

import socket from "@/utils/socket.helper";
import axios from "axios";
import { renderMessage } from "./RenderMessages";
import {
  getConversationData,
  getCrrentUserFriends,
  getCurrentUserChats,
  getInitialMessages,
  getMyProfile,
  report,
} from "@/services/client/clientServices";
import { axiosInstance } from "@/services/apiServices";
import { formatLastSeenAgo } from "@/utils/date.format";

import ReportPopup from "@/components/shared/ReportPopup";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import ChatInfo from "./ChatInfo";
import ChatMessages from "./ChatMessages";
import AccessBlockedPanel from "./AccessBlockedPanel";
import AudioRecorder from "./AudioRecorder";
import ImagePreview from "./ImagePreview";
import ChatInput from "./ChatInput";

import useChat from "@/hooks/useChat";
import { useToast } from "@/context/Toast";

import { MessageIF } from "@/types/message.types";
import { ConversationIF } from "@/types/conversation.types";
import { GroupIF } from "@/types/group.types";
import { UserIF } from "@/types/user.types";
import Spinner from "@/components/shared/CustomLoader";
import GroupCreationModal from "./CreateGroupModal";

interface StickerData {
  id: number;
  url: string;
}

interface ToastContextType {
  showToast: (options: {
    type: "success" | "error" | "info" | "warning";
    message: string;
    duration?: number;
  }) => void;
}

type MediaType = "image" | "audio" | "video" | "sticker";
type MemberAction = "remove" | "promote" | "demote" | "block" | "unblock";
type UserRole = "owner" | "admin" | "member";

export default function ChatPage() {
  const [conversationData, setConversationData] =
    useState<ConversationIF | null>(null);
  const [currentUsersChatsList, setCurrentUsersChatsList] = useState<
    ConversationIF[]
  >([]);
  const [currentUser, setCurrentUser] = useState<UserIF | null>(null);

  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [showUserInfo, setShowUserInfo] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(
    localStorage.getItem("chatActiveTab") || "groups"
  );
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  console.log("ConversationId", conversationId);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    conversationId || null
  );
  const [isBlinking, setIsBlinking] = useState<boolean>(true);
  const [isChatsLoading, setIsChatsLoading] = useState<boolean>(false);
  const [isConversationLoading, setIsConversationLoading] =
    useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [stickers, setStickers] = useState<StickerData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [userMessage, setUserMessage] = useState<string>("");
  const [replyToMessage, setReplyToMessage] = useState<MessageIF | null>(null);
  const [imageDescription, setImageDescription] = useState<string>("");

  const [showAllMembers, setShowAllMembers] = useState<boolean>(false);
  const [showAddMembers, setShowAddMembers] = useState<boolean>(false);
  const [showJoinRequests, setShowJoinRequests] = useState<boolean>(false);
  const [showEditGroup, setShowEditGroup] = useState<boolean>(false);
  const [selectedUsersAdd, setSelectedUsersAdd] = useState<UserIF[]>([]);
  const [availableMembers, setAvailableMembers] = useState<UserIF[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [showMediaOptions, setShowMediaOptions] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [activeEmojiTab, setActiveEmojiTab] = useState<boolean>(false);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl] = useState<string | null>(null);

  const [reportPopupOpen, setReportPopupOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const safeConversationData = conversationData ?? null;
  const safeCurrentUsersChatsList = currentUsersChatsList ?? [];
  const currentUserId = currentUser ? currentUser.userId : null;

  const {
    typingUsers,
    handleTyping,
    messages,
    setMessages,
    currentUsersChats,
    setCurrentUsersChats,
    currentConversationData,
    onlineStatus,
    updateGroup,
    isDeleted,
    isRemoved,
    sendMessage,
  } = useChat({
    selectedChatId,
    conversationData: safeConversationData,
    currentUsersChatsList: safeCurrentUsersChatsList,
    currentUserId: currentUserId || "",
  });

  const fetchConversationData = async (conversationId: string | null) => {
    if (!conversationId) return;
    try {
      setIsConversationLoading(true);
      const conversation = await getConversationData(conversationId);
      const messages = await getInitialMessages(conversationId, 50);
      console.log("USER CONVERESATION", conversation);
      console.log("USER MESSAGES", messages);
      setMessages(messages);
      setConversationData(conversation.data);
      setActiveTab(
        conversation.data.type === "one-to-one" ? "personal" : "groups"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsConversationLoading(false);
    }
  };

  const fetchCurrentUsersChats = async (search?: string) => {
    try {
      setIsChatsLoading(true);
      const chats = await getCurrentUserChats({ search, activeTab });
      setCurrentUsersChatsList(chats.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsChatsLoading(false);
    }
  };

  useEffect(() => {
    if (conversationId !== selectedChatId) {
      setSelectedChatId(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!selectedChatId) return;
    fetchConversationData(selectedChatId);
  }, [selectedChatId]);

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchCurrentUsersChats(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsChatsLoading(true);
        const user = await getMyProfile();
        await fetchCurrentUsersChats();
        setCurrentUser(user.user);
        setIsChatsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement>>({});
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const router = useRouter();
  const { showToast } = useToast() as ToastContextType;

  const isGroup = !!currentConversationData?.group;
  const isGroupChat = currentConversationData?.type === "group";
  const otherUser = !isGroupChat ? currentConversationData?.otherUser : null;
  const isBlocked = !isGroupChat && otherUser && otherUser.isBlocked;

  const [groupUpdateData, setGroupUpdateData] = useState<Partial<GroupIF>>({
    name: "",
    description: "",
    image: "",
    groupType: "",
  });

  useEffect(() => {
    if (isGroup && currentConversationData.group) {
      setGroupUpdateData({
        name: currentConversationData.group.name || "",
        description: currentConversationData.group.description || "",
        image: currentConversationData.group.image || "",
        groupType: currentConversationData.group.groupType || "",
      });
    }
  }, [isGroup, currentConversationData]);

  const getUserRole = (): UserRole => {
    if (!isGroupChat || !currentConversationData.group) return "member";

    // Handle case where createdBy is string or object (DTO vs populated)
    const createdById = typeof currentConversationData.group.createdBy === 'string'
      ? currentConversationData.group.createdBy
      : (currentConversationData.group.createdBy?.userId || currentConversationData.group.createdBy?._id?.toString());

    if (createdById === currentUserId) {
      return "owner";
    }

    if (
      currentConversationData.group.admins.some(
        (usr: any) => {
          const adminId = typeof usr === 'string' ? usr : (usr.userId || usr._id);
          return adminId?.toString() === currentUserId;
        }
      )
    ) {
      return "admin";
    }

    return "member";
  };

  const userRole = getUserRole();

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const res = await axios.get(
          `https://api.giphy.com/v1/stickers/trending?api_key=VbmM8oBDdyj5Pl17gCKBuj9faGvoi2nQ&limit=150`
        );
        console.log("Response", res);
        setStickers(
          res.data.data.map((item: any) => ({
            id: item.id,
            url: item.images.fixed_height.url,
          }))
        );
      } catch (err) {
        showToast({
          type: "error",
          message: "Failed to fetch stickers",
        });
        console.log(err);
      }
    };

    fetchStickers();
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 800);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    socket.emit("register_user", token);

    socket.emit("user-online", token);

  }, []);


  useEffect(() => {
    const handleAudioEnd = () => { };

    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.addEventListener("ended", handleAudioEnd);
      return () => currentAudio.removeEventListener("ended", handleAudioEnd);
    }
  }, [audioUrl]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getCrrentUserFriends();
        setAvailableMembers(response.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
        showToast({
          type: "error",
          message: "Error fetching friends",
          duration: 3000,
        });
      }
    };
    fetchUsers();
  }, [showToast]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleMenu = (memberId: string) => {
    setOpenMenuId((prevId) => (prevId === memberId ? null : memberId));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("chatActiveTab", tab);
  };

  const handleNewGroup = () => {
    setIsModalOpen(true);
  };

  const handleChatSelection = (chatId: string) => {
    router.push(`/chat?conversationId=${chatId}`);
    setMessages([]);
    socket.emit("mark-all-conv-as-read", {
      conversationId: chatId,
      userId: currentUserId,
    });
    setCurrentUsersChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === chatId
          ? {
            ...chat,
            unreadCounts: {
              ...chat.unreadCounts,
              [currentUserId || ""]: 0,
            },
          }
          : chat
      )
    );
  };

  const handleSearchChats = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleSendMessage = (
    messageContent?: string,
    messageType: string = "text",
    mediaUrl?: string,
    pollData?: any,
    replyTo?: string
  ) => {
    const content = messageContent || userMessage;

    sendMessage(
      content,
      messageType,
      mediaUrl,
      pollData,
      replyTo || replyToMessage?._id
    );

    setReplyToMessage(null);
    if (messageType === "text") {
      setUserMessage("");
    }
  };

  const handleMemberAction = (memberId: string, action: MemberAction) => {
    const actions: Record<MemberAction, () => void> = {
      remove: () => handleRemoveMember(memberId),
      promote: () => handleMakeAdmin(memberId),
      demote: () => handleRemoveAdmin(memberId),
      block: () => console.log("Block user:", memberId),
      unblock: () => console.log("Unblock user:", memberId),
    };

    const actionHandler = actions[action];
    if (actionHandler) {
      actionHandler();
    }
  };

  const canManageMember = (member: UserIF): boolean => {
    if (!isGroupChat || !currentConversationData.group) return false;

    const memberId = member.userId?.toString();

    if (userRole === "owner") {
      return memberId !== currentUserId;
    }

    if (userRole === "admin") {
      const isMemberAdmin = currentConversationData.group.admins.some(
        (id: any) => id.toString() === memberId
      );
      const isMemberOwner =
        currentConversationData.group.createdBy.toString() === memberId;
      return !isMemberAdmin && !isMemberOwner && memberId !== currentUserId;
    }

    return false;
  };

  const handleAddUser = (user: UserIF) => {
    setSelectedUsersAdd((prev) => [...prev, user]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsersAdd((prev) => prev.filter((user) => user.userId !== userId));
  };

  const handleAddSelectedMembers = async () => {
    const membersIds = selectedUsersAdd.map((user) => user.userId);
    updateGroup({
      type: "add_members",
      conversationId: selectedChatId,
      groupId: currentConversationData.group._id,
      members: membersIds,
      userId: currentUserId,
    });
  };

  const handleRemoveMember = async (memberId: string) => {
    updateGroup({
      type: "remove_member",
      conversationId: selectedChatId,
      groupId: currentConversationData.group._id,
      members: [],
      userId: currentUserId,
      removeMember: memberId,
    });
  };

  const handleMakeAdmin = async (memberId: string) => {
    updateGroup({
      type: "make_admin",
      conversationId: selectedChatId,
      groupId: currentConversationData.group._id,
      members: [],
      userId: memberId,
    });
  };

  const handleRemoveAdmin = async (memberId: string) => {
    updateGroup({
      type: "remove_admin",
      conversationId: selectedChatId,
      groupId: currentConversationData.group._id,
      members: [],
      userId: memberId,
    });
  };

  const handleImageUploadGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const imageURL = URL.createObjectURL(file);
      setGroupUpdateData((prev) => ({
        ...prev,
        image: imageURL,
      }));
    }
  };

  const handleSaveChanges = async () => {
    let imageUrl = groupUpdateData.image;

    if (selectedImageFile) {
      const formData = new FormData();
      formData.append("groupImage", selectedImageFile);

      try {
        const response = await axiosInstance.post("/groups/image", formData);
        imageUrl = response.data.imageUrl;
      } catch (error) {
        console.error("Image upload failed", error);
        showToast({
          type: "error",
          message: "Failed to upload image",
          duration: 3000,
        });
        return;
      }
    }

    const updatedGroupData = {
      ...groupUpdateData,
      image: imageUrl,
    };

    if (groupUpdateData.name?.length === 0) {
      showToast({
        type: "error",
        message: "Group name is required",
      });
      return;
    } else if (
      groupUpdateData.description &&
      groupUpdateData.description?.length < 10
    ) {
      showToast({
        type: "error",
        message: "Description must be at least 10 characters",
      });
      return;
    }

    updateGroup({
      type: "edit_group_info",
      conversationId: selectedChatId,
      groupId: currentConversationData.group._id,
      members: [],
      userId: currentUserId,
      newGroupData: updatedGroupData,
    });

    setShowEditGroup(false);
  };

  const handleLeaveGroup = async () => {
    updateGroup({
      type: "leave_group",
      conversationId: selectedChatId,
      groupId: currentConversationData.group._id,
      members: [],
      userId: currentUserId,
    });
    router.push("/chat");
  };

  const handleDeleteChat = async () => {
    console.log("Delete chat");
  };

  const handleDeleteGroup = async () => {
    updateGroup({
      type: "delete_group",
      conversationId: selectedChatId,
      groupId: currentConversationData.group._id,
      members: [],
      userId: currentUserId,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const message = e.target.value;
    setUserMessage(message);
    if (currentUserId) handleTyping(currentUserId);
  };

  const handleUploadFile = async (
    file: File | Blob,
    type: MediaType
  ): Promise<string | undefined> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await axiosInstance.post("/messages/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const fileUrl = response.data.url;
      handleSendMessage(
        imageDescription,
        type,
        fileUrl,
        "",
        replyToMessage?._id
      );
      return fileUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      showToast({
        type: "error",
        message: "Error uploading file",
        duration: 3000,
      });
    }
  };

  const handleSelectMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setSelectedImagePreview(imageURL);
      setSelectedImageFile(file);
    }
  };

  const handleSendImage = async () => {
    if (!selectedImageFile) return;

    try {
      setIsUploading(true);
      await handleUploadFile(selectedImageFile, "image");
      resetMediaState();
    } catch (error) {
      console.error("Error sending image:", error);
      showToast({
        type: "error",
        message: "Error sending image",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetMediaState = () => {
    setSelectedImagePreview(null);
    setSelectedImageFile(null);
    setImageDescription("");
  };

  const handleSendSticker = async (url: string) => {
    try {
      setShowEmojiPicker(false);
      await handleSendMessage("", "sticker", url, "", replyToMessage?._id);
    } catch (error) {
      console.error("Error sending sticker:", error);
      showToast({
        type: "error",
        message: "Error sending sticker",
        duration: 3000,
      });
    }
  };

  const handleRequestApprove = (userId: string) => {
    updateGroup({
      type: "approve_group",
      conversationId: currentConversationData._id,
      groupId: currentConversationData.group._id,
      userId: userId,
      members: [],
    });
  };

  const handleReplyMessage = (message: MessageIF) => {
    setReplyToMessage(message);
    inputRef.current?.focus();
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId];
    if (messageElement && chatContainerRef.current) {
      const containerRect = chatContainerRef.current.getBoundingClientRect();

      chatContainerRef.current.scrollTo({
        top: messageElement.offsetTop - containerRect.height / 4,
        behavior: "smooth",
      });

      messageElement.classList.add(
        "bg-indigo-900",
        "bg-opacity-10",
        "transition-all"
      );

      setTimeout(() => {
        messageElement.classList.remove(
          "bg-indigo-900",
          "bg-opacity-10",
          "transition-all"
        );
      }, 1000);
    }
  };

  const handleReplyClick = (replyToId: string) => {
    scrollToMessage(replyToId);
  };

  const handleDeleteMessage = (messageId: string) => {
    socket.emit("delete_message", { messageId });
  };

  const handleReportMessage = () => {
    setReportPopupOpen(true);
  };

  const handleReactMessage = (messageId: string, emoji: string) => {
    socket.emit("react_message", { messageId, userId: currentUserId, emoji });
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    socket.emit("edit_message", { messageId, newContent });
  };

  const handleReport = async (reason: string) => {
    try {
      await report({
        reason,
        reportedId:
          currentConversationData.group?._id || currentConversationData._id,
        reportedType: isGroupChat ? "Group" : "User",
      });
      showToast({
        type: "success",
        message: "Report sent successfully",
        duration: 3000,
      });
      setReportPopupOpen(false);
    } catch (error: any) {
      console.error("Error reporting:", error);
      showToast({
        type: "error",
        message: error.message || "Error sending report",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (window.innerWidth < 1024 && showSidebar) {
      setShowUserInfo(false);
    }
  }, []);

  const handleSidebarToggle = (value: boolean) => {
    if (window.innerWidth < 1024 && value && showUserInfo) {
      setShowUserInfo(false);
    }
    setShowSidebar(value);
  };

  const handleUserInfoToggle = (value: boolean) => {
    if (window.innerWidth < 1024 && value && showSidebar) {
      setShowSidebar(false);
    }
    setShowUserInfo(value);
  };

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <div
          className={`${showSidebar ? "w-72" : "w-0"
            } transition-all duration-300 overflow-hidden bg-gray-800 flex flex-col border-r border-gray-700`}
        >
          {showSidebar && (
            <ChatList
              activeTab={activeTab}
              currentUsersChats={currentUsersChats}
              selectedChatId={selectedChatId}
              currentUserId={currentUserId || ""}
              loading={isChatsLoading}
              handleTabChange={handleTabChange}
              handleChatSelection={handleChatSelection}
              handleNewGroup={handleNewGroup}
              handleSearchChats={handleSearchChats}
            />
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {!selectedChatId || !conversationData ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-400">
                Select a chat to start messaging
              </div>
            </div>
          ) : isConversationLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner />
            </div>
          ) : currentConversationData &&
            currentUserId &&
            !isConversationLoading ? (
            <>
              <ChatHeader
                isGroupChat={isGroup}
                showSidebar={showSidebar}
                showUserInfo={showUserInfo}
                onlineStatus={onlineStatus}
                isBlinking={isBlinking}
                currentConversationData={currentConversationData}
                conversationData={conversationData}
                setShowSidebar={handleSidebarToggle}
                setShowUserInfo={handleUserInfoToggle}
                formatLastSeenAgo={formatLastSeenAgo}
              />

              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col">
                  {(
                    <ChatMessages
                      messages={messages}
                      currentUserId={currentUserId}
                      currentConversationData={currentConversationData}
                      chatContainerRef={chatContainerRef}
                      messageRefs={messageRefs}
                      messagesEndRef={messagesEndRef}
                      isGroup={isGroup}
                      renderMessage={renderMessage}
                      handleDeleteMessage={handleDeleteMessage}
                      handleReportMessage={handleReportMessage}
                      handleReplyMessage={handleReplyMessage}
                      handleReactMessage={handleReactMessage}
                      handleReplyClick={handleReplyClick}
                      handleEditMessage={handleEditMessage}
                      typingUsers={typingUsers}
                    />
                  )}

                  <div className="p-4 border-t border-gray-700">
                    {isDeleted ||
                      currentConversationData?.isDeleted ||
                      currentConversationData?.group?.isDeleted ? (
                      <AccessBlockedPanel
                        isGroupChat={isGroup}
                        handleDeleteChat={handleDeleteChat}
                        handleLeaveGroup={handleLeaveGroup}
                        type="deleted-chat"
                      />
                    ) : isRemoved ||
                      !conversationData.participants.some(
                        (p) => p.userId === currentUserId
                      ) ? (
                      <AccessBlockedPanel
                        isGroupChat={isGroup}
                        handleLeaveGroup={handleLeaveGroup}
                        type="removed-group"
                      />
                    ) : isRecording ? (
                      <AudioRecorder
                        handleUploadFile={handleUploadFile}
                        onClose={() => setIsRecording(false)}
                      />
                    ) : selectedImagePreview ? (
                      <ImagePreview
                        selectedImagePreview={selectedImagePreview}
                        onSendImage={handleSendImage}
                        onReset={resetMediaState}
                        isUploading={isUploading}
                      />
                    ) : (
                      <ChatInput
                        stickers={stickers}
                        replyToMessage={replyToMessage}
                        showMediaOptions={showMediaOptions}
                        setShowMediaOptions={setShowMediaOptions}
                        showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker}
                        activeEmojiTab={activeEmojiTab}
                        setActiveEmojiTab={setActiveEmojiTab}
                        userMessage={userMessage}
                        setUserMessage={setUserMessage}
                        handleInputChange={handleInputChange}
                        handleSendMessage={handleSendMessage}
                        handleSendSticker={handleSendSticker}
                        setIsRecording={setIsRecording}
                        setReplyToMessage={setReplyToMessage}
                        handleSelectMedia={handleSelectMedia}
                        inputRef={inputRef}
                      />
                    )}
                  </div>
                </div>

                <div
                  className={`${showUserInfo ? "w-72" : "w-0"
                    } transition-all duration-300 overflow-hidden bg-gray-800 border-l border-gray-700 h-full flex flex-col`}
                >
                  {showUserInfo && (
                    <ChatInfo
                      isGroupChat={isGroupChat}
                      currentConversationData={currentConversationData}
                      otherUser={otherUser}
                      setShowUserInfo={handleUserInfoToggle}
                      availableMembers={availableMembers}
                      canManageMember={canManageMember}
                      groupUpdateData={groupUpdateData}
                      setGroupUpdateData={setGroupUpdateData}
                      handleImageUploadGroup={handleImageUploadGroup}
                      handleSaveChanges={handleSaveChanges}
                      showJoinRequests={showJoinRequests}
                      setShowJoinRequests={setShowJoinRequests}
                      handleRequestAprrove={handleRequestApprove}
                      handleMemberAction={handleMemberAction}
                      handleDeleteGroup={handleDeleteGroup}
                      handleLeaveGroup={handleLeaveGroup}
                      handleDeleteChat={handleDeleteChat}
                      setReportPopupOpen={setReportPopupOpen}
                      showAllMembers={showAllMembers}
                      setShowAllMembers={setShowAllMembers}
                      openMenuId={openMenuId}
                      toggleMenu={toggleMenu}
                      handleMakeAdmin={handleMakeAdmin}
                      handleRemoveAdmin={handleRemoveAdmin}
                      handleRemoveMember={handleRemoveMember}
                      handleAddSelectedMembers={handleAddSelectedMembers}
                      handleAddUser={handleAddUser}
                      handleRemoveUser={handleRemoveUser}
                      isBlocked={isBlocked}
                      messages={messages}
                      selectedUsersAdd={selectedUsersAdd}
                      setShowAddMembers={setShowAddMembers}
                      setShowEditGroup={setShowEditGroup}
                      showAddMembers={showAddMembers}
                      showEditGroup={showEditGroup}
                      userRole={userRole}
                    />
                  )}
                </div>
              </div>
            </>
          ) : <div>
            Loading...
            <div>
              {JSON.stringify(currentUserId)}
            </div>
          </div>}
        </div>
      </div>

      <ReportPopup
        isOpen={reportPopupOpen}
        onClose={() => setReportPopupOpen(false)}
        onSubmit={handleReport}
        reportType={isGroupChat ? "group" : "user"}
      />
      {isModalOpen && (
        <GroupCreationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
