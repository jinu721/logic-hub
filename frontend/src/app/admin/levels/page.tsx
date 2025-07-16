export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import LevelManagement from "./components/Levels";
import { verifyUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Home | Admin Levels",
  description: "Mange Levels in Admin Side",
};

export default async function LevelPage() {
  await verifyUser("admin");
  return (
    <LevelManagement/>
  );
}
