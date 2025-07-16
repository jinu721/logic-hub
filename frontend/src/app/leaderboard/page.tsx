export const dynamic = 'force-dynamic';

import Leaderboard from "./components/Leaderboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CodeMaze | Leaderboard",
  description:
    "View Escapers Leaderboard.",
};


export default async function ProfilePage() {
  return (
    <Leaderboard/>
  );
}
