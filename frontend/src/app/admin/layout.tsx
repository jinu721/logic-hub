"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ToastContainer } from "react-toastify";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <div className="flex h-screen">
            <div className="">
              <Sidebar />
            </div>
            <div className="ml-15 flex-grow">{children}</div>
          </div>

          <ToastContainer position="top-right" autoClose={3000} />
        </Provider>
      </body>
    </html>
  );
}
