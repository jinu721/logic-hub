export const dynamic = "force-dynamic";

import { Metadata } from "next";
import AdminInventory from "./components/Inventory";

export const metadata: Metadata = {
  title: "LogicHub | Admin Inventory",
  description: "Manage avatar, banner, and badges in Admin Side",
};

export default async function InventoryPage() {
  return <AdminInventory />;
}
