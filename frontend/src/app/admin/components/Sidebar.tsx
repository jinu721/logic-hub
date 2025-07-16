"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GanttChart,
  Globe,
  BadgeIcon,
  LucideIcon,
  Layers,
  ShoppingCart,
  FileBarChart,
  Users2,
  LogOut,
} from "lucide-react";

interface NavItemProps {
  path: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  sidebarOpen: boolean;
}

const NavItem = ({
  path,
  icon: Icon,
  label,
  isActive,
  sidebarOpen,
}: NavItemProps) => (
  <Link
    href={path}
    className={`flex items-center ${
      sidebarOpen ? "justify-start" : "justify-center"
    } px-4 py-3 rounded-lg transition-all duration-200 group ${
      isActive
        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-gray-800/50"
    }`}
  >
    <Icon
      className={`${
        sidebarOpen ? "mr-3" : "mx-auto"
      } h-5 w-5 transition-all duration-200 ${
        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
      }`}
    />
    {sidebarOpen && (
      <span
        className={`text-sm font-medium ${
          isActive ? "text-white" : "text-gray-300 group-hover:text-white"
        }`}
      >
        {label}
      </span>
    )}
    {!sidebarOpen && (
      <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-xs font-medium opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none z-50">
        {label}
      </div>
    )}
  </Link>
);

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => {
    return pathname === path;
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/inventory", label: "Inventory", icon: BadgeIcon },
    { path: "/admin/domains", label: "Domains", icon: Globe },
    { path: "/admin/levels", label: "Levels", icon: Layers },
    { path: "/admin/markets", label: "Markets", icon: ShoppingCart },
    { path: "/admin/membership", label: "Plans", icon: GanttChart },
    { path: "/admin/reports", label: "Reports", icon: FileBarChart },
    { path: "/admin/groups", label: "Groups", icon: Users2 },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gray-900 h-screen fixed left-0 top-0 transition-all duration-300 ease-in-out z-30 flex flex-col shadow-xl border-r border-gray-800`}
    >
      <div
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="flex items-center justify-between p-5 border-b border-gray-800"
      ></div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
            isActive={isActive(item.path)}
            sidebarOpen={sidebarOpen}
          />
        ))}
        <div className="mt-30">
          <button className="w-12 h-12 bg-red-500/10 hover:bg-red-500/30 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-300">
            <LogOut size={20} />
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
