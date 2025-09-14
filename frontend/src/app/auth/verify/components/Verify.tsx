"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { userverify } from "@/redux/slices/authSlice";
import { axiosInstance } from "@/services/apiServices";
import { useToast } from "@/context/Toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isResendActive, setIsResendActive] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast() as any;
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    startResendTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const router = useRouter();

  const startResendTimer = () => {
    setIsResendActive(false);
    setTimeLeft(60);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          setIsResendActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").replace(/\D/g, "");

    if (pastedData.length === 6) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);

      newOtp.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = digit;
        }
      });

      const lastIndex = newOtp.length - 1;
      if (inputRefs.current[lastIndex]) {
        inputRefs.current[lastIndex]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    const email = localStorage.getItem("userEmail") as string;

    if (otpString.length === 6) {
      try {
        await dispatch(userverify({ email, otp: otpString })).unwrap();
        setVerificationStatus("success");
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      } catch {
        showToast({
          type: "error",
          message: "OTP Verification Failed",
          duration: 3000,
        });
        setVerificationStatus("error");
      }
    }
  };

  const handleGoHome = () => {
    // window.location.href = "/home";
    router.push("/home");
  };

  const handleResend = async () => {
    if (!isResendActive) return;

    await axiosInstance.post("/users/resend-otp", {
      email: localStorage.getItem("userEmail"),
    });

    showToast({
      type: "info",
      message: "New verification code sent to your email",
      duration: 3000,
    });
    setOtp(new Array(6).fill(""));
    setVerificationStatus("pending");
    inputRefs.current[0]?.focus();
    startResendTimer();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 space-y-8 bg-[var(--logichub-secondary-bg)]/70 backdrop-blur-lg rounded-2xl border border-[var(--logichub-border)] shadow-2xl max-w-md mx-auto"
    >
      {verificationStatus !== "success" ? (
        <>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el) as any}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e)}
                className={`w-14 h-14 text-center text-white text-2xl 
              bg-[var(--logichub-input-bg)] border rounded-xl 
              ${
                verificationStatus === "error"
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-700 focus:border-[var(--logichub-accent)] focus:ring-[var(--logichub-accent)]"
              } focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner`}
              />
            ))}
          </div>

          {verificationStatus === "error" && (
            <p className="text-center text-red-400 text-sm font-medium mt-2">
              Invalid verification code. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[var(--logichub-accent)] to-blue-600 
        hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl 
        font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Account
          </button>

          <div className="text-center text-sm text-[var(--logichub-muted-text)]">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={!isResendActive}
              className={`font-medium transition-colors ${
                isResendActive
                  ? "text-[var(--logichub-accent)] hover:text-[var(--logichub-accent-hover)]"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              Resend
              {!isResendActive && (
                <span className="ml-1">({formatTime(timeLeft)})</span>
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-[var(--logichub-accent)] hover:text-[var(--logichub-accent-hover)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center space-y-6 py-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500/20 p-5 rounded-full shadow-lg">
              <Check className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white">
            Verification Successful
          </h3>
          <p className="text-[var(--logichub-muted-text)] text-base">
            Your account has been successfully verified.
          </p>
          <button
            onClick={handleGoHome}
            type="button"
            className="w-full py-3 bg-[var(--logichub-accent)] 
        font-semibold text-lg transition-all duration-300"
          >
            Continue to Home
          </button>
        </div>
      )}
    </form>
  );
}
