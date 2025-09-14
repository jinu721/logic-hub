export const dynamic = "force-dynamic";

import { Metadata } from "next";

import ForgotPasswordForm from "./components/ForgotPassword";
import GeometricBackground from "@/components/common/GeometricBackground";

export const metadata: Metadata = {
  title: "Reset Password | CodeMaze",
  description: "Reset your account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--logichub-primary-bg)] p-4">
      <GeometricBackground/>
      <div className="w-4/5 max-w-sm bg-[var(--logichub-secondary-bg)]/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--logichub-border)] pr-6 pl-6 pb-4 pt-4 relative overflow-hidden">
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-xl font-bold text-[var(--logichub-primary-text)] mb-1 mt-3">
            Reset Password
          </h1>
          <p className="text-[var(--logichub-muted-text)] text-sm">
            Enter your email to receive reset instructions
          </p>
        </div>

        <ForgotPasswordForm />

      </div>
    </div>
  );
}
