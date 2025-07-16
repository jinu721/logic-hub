export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import MemberShip from "./components/Membership";
import { verifyUser } from "@/lib/auth";

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  return {
    title: `CodeMaze | Admin Membership Plans - ${params.type}`,
    description: "Manage Membership Plans in Admin Side",
  };
}


  export default async function MembershipPage() {
      await verifyUser("admin");
      const availableFeatures = [
        "Access to Open Domains",
        "Earn XP through challenges",
        "Extra keys every week",
        "Access to Key-Based Domains",
        "VIP Badge",
        "Black Market Access",
        "Exclusive Banners",
        "Priority Support"
      ];
    return <MemberShip availableFeatures={availableFeatures}  />
  }