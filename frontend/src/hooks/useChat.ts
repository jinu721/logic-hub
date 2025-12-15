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
    const handleMessageSeen = ({
      conversationId,
      seenBy,
    }: {
      conversationId: string;
      seenBy: UserIF;
    }) => {
      // Corrected logic: Check if message is already seen by this user ID (string check)
      if (conversationId === selectedChatIdRef.current) {
        setMessages((prevMsgs) =>
          prevMsgs.map((msg) => {
            // Handle seenBy being string IDs or User Objects
            const seenByList = msg.seenBy || [];
            const alreadySeen = seenByList.some((s: any) =>
              (typeof s === 'string' ? s : s._id) === seenBy._id
            );

            if (msg.sender._id !== seenBy._id && !alreadySeen) {
              return {
                ...msg,
                seenBy: [...seenByList, seenBy], // Append the full user object
              };
            }
            return msg;
          })
        );
      }
    };

    socket.on("message_seen", handleMessageSeen);

    return () => {
      socket.off("message_seen", handleMessageSeen);
    };
  }, []);

  useEffect(() => {
    if (conversationData?.type === "group" || !anothorUserId) return;

    socket.emit("check-user-status", anothorUserId);

    const handleUserOnline = ({
      userId,
      status,
    }: {
      userId: string;
      status: boolean;
    }) => {
      if (userId === anothorUserId) {
        setOnlineStatus(status);
      }

      setCurrentUsersChats((prevChats) =>
        prevChats.map((chat) =>
          chat.otherUser?.userId === userId || chat.otherUser?._id === userId
            ? {
              ...chat,
              otherUser: {
                ...chat.otherUser!,
                isOnline: status,
              },
            }
            : chat
        )
      );
    };

    socket.on("user-status", handleUserOnline);

    return () => {
      socket.off("user-status", handleUserOnline);
    };
  }, [anothorUserId, conversationData?.type]);

  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdate = ({
      conversationId,
      lastMessage,
      unreadCounts,
    }: any) => {

      // Map sender ID in lastMessage if needed
      if (lastMessage?.sender && !lastMessage.sender._id && lastMessage.sender.userId) {
        lastMessage.sender._id = lastMessage.sender.userId;
      }

      setCurrentUsersChats((prevChats) => {
        const updated = [...prevChats];
        const existingChatIndex = updated.findIndex(
          (chat) => chat._id === conversationId
        );

        if (existingChatIndex !== -1) {
          const chat = updated[existingChatIndex];
          const isSelected = chat._id === selectedChatIdRef.current;

          const updatedChat = {
            ...chat,
            latestMessage: lastMessage,
            unreadCounts: unreadCounts !== undefined ? unreadCounts : chat.unreadCounts,
          };

          updated.splice(existingChatIndex, 1);
          return [updatedChat, ...updated];
        } else {
          // If chat is not in list, handling it might require fetching full conversation or minimal data
          // For now, adhere to existing logic but safe check
          const isChatOpen = conversationId === selectedChatIdRef.current;
          const newChat = {
            _id: conversationId,
            latestMessage: lastMessage,
            unreadCounts: isChatOpen ? {} : unreadCounts,
            // We might be missing participants/otherUser here if it's a fresh chat push
            // But we keep the structure consistent
            type: lastMessage.conversationId ? 'one-to-one' : 'group',
            // Note: In a real scenario we might want to fetch the chat here
            // but we'll stick to updating if exists logic primarily
            participants: [],
            typingUsers: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any;

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
      // Map sender ID if needed
      if (message.sender && !message.sender._id && message.sender.userId) {
        message.sender._id = message.sender.userId;
      }

      console.log("Message Received", message);

      if (conversationId === selectedChatId) {
        setMessages((prev) => {
          // Prevent duplicates if needed, but append is standard
          // Check if already exists (optional but good for strictness)
          if (prev.some(m => m._id === message._id)) return prev;

          const updatedMessage = [...prev, message];

          // Check if current user has already seen it (e.g. they sent it from another device)
          // or mark as read immediately if it's incoming and we are viewing
          const seenByList = message.seenBy || [];
          const isSeenByMe = seenByList.some((s: any) =>
            (typeof s === 'string' ? s : s._id) === currentUserId
          );

          if (!isSeenByMe && message.sender._id !== currentUserId) {
            socket.emit("mark-all-conv-as-read", {
              conversationId,
              userId: currentUserId,
            });
          }

          return updatedMessage;
        });
      }

      setCurrentUsersChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === message.conversationId
            ? { ...chat, lastMessage: message } // Updates preview
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
      // updatedMsg will have reactions array with string userIds now
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    };

    // Changed event name to 'receive_message'
    socket.on("receive_message", handleMessage);
    socket.on("message_deleted", handleDelete);
    socket.on("message_edited", handleEdit);
    socket.on("reaction_updated", handleReaction);

    return () => {
      socket.off("receive_message", handleMessage);
      socket.off("message_deleted", handleDelete);
      socket.off("message_edited", handleEdit);
      socket.off("reaction_updated", handleReaction);
    };
  }, [selectedChatId, currentUserId]);

  useEffect(() => {
    if (!currentConversationDataState?._id) return;

    const handleGroupUpdate = ({
      conversationId,
      updatedMembers,
      groupInfo = {},
      type,
      removeMember,
    }: any) => {

      // Map members to have _id
      const mappedMembers = updatedMembers?.map((m: any) => ({
        ...m,
        _id: m.userId || m._id
      }));

      if (currentConversationDataState._id === conversationId) {
        setCurrentConversationData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            participants: mappedMembers || prev.participants || [],
            group: {
              ...prev.group,
              ...groupInfo,
              admins: groupInfo.admins || prev.group?.admins || [],
              members: groupInfo.members || prev.group?.members || [],
            },
          };
        });

        setCurrentUsersChats((prevChats) => {
          return prevChats.map((chat) => {
            if (chat._id === conversationId) {
              return {
                ...chat,
                participants: mappedMembers || chat.participants || [],
                group: {
                  ...chat.group,
                  ...groupInfo,
                  admins: groupInfo.admins || chat.group?.admins || [],
                  members: groupInfo.members || chat.group?.members || [],
                },
              };
            }
            return chat;
          });
        });

        if (type === "delete_group") {
          setIsDeleted(true);
        }
        if (type === "remove_member" && removeMember === currentUserId) {
          setIsRemoved(true);
        }
      }
    };

    socket.on("group_updated", handleGroupUpdate);

    return () => {
      socket.off("group_updated", handleGroupUpdate);
    };
  }, [currentConversationDataState?._id, currentUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleTypingUsers = ({
      conversationId,
      typingUsers,
    }: {
      conversationId: string;
      typingUsers: UserIF[];
    }) => {
      // If the event corresponds to      console.log("Typing Users", typingUsers);
      // Map backend DTO (userId) to Frontend shape (_id) if needed
      const mappedUsers = typingUsers.map(u => ({
        ...u,
        _id: u.userId || u._id
      }));

      if (conversationId === selectedChatIdRef.current) {
        // Filter out current user to be safe (UI shouldn't show "You are typing")
        const othersTyping = mappedUsers.filter(u => u._id !== currentUserId);
        setTypingUsers(othersTyping);
      }

      // Also update the chat list preview
      setCurrentUsersChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === conversationId) {
            return {
              ...chat,
              typingUsers: mappedUsers,
            };
          }
          return chat;
        });
      });
    };

    socket.on("typing_users", handleTypingUsers);

    return () => {
      socket.off("typing_users", handleTypingUsers);
    };
  }, [currentUserId]);

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
  }, [showToast]);

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
