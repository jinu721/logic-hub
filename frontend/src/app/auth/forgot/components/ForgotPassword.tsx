"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { validation } from "@/utils/validations.helper";
import { forgotPassword } from "@/services/client/clientServices";
import { useToast } from "@/context/Toast";
import ForgotForm from "./ForgotForm";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const { showToast } = useToast() as any;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const errorMessage = validation("email", value);
    setError(errorMessage || "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errorMessage = validation("email", email);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      setIsLoading(true);
      await forgotPassword(email);
      showToast({
        type: "success",
        message: "Password reset link sent to your email",
        duration: 3000,
      });
      setEmailSent(true);
    } catch (err: any) {
      console.error(err);
      showToast({
        type: "error",
        message: "Failed to send reset link",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!emailSent ? (
        <ForgotForm
          email={email}
          error={error}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      ) : (
        <div className="relative text-center p-8 space-y-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl max-w-md mx-auto">
          <div className="relative flex justify-center mb-6">

          </div>
          <div className="relative space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Check Your Email
            </h3>
            <div className="space-y-2">
              <p className="text-slate-300 text-base leading-relaxed">
                We`ve sent verification link to
              </p>
              <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 px-4 py-2 rounded-lg border border-slate-600/50">
                <span className="text-emerald-400 font-medium text-sm break-all">
                  {email}
                </span>
              </div>
            </div>
          </div>
          <div className="relative pt-4">
            <button
              onClick={() => setEmailSent(false)}
              className="group relative inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-cyan-400 hover:text-white transition-all duration-200 ease-out hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="absolute inset-0 border border-cyan-400/20 rounded-lg group-hover:border-cyan-400/40 transition-colors duration-200"></div>
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span onClick={() => setEmailSent(false)} className="relative cursor-pointer">Use a different email</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
}
