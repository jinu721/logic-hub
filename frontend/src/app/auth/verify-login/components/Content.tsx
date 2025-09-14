"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyLogin } from "@/services/client/clientServices";


const VerifyLogin: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(3);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. Token is missing.");
        return;
      }

      try {
        const verifyData: VerificationData = await verifyLogin(token);

        if (verifyData) {
          setStatus("success");
          setMessage(
            verifyData.message || "Your email has been verified successfully!"
          );

          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                router.push("/home");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setStatus("error");
          setMessage("Failed to verify email. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyToken();
  }, [token, router]);

  const handleRetry = (): void => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#121726] to-[#1a1f2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
        <div className="bg-gray-900/80 p-6 text-center border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-1">
            Two-Step Verification
          </h2>
          <p className="text-sm text-gray-400">
            Enter the verification code sent to your email
          </p>
        </div>

        <div className="p-6 space-y-6">
          {status === "loading" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-gray-700 border-t-primary rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">
                Verifying your credentials...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-green-500/20">
                <svg
                  className="w-8 h-8 text-green-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">
                Verification Complete!
              </h3>
              <p className="text-gray-400 text-sm">
                {message || "You are now logged in."}
              </p>
              <Link
                href="/home"
                className="w-full inline-flex justify-center items-center gap-2 bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-primary-dark transition-all duration-200"
              >
                Enter Dashboard
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-red-500/20">
                <svg
                  className="w-8 h-8 text-red-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">
                Verification Failed
              </h3>
              <p className="text-gray-400 text-sm">
                {message || "Something went wrong during verification."}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="bg-primary text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-all duration-200"
                >
                  Try Again
                </button>
                <Link
                  href="/auth/login"
                  className="bg-gray-700 text-gray-300 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyLogin;
