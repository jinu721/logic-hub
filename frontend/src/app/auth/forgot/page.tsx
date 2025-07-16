export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

import ForgotPasswordForm from "./components/ForgotPassword";

export const metadata: Metadata = {
  title: "Reset Password | CodeMaze",
  description: "Reset your account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
      <div className="w-4/5 max-w-sm bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 pr-6 pl-6 pb-4 pt-4 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Terminal className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Reset Password</h1>
          <p className="text-gray-400 text-sm">Enter your email to receive reset instructions</p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center mt-5 text-sm text-gray-400">
          <Link
            href="/auth/login"
            className="flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}