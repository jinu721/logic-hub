export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Chat from "./components/Chat";

export const metadata: Metadata = {
  title: "CodeMaze | Chat",
  description: "Connect with other CodeBreakers in real-time chat rooms in The Digital Abyss platform.",
};



export default async function ChatPage() {
  return (
    <Chat  />
  );
}