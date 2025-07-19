import { ChangeEvent, FormEvent, useState } from "react";
import { RegisterIF } from "@/types/auth.types";
import { ErrorData } from "./Register";

type AvailabilityData = { username: boolean; email: boolean };

interface FormData extends RegisterIF {
  confirmPassword: string;
}

interface RegisterFormProps {
    form: FormData;
    errors: ErrorData;
    availability: AvailabilityData;
    isLoading: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ form, errors, availability,isLoading, handleChange, handleSubmit }) => {

 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">@</span>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-2.5 bg-gray-900/60 border rounded-lg ${
              errors.username
                ? "border-red-500"
                : form.username && availability.username
                ? "border-green-500"
                : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
            placeholder="Choose a username"
          />
          {form.username && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {availability.username ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-green-500 fill-current"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" opacity=".35" />
                  <path d="M11,16c-.256,0-.512-.098-.707-.293l-3-3c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0L11,13.586l4.293-4.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414l-5,5C11.512,15.902,11.256,16,11,16z" />
                </svg>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          )}
        </div>
        {errors.username && (
          <p className="text-red-400 text-xs mt-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.username}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-2.5 bg-gray-900/60 border rounded-lg ${
              errors.email
                ? "border-red-500"
                : form.email && availability.email
                ? "border-green-500"
                : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
            placeholder="Enter your email"
          />
          {form.email && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {availability.email ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-green-500 fill-current"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" opacity=".35" />
                  <path d="M11,16c-.256,0-.512-.098-.707-.293l-3-3c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0L11,13.586l4.293-4.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414l-5,5C11.512,15.902,11.256,16,11,16z" />
                </svg>
              ) : (
                <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs mt-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-2.5 bg-gray-900/60 border rounded-lg ${
              errors.password ? "border-red-500" : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
            placeholder="Create a password"
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-2.5 bg-gray-900/60 border rounded-lg ${
              errors.confirmPassword ? "border-red-500" : 
              form.confirmPassword && form.password === form.confirmPassword ? "border-green-500" : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            {showConfirmPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-xs mt-2 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 
    hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg 
    font-semibold transition-all duration-300 
    disabled:opacity-50 disabled:cursor-not-allowed 
    flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <span className="animate-pulse">Creating Account...</span>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;