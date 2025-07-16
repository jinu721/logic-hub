"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import Navbar from "./components/Navbar";
import socket from "@/utils/socket.helper";
import ChallengeNotificationModal from "./home/components/NotificationModal";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const [showNotification, setShowNotification] = useState(false);
  const [challengeData, setChallengeData] = useState({});

  const isExcludePage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/premiumplans") ||
    pathname.startsWith("/domain") ||
    pathname === "/";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }

    socket.on("domain_notification", ({ data }) => {
      setChallengeData(data);
      setShowNotification(true);
    });

    return () => {
      socket.off("domain_notification");
    };
  }, [dispatch]);

  const handleDismiss = () => {
    setShowNotification(false);
  };

  const handleNavigate = (challengeId: string) => {
    setShowNotification(false);
    router.push(`/domain/${challengeId}`);
  };

  return (
    <>
      {!isExcludePage && <Navbar />}
      {children}
      {showNotification && (
        <ChallengeNotificationModal
          onClose={handleDismiss}
          challenge={challengeData}
          onNavigate={handleNavigate}
        />
      )}
    </>
  );
}
