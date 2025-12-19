"use client";

import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
  useLayoutEffect,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { validation } from "@/utils/validations.helper";
import { useDispatch, useSelector } from "react-redux";
import { logout, userLogin } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useToast } from "@/context/Toast";
import { LoginIF } from "@/types/auth.types";
import Link from "next/link";
import { Github } from "lucide-react";
import VerificationToast from "./VerificationToast";
import LoginForm from "./LoginForm";
import GeometricBackground from "@/components/common/GeometricBackground";

interface ErrorState {
  identifier: string;
  password: string;
}

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showVerificationToast, setShowVerificationToast] =
    useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast() as any;

  const auth = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState<LoginIF>({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorState>({
    identifier: "",
    password: "",
  });

  useEffect(() => {
    const isBanned = searchParams.get("banned");

    if (isBanned) {
      console.log("User is banned");
      showToast({
        type: "error",
        message: "Your Account banned",
        duration: 3000,
      });
      localStorage.clear();
      dispatch(logout());
      const cleanUrl = window.location.pathname;
      router.replace(cleanUrl);
    }
  }, [dispatch, router, searchParams, showToast]);

  useLayoutEffect(() => {
    if (auth.user) {
      router.replace("/home");
    }
  }, [auth.user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    const errorMessage = validation(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let formValid = true;
    const newErrors: ErrorState = { ...errors };

    (Object.keys(form) as (keyof LoginIF)[]).forEach((field) => {
      const value = form[field];
      const error = validation(field, value);

      if (error) {
        newErrors[field] = error;
        formValid = false;
      }
    });

    setErrors(newErrors);
    if (!formValid) return;

    try {
      setIsLoading(true);
      const response = await dispatch(userLogin(form)).unwrap();


      if (response.isBanned) {
        showToast({
          type: "error",
          message: "Your Account Banned",
          duration: 3000,
        });
        return;
      }

      if (!response.isVerified) {
        showToast({
          type: "success",
          message: "OTP Sent Successfully",
          duration: 3000,
        });
        router.push("/auth/verify");
        return;
      }

      if (response.security) {
        setShowVerificationToast(true);
        setTimeout(() => setShowVerificationToast(false), 8000);
      } else {
        showToast({
          type: "success",
          message: "Login Successful!",
          duration: 3000,
        });
      }

      if (!response.isBanned && response.isVerified && !response.security) {
        router.push("/home");
      }
    } catch (err: any) {
      console.log(err);
      showToast({
        type: "error",
        message: err?.message || "Invalid Credentials",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[var(--logichub-primary-bg)] p-4">
        <GeometricBackground />
        <div className="w-4/5 max-w-sm bg-[var(--logichub-card-bg)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--logichub-border)] pr-6 pl-6 pb-4 pt-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-xl font-bold text-[var(--logichub-primary-text)] mb-1 mt-3">
                Welcome Back
              </h1>
              <p className="text-[var(--logichub-muted-text)] text-sm">
                Sign in to your account
              </p>
            </div>

            <LoginForm
              form={form}
              errors={errors}
              isLoading={isLoading}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />

            <div className="my-5 flex items-center justify-center relative">
              <div className="w-full border-t border-[var(--logichub-border)]"></div>
              <span className="px-2 bg-[var(--logichub-card-bg)] text-[var(--logichub-muted-text)] text-xs absolute backdrop-blur-sm">
                OR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <Link
                href={`https://logichubapi.envriocart.shop/auth/github`}
                className="flex items-center justify-center text-[var(--logichub-primary-text)] py-2.5 bg-[var(--logichub-secondary-bg)] 
            border border-[var(--logichub-border)] rounded-lg hover:bg-[var(--logichub-card-bg)] transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--logichub-accent)] focus:ring-opacity-50"
              >
                <Github className="w-4 h-4 text-[var(--logichub-primary-text)] mr-2" />
                <span>GitHub</span>
              </Link>

              <Link
                href={`https://logichubapi.envriocart.shop/auth/google`}
                className="flex items-center justify-center text-[var(--logichub-primary-text)] py-2.5 bg-[var(--logichub-secondary-bg)] 
            border border-[var(--logichub-border)] rounded-lg hover:bg-[var(--logichub-card-bg)] transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-[var(--logichub-accent)] focus:ring-opacity-50"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </Link>
            </div>

            <div className="text-center text-sm text-[var(--logichub-muted-text)] mb-3">
              Don`t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-[var(--logichub-primary-text)] hover:text-[var(--logichub-secondary-text)] transition-colors duration-200 inline-block"
              >
                Create Account
              </Link>
            </div>

            <div className="text-center text-sm">
              <Link
                href="/auth/forgot"
                className="text-[var(--logichub-muted-text)] hover:text-[var(--logichub-accent-text)] transition-colors duration-200 inline-block"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showVerificationToast && (
        <VerificationToast onClose={() => setShowVerificationToast(false)} />
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-shrink {
          animation: shrink 8s linear;
        }
      `}</style>
    </>
  );
};

export default Login;
