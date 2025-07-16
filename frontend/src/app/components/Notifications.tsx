"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Trash2,
  CheckSquare,
  Code,
  ShoppingCart,
  Gift,
  Settings,
  X,
  MoreHorizontal,
} from "lucide-react";
import socket from "@/utils/socket.helper";
import {
  deleteNotification,
  markAllAsRead,
} from "@/services/client/clientServices";
import { useToast } from "@/context/Toast";
import useNotifications from "@/hooks/useNotifications";
import { NotificationIF } from "@/types/notification.type";
import { useRouter } from "next/navigation";
import GiftModal from "./GiftModal";

type NotificationType = "domain" | "market" | "gift" | "system" | "other";


interface NotificationSidebarProps {
  data: NotificationIF[];
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (date: string | Date) => {
  const dateObj = new Date(date);
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 1 ? "now" : `${minutes}m`;
    }
    return `${hours}h`;
  } else if (days === 1) {
    return "1d";
  } else if (days < 7) {
    return `${days}d`;
  } else {
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case "domain":
      return <Code className="h-3 w-3 text-blue-400" />;
    case "market":
      return <ShoppingCart className="h-3 w-3 text-green-400" />;
    case "gift":
      return <Gift className="h-3 w-3 text-pink-400" />;
    case "system":
      return <Settings className="h-3 w-3 text-orange-400" />;
    default:
      return <Bell className="h-3 w-3 text-gray-400" />;
  }
};

const  NotificationSidebar:React.FC<NotificationSidebarProps> = ({
  data,
  isOpen,
  onClose,
}: NotificationSidebarProps) => {
  const { notifications, unreadCount, setNotifications } = useNotifications();
  const [showGiftUnlock, setShowGiftUnlock] = useState(false);
  const [giftData, setGiftData] = useState(null);
  const [activeFilter, setActiveFilter] = useState<
    NotificationType | "all" | "unread"
  >("all");
  const [showActions, setShowActions] = useState(false);

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === "unread") return !notif.isRead;
    if (activeFilter === "all") return true;
    return notif.type === activeFilter;
  });

  const { showToast } = useToast() as any;

  const router = useRouter();

  useEffect(() => {
    setNotifications(data);
  }, [data, setNotifications]);

  useEffect(() => {
    const handleNotification = (notif: NotificationIF) => {
      setNotifications((prev) => [...prev, notif]);
    };

    socket.emit("register_user", localStorage.getItem("accessToken"));
    socket.on("domain_notification", handleNotification);
    socket.on("market_notification", handleNotification);
    socket.on("gift_notification", handleNotification);
    socket.on("system_notification", handleNotification);

    return () => {
      socket.off("domain_notification", handleNotification);
      socket.off("market_notification", handleNotification);
      socket.off("gift_notification", handleNotification);
      socket.off("system_notification", handleNotification);
    };
  }, [setNotifications]);

  const handleMarkAllRead = async () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
    try {
      await markAllAsRead();
    } catch {
      showToast({
        type: "error",
        message: "Failed to mark all notifications as read",
      });
    }
  };

  const handleClearAll = async () => {
    setNotifications([]);
    try {
      await deleteNotification();
    } catch {
      showToast({
        type: "error",
        message: "Failed to delete all notifications",
      });
    }
  };

  const handleFilterChange = (filter: NotificationType | "all" | "unread") => {
    setActiveFilter(filter);
  };

  
const handleNotificationClick = (notification: NotificationIF) => {
  if (notification.isRead) {
    return;
  }
  switch(notification.type) {
    case "market":
      router.push("/markets");  
      break;
    case "domain":
      router.push("/domains");
      break;
    case "gift":
      setShowGiftUnlock(true);
      setGiftData(notification.itemData);
      break;
    case "system":
      router.push("/settings");
      break;
  }
  handleMarkAllRead();
};

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-20 right-4 w-72 max-h-96 bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-2xl transform transition-all duration-300 z-50 ${
          isOpen
            ? "translate-x-0 opacity-100 scale-100"
            : "translate-x-8 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-700/30">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Notifications</span>
            {unreadCount > 0 && (
              <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full border border-red-500/30">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1 rounded hover:bg-gray-800/50 transition-colors"
              type="button"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-800/50 transition-colors"
              type="button"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {showActions && (
          <div className="p-2 border-b border-gray-700/30 bg-gray-800/30">
            <div className="flex gap-1">
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 hover:bg-gray-700/50 rounded text-xs text-gray-300 transition-colors"
                type="button"
              >
                <CheckSquare className="h-3 w-3" />
                Read All
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1 px-2 py-1 bg-gray-800/50 hover:bg-gray-700/50 rounded text-xs text-gray-300 transition-colors"
                type="button"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-1 p-2 bg-gray-800/20 overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "New" },
            { key: "domain", label: "Domain" },
            { key: "market", label: "Market" },
            { key: "gift", label: "Gift" },
            { key: "system", label: "System" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key as NotificationType | "all" | "unread")}
              className={`px-2 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                activeFilter === key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
              }`}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Bell className="w-6 h-6 mb-1 opacity-30" />
              <p className="text-xs">
                {notifications.length === 0 ? "No notifications" : "No matches"}
              </p>
            </div>
          ) : (
            <div className="p-1">
              {filteredNotifications.slice(0, 8).map((notification) => (
                <div
                  onClick={() => handleNotificationClick(notification)}
                  key={notification._id}
                  className={`group p-2 rounded-md mb-1 cursor-pointer transition-all hover:bg-gray-800/40 ${
                    notification.isRead
                      ? "opacity-60"
                      : "bg-gray-800/20 border-l-2 border-blue-500/60"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5 p-1 rounded bg-gray-800/50">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4
                          className={`text-xs font-medium truncate ${
                            notification.isRead ? "text-gray-400" : "text-white"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p
                        className={`text-[11px] leading-4 truncate ${
                          notification.isRead ? "text-gray-400" : "text-gray-300"
                        }`}
                      >
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {
        showGiftUnlock && (
          <GiftModal
            isOpen={showGiftUnlock}
            onClose={() => setShowGiftUnlock(false)}
            data={giftData as any}
          />
        )
      }
    </>
  );
}


export default NotificationSidebar