export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Dashboard from "./components/Dashboard";
import { verifyUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CodeMaze | Admin Dashboard",
  description: "Admin Dashboard",
};

export default async function DashboardPage() {
  await verifyUser("admin");
  return <Dashboard />;
}
