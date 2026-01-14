export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import { Terminal } from "lucide-react";

import ResetPasswordForm from "./components/ResetPassword";

export const metadata: Metadata = {
  title: "Set New Password | LogicHub",
  description: "Create a new password for your account",
};


type Props = {
  searchParams: { token?: string };
};

export default function ResetPasswordPage({ searchParams: { token } }: Props) {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
      <div className="w-4/5 max-w-sm bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 pr-6 pl-6 pb-4 pt-4 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Terminal className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Create New Password</h1>
          <p className="text-gray-400 text-sm">Enter a strong password for your account</p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}