"use client";

export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyLogin } from "@/services/client/clientServices";

interface VerificationData {
  message?: string;
}

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
    <div className="min-h-screen bg-gradient-to-br from-[#0f1419] via-[#121726] to-[#1a1f2e] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm mb-4 bg-[#1a2035]/50 backdrop-blur-sm px-4 py-2 rounded-full border border-[#2a324a]/50">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8V12L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Two Step Verification</span>
            </div>
          </div>

          <div className="relative bg-[#1a2035]/80 backdrop-blur-xl rounded-2xl border border-[#2a324a]/60 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-500/20 rounded-2xl blur-sm"></div>

            <div className="relative bg-[#1a2035]/95 backdrop-blur-xl rounded-2xl m-px">
              {status === "loading" && (
                <div className="p-12 text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto relative">
                      <div className="absolute inset-0 rounded-full border-2 border-[#2a324a]"></div>
                      <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                      <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                        <svg
                          className="h-8 w-8 text-blue-400"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Verifying Access
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                      Decrypting your verification token and authenticating your
                      credentials...
                    </p>
                    <div className="flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-1 bg-[#1a2035] rounded-full flex items-center justify-center">
                          <svg
                            className="h-10 w-10 text-green-400"
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
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      Verification Complete!
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-2 mb-6">
                    <p className="text-green-100 text-center font-small">
                      {message || "You are now logged in!"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-2">
                        Redirecting to dashboard in {countdown}s...
                      </p>
                      <div className="w-full bg-[#2a324a] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 ease-linear"
                          style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      href="/home"
                      className="group w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 17L15 12L10 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 12H3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Enter Dashboard
                    </Link>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-1 bg-[#1a2035] rounded-full flex items-center justify-center">
                          <svg
                            className="h-10 w-10 text-red-400"
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
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      Verification Failed
                    </h2>
                    <p className="text-gray-400">
                      Something went wrong during the verification process
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-2 mb-6">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-red-100 font-small">{message}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center items-center">
                    <button
                      onClick={handleRetry}
                      className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg
                        className="h-4 w-4 transition-transform group-hover:rotate-180"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M1 4V10H7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M23 20V14H17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20.49 9.00002C19.9828 7.56671 19.1209 6.28548 17.9845 5.27549C16.8482 4.2655 15.4745 3.55976 13.9917 3.22427C12.5089 2.88878 10.9652 2.93436 9.50481 3.35679C8.04437 3.77922 6.71475 4.56473 5.64 5.64002L1 10M23 14L18.36 18.36C17.2853 19.4354 15.9556 20.221 14.4951 20.6435C13.0347 21.066 11.4909 21.1116 10.0081 20.7762C8.52525 20.4407 7.15163 19.735 6.01525 18.725C4.87887 17.715 4.01701 16.4338 3.51 15.0001"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Try Again
                    </button>

                    <Link
                      href="/auth/login"
                      className="group bg-[#2a324a] hover:bg-[#3a425a] text-gray-300 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg
                        className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 14L4 9L9 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 20V13C20 11.9391 19.5786 10.9217 18.8284 10.1716C18.0783 9.42143 17.0609 9 16 9H4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Back to Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VerifyLogin;
