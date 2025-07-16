export const dynamic = "force-dynamic";

import { Metadata } from "next";
import AdminInventory from "./components/Inventory";
import { verifyUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "CodeMaze | Admin Inventory",
  description: "Manage avatar, banner, and badges in Admin Side",
};

export default async function InventoryPage() {
  await verifyUser("admin");
  return <AdminInventory />;
}
