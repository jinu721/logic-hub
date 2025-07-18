import { useEffect, useState, useRef, useCallback } from "react";
import socket from "@/utils/socket.helper";
import { useToast } from "@/context/Toast";
import { MessageIF } from "@/types/message.types";
import { ConversationIF } from "@/types/conversation.types";
import { UserIF } from "@/types/user.types";

interface UseChatProps {
  selectedChatId: string | null;
  conversationData: ConversationIF | null;
  currentUsersChatsList: ConversationIF[];
  currentUserId: string;
}

export default function useChat({
  selectedChatId,
  conversationData,
  currentUsersChatsList,
  currentUserId,
}: UseChatProps) {
  console.log("HOOKS DATA", selectedChatId);

  console.log("CurrentUser CHat ARGS", currentUsersChatsList);

  const [messages, setMessages] = useState<MessageIF[]>([]);
  const [currentUsersChats, setCurrentUsersChats] = useState<ConversationIF[]>(
    []
  );
  const [typingUsers, setTypingUsers] = useState<UserIF[]>([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [currentConversationDataState, setCurrentConversationData] =
    useState<ConversationIF | null>(null);
  const [onlineStatus, setOnlineStatus] = useState(false);

  const anothorUserId =
    conversationData && conversationData?.type !== "group"
      ? conversationData?.otherUser?._id
      : null;

  const { showToast } = useToast() as any;
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  const selectedChatIdRef = useRef<string | null>(selectedChatId);

  useEffect(() => {
    selectedChatIdRef.current = selectedChatId;
  }, [selectedChatId]);

  useEffect(() => {
    if (conversationData) {
      setCurrentConversationData(conversationData);
    }
  }, [conversationData]);

  useEffect(() => {
    if (currentUsersChatsList.length) {
      setCurrentUsersChats(currentUsersChatsList);
    }
  }, [currentUsersChatsList]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      socket.emit("user-online", token);
      socket.emit("register_user", token);

      setCurrentUsersChats((prevChatList: any[]) =>
        prevChatList.map((chat: any) => {
          if (chat._id === selectedChatId) {
            return {
              ...chat,
              unreadCounts: {
                ...(chat.unreadCounts || {}),
                [conversationData?.currentUserId || "unknown"]: 0,
              },
            };
          }
          return chat;
        })
      );
    }
  }, []);

  useEffect(() => {
    console.log("Status Checking started for", anothorUserId);

    if (conversationData?.type === "group") return;

    console.log(
      "Status Checking started for calling checkUserStatus",
      anothorUserId
    );

    socket.emit("check-user-status", anothorUserId);

    console.log(
      "Status Checking started for emited checkUserStatus",
      anothorUserId
    );

    const handleUserOnline = ({
      userId,
      status,
    }: {
      userId: string;
      status: boolean;
    }) => {
      console.log("Status Back Called", anothorUserId);
      if (userId === anothorUserId) {
        setOnlineStatus(status);
      }
    };

    socket.on("user-status", handleUserOnline);

    return () => {
      socket.off("user-status", handleUserOnline);
    };
  }, [anothorUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdate = ({
      conversationId,
      lastMessage,
      unreadCounts,
    }: any) => {
      setCurrentUsersChats((prevChats: any) => {
        const updated = [...prevChats];
        const existingChatIndex = updated.findIndex(
          (chat) => chat._id === conversationId
        );

        if (existingChatIndex !== -1) {
          const chat = updated[existingChatIndex];

          const isSelected = chat._id === selectedChatIdRef.current;

          let updatedChat: any = null;

          if (isSelected) {
            updatedChat = {
              ...chat,
              latestMessage: lastMessage,
            };
          } else {
            updatedChat = {
              ...chat,
              latestMessage: lastMessage,
              unreadCounts: unreadCounts,
            };
          }

          updated.splice(existingChatIndex, 1);
          return [updatedChat, ...updated];
        } else {
          const isChatOpen = conversationId === selectedChatIdRef.current;

          const newChat = {
            _id: conversationId,
            latestMessage: lastMessage,
            ...(isChatOpen ? {} : { unreadCounts }),
          };

          return [newChat, ...updated];
        }
      });
    };

    socket.on("conversation_updated", handleConversationUpdate);

    return () => {
      socket.off("conversation_updated", handleConversationUpdate);
    };
  }, []);

  useEffect(() => {
    if (!selectedChatId) return;

    socket.emit("join_conversation", selectedChatId);

    const handleMessage = ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: MessageIF;
    }) => {
      console.log("Message Received", message);
      if (conversationId === selectedChatId) {
        setMessages((prev) => [...prev, message]);
      }
      setCurrentUsersChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === message.conversationId
            ? { ...chat, lastMessage: message }
            : chat
        )
      );
    };

    const handleDelete = ({ messageId }: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, content: "This message was deleted", isDeleted: true }
            : msg
        )
      );
    };

    const handleEdit = (updatedMsg: MessageIF) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    };

    const handleReaction = (updatedMsg: MessageIF) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    };

    socket.on("recive_message", handleMessage);
    socket.on("message_deleted", handleDelete);
    socket.on("message_edited", handleEdit);
    socket.on("reaction_updated", handleReaction);

    return () => {
      socket.off("recive_message", handleMessage);
      socket.off("message_deleted", handleDelete);
      socket.off("message_edited", handleEdit);
      socket.off("reaction_updated", handleReaction);
    };
  }, [selectedChatId]);

  useEffect(() => {
    if (!currentConversationDataState?._id) return;

    const handleGroupUpdate = ({
      conversationId,
      updatedMembers,
      groupInfo = {},
      type,
      removeMember,
    }: any) => {
      console.log("Group Updated:", conversationId, updatedMembers, groupInfo);

      if (currentConversationDataState._id === conversationId) {
        setCurrentConversationData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            participants: updatedMembers || prev.participants || [],
            group: {
              ...prev.group,
              ...groupInfo,
              admins: groupInfo.admins || prev.group?.admins || [],
              members: groupInfo.members || prev.group?.members || [],
            },
          };
        });

        setCurrentUsersChats((prevChats) =>{
          return prevChats.map((chat) => {
            if (chat._id === conversationId) {
              return {
                ...chat,
                participants: updatedMembers || chat.participants || [],
                group: {
                  ...chat.group,
                  ...groupInfo,
                  admins: groupInfo.admins || chat.group?.admins || [],
                  members: groupInfo.members || chat.group?.members || [],
                },
              };
            }
            return chat;
          })
        })

        if (type === "delete_group") {
          setIsDeleted(true);
        }
        if(type === "remove_member" && removeMember === currentUserId){
          setIsRemoved(true);
        }
      }
    };

    socket.on("group_updated", handleGroupUpdate);

    return () => {
      socket.off("group_updated", handleGroupUpdate);
    };
  }, [currentConversationDataState?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleTypingUsers = ({
      conversationId,
      typingUsers,
    }: {
      conversationId: string;
      typingUsers: UserIF[];
    }) => {
      if (conversationId === selectedChatIdRef.current) {
        setTypingUsers(typingUsers);
        setCurrentUsersChats((prevChats)=>{
          return prevChats.map((chat) => {
            if (chat._id === conversationId) {
              return {
                ...chat,
                typingUsers,
              };
            }
            return chat;
          })
        })
      }
    };

    socket.on("typing_users", handleTypingUsers);

    return () => {
      socket.off("typing_users", handleTypingUsers);
    };
  }, []);

  const sendMessage = useCallback(
    (
      messageContent: any,
      messageType = "text",
      mediaUrl?: string,
      pollData?: any,
      replyTo?: string
    ) => {
      if (
        isDeleted ||
        currentConversationDataState?.isDeleted ||
        currentConversationDataState?.group?.isDeleted
      ) {
        showToast({
          type: "error",
          message: "Cannot send message to deleted conversation",
          duration: 3000,
        });
        return;
      }

      if (messageType === "text" && !messageContent.trim()) {
        return;
      }

      const data: any = {
        conversationId: selectedChatId,
        replyTo: replyTo || null,
      };

      if (messageType === "text") {
        data.content = messageContent;
        data.type = messageType;
      } else if (messageType === "image") {
        data.content = messageContent;
        data.type = messageType;
        data.media = {
          url: mediaUrl!,
          type: messageType,
        };
      } else if (messageType === "sticker" || messageType === "audio") {
        data.type = messageType;
        data.media = {
          url: mediaUrl!,
          type: messageType,
        };
      }

      const accessToken = localStorage.getItem("accessToken");
      socket.emit("send_message", {
        data,
        accessToken,
      });
    },
    [selectedChatId, isDeleted, currentConversationDataState, showToast]
  );

  const handleTyping = useCallback(
    (userId: string) => {
      socket.emit("typing", {
        conversationId: selectedChatId,
        userId,
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", {
          conversationId: selectedChatId,
          userId,
        });
      }, 2000);
    },
    [selectedChatId]
  );

  const updateGroup = useCallback((updateData: any) => {
    try {
      socket.emit("update_group", updateData);
    } catch (err) {
      console.log(err);
      showToast({
        type: "error",
        message: `Error ${updateData.type} group`,
        duration: 3000,
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    currentUsersChats,
    typingUsers,
    isDeleted,
    isRemoved,
    currentConversationData: currentConversationDataState,
    onlineStatus,

    setMessages,
    setCurrentUsersChats,
    setCurrentConversationData,
    setIsDeleted,

    sendMessage,
    handleTyping,
    updateGroup,
  };
}
