"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/services/client/clientServices";
import { useToast } from "@/context/Toast";
import { validation } from "@/utils/validations.helper";
import ResetForm from "./ResetForm";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showToast } = useToast() as any;

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    let errorMessage = "";
    if (name === "password") {
      errorMessage = validation("password", value) || "";
    } else if (name === "confirmPassword") {
      if (value !== form.password) {
        errorMessage = "Passwords do not match";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {
      password: validation("password", form.password),
      confirmPassword:
        form.confirmPassword !== form.password ? "Passwords do not match" : "",
    };

    setErrors(newErrors);

    if (newErrors.password || newErrors.confirmPassword) {
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(token, form.password);
      showToast({ type: "success", message: "Password reset successful!", duration: 3000 });
      setResetSuccess(true);
    } catch {
      showToast({ type: "error", message: "Failed to reset password", duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="text-center p-6 space-y-4">
        <div className="flex justify-center mb-4">
          <svg
            className="h-16 w-16 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Password Reset Complete</h3>
        <p className="text-gray-300 text-sm">
          Your password has been updated successfully
        </p>
        <Link
          href="/auth/login"
          className="block w-full py-3 mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <ResetForm
      form={form}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      setShowPassword={setShowPassword}
      setShowConfirmPassword={setShowConfirmPassword}
    />
  );
}

export default ResetPassword;