"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { LevelUpProvider } from "@/context/LevelUp";
import { ToastProvider } from "@/context/Toast";
import LoadingBar from "./components/LoadingBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isExcludePage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/premiumplans") ||
    pathname.startsWith("/domain") ||
    pathname === "/";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Provider store={store}>
          <LevelUpProvider>
            <ToastProvider>
              <LoadingBar />
              <AuthLoader />
              {!isExcludePage && <Navbar />}
              {children}
              <ToastContainer position="top-right" autoClose={3000} />
            </ToastProvider>
          </LevelUpProvider>
        </Provider>
      </body>
    </html>
  );
}
