"use client";

import { useState, ChangeEvent, FormEvent, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { validation } from "@/utils/validations.helper";
import { checkUser } from "@/services/client/clientServices";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "@/redux/slices/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useToast } from "@/context/Toast";
import { Github, Terminal } from "lucide-react";
import RegisterForm from "./RegisterForm";
import { RegisterIF } from "@/types/auth.types";
import Link from "next/link";

export interface ErrorData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AvailabilityData {
  username: boolean;
  email: boolean;
}

interface FormData extends RegisterIF {
  confirmPassword: string;
}

const Register: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const { showToast } = useToast() as any;
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<ErrorData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [availability, setAvailability] = useState<AvailabilityData>({
    username: false,
    email: false,
  });

  useLayoutEffect(() => {
    if (auth.user) {
      router.replace("/home");
    }
  }, [auth.user]);

  const checkAvailability = async (
    type: keyof AvailabilityData,
    value: string
  ) => {
    try {
      const response = await checkUser({ type, value });
      setAvailability((prev) => ({
        ...prev,
        [response.type]: response.status,
      }));
      if (!response.status) {
        setErrors((prev) => ({
          ...prev,
          [response.type]: `${response.type} Already exist`,
        }));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An Unexpected Error Occured";
      showToast({ type: "error", message, duration: 3000 });
    }
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword") {
      const confirmPasswordError = validateConfirmPassword(
        form.password,
        value
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmPasswordError }));
    } else if (name === "password") {
      const passwordError = validation(name, value);
      const confirmPasswordError = form.confirmPassword
        ? validateConfirmPassword(value, form.confirmPassword)
        : "";
      setErrors((prev:any) => ({
        ...prev,
        [name]: passwordError,
        confirmPassword: confirmPasswordError,
      }));
    } else {
      const errorMessage = validation(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    }

    if (name === "username" || name === "email") {
      checkAvailability(name as keyof AvailabilityData, value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();

    let formValid = true;
    const newErrors: ErrorData = { ...errors };

    (["username", "email", "password"] as (keyof RegisterIF)[]).forEach(
      (field) => {
        const value = form[field];
        const error = validation(field, value);
        if (error) {
          newErrors[field] = error;
          formValid = false;
        }
      }
    );

    const confirmPasswordError = validateConfirmPassword(
      form.password,
      form.confirmPassword
    );
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
      formValid = false;
    }

    setErrors(newErrors);
    if (!formValid) {
      setIsLoading(false);
      return;
    }

    try {
      const registrationData: RegisterIF = {
        username: form.username,
        email: form.email,
        password: form.password,
      };

      const response = await dispatch(userRegister(registrationData));
      if (userRegister.fulfilled.match(response)) {
        showToast({
          type: "success",
          message: "Registration Successful! Please verify your email.",
          duration: 3000,
        });
        router.push("/auth/verify");
      } else {
        showToast({
          type: "error",
          message: "Registration failed",
          duration: 3000,
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      showToast({ type: "error", message, duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
      <div className="w-4/5 max-w-md bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 pr-6 pl-6 pb-4 pt-4 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Terminal className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Create Account</h1>
          <p className="text-gray-400 text-sm">Enter your details to join</p>
        </div>

        <RegisterForm
          form={form}
          errors={errors}
          availability={availability}
          isLoading={isLoading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        <div className="my-4 flex items-center justify-center">
          <div className="w-full border-t border-gray-700"></div>
          <span className="px-2 bg-gray-800 text-gray-400 text-xs absolute">
            OR
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Link
            href="http://localhost:5000/auth/github"
            className="flex items-center justify-center text-white py-2.5 bg-gray-900/50 
            border border-gray-700 rounded-lg hover:bg-gray-800/50 transition"
          >
            <button className="flex items-center justify-center">
              <Github className="w-4 h-4 text-white mr-2" />
              GitHub
            </button>
          </Link>

          <Link
            href="http://localhost:5000/auth/google"
            className="flex items-center justify-center text-white py-2.5 bg-gray-900/50 
            border border-gray-700 rounded-lg hover:bg-gray-800/50 transition"
          >
            <button className="flex items-center justify-center">
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
              Google
            </button>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-400 relative z-10">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-cyan-400 hover:text-cyan-300 transition-colors relative z-10"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
