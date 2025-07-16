export const dynamic = 'force-dynamic';

import { Metadata } from "next";

import Login from "./components/Login";

export const metadata: Metadata = {
  title: "Login | CodeMaze",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <Login/>
  );
}