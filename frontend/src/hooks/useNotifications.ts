import { useEffect, useState } from "react";
import socket from "@/utils/socket.helper";
import { getCurrentNotifications } from "@/services/client/clientServices";
import { NotificationIF } from "@/types/notification.type";

export default function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationIF[]>([]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const data = await getCurrentNotifications();
        console.log("NOFIFFFF",data)
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    loadInitial();

    const handleNewNotification = (data: NotificationIF) => {
      setNotifications((prev) => [data, ...prev]);
    };

    const token = localStorage.getItem("accessToken");
    if (token) {
      socket.emit("register_user", token);
    }

    socket.on("domain_notification", handleNewNotification);
    socket.on("market_notification", handleNewNotification);
    socket.on("gift_notification", handleNewNotification);
    socket.on("system_notification", handleNewNotification);

    return () => {
      socket.off("domain_notification", handleNewNotification);
      socket.off("market_notification", handleNewNotification);
      socket.off("gift_notification", handleNewNotification);
      socket.off("system_notification", handleNewNotification);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    setNotifications,
  };
}
