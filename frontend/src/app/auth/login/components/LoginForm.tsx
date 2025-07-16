import React, { FC, ChangeEvent, FormEvent } from "react";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface LoginFormProps {
  form: FormData;
  errors: FormErrors;
  isLoading: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLButtonElement>) => void;
}

const LoginForm: FC<LoginFormProps> = ({
  form,
  errors,
  isLoading,
  showPassword,
  setShowPassword,
  handleChange,
  handleSubmit,
}) => {
  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 bg-gray-900/60 border rounded-lg ${
              errors.email ? "border-red-500" : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && (
          <p className="text-red-400 mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 bg-gray-900/60 border rounded-lg ${
              errors.password ? "border-red-500" : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 mt-1">{errors.password}</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full cursor-pointer py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
