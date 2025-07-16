import React, { FormEvent, ChangeEvent } from "react";

interface ForgotFormProps {
  email: string;
  error: string | null;
  isLoading: boolean;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ForgotForm: React.FC<ForgotFormProps> = ({
  email,
  error,
  isLoading,
  handleSubmit,
  handleChange,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-3 bg-gray-900/60 border rounded-lg ${
              error ? "border-red-500" : "border-gray-700"
            } focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white`}
            placeholder="Enter your email"
            required
          />
        </div>
        {error && <p className="text-red-400 mt-1">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full curosor-pointer py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotForm;
