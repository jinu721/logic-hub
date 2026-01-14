"use client";

import Sidebar from "./components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <div className="">
        <Sidebar />
      </div>
      <div className="ml-15 flex-grow">{children}</div>
    </div>
  );
}
