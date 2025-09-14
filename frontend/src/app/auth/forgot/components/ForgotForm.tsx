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
        <label className="block text-sm font-medium text-[var(--logichub-secondary-text)] mb-2">
          Email
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--logichub-muted-text)] w-5 h-5"
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
            className={`w-full pl-10 pr-12 py-3 bg-[var(--logichub-secondary-bg)] border rounded-lg ${
              error ? "border-red-500" : "border-[var(--logichub-border)]"
            } focus:outline-none focus:ring-2 focus:ring-[var(--logichub-accent)] text-[var(--logichub-primary-text)]`}
            placeholder="Enter your email"
            required
          />
        </div>
        {error && <p className="text-red-400 mt-1">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full cursor-pointer py-3 bg-[var(--logichub-btn)] text-[var(--logichub-btn-text)] rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotForm;
