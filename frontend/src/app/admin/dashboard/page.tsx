export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Dashboard from "./components/Dashboard";

export const metadata: Metadata = {
  title: "LogicHub | Admin Dashboard",
  description: "Admin Dashboard",
};

export default async function DashboardPage() {
  return <Dashboard />;
}
