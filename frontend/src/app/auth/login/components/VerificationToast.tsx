import React from "react";

interface ToastProps {
  onClose: () => void;
}

const VerificationToast: React.FC<ToastProps> = ({ onClose}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
      <div className="bg-[var(--logichub-secondary-bg)]/80 border border-[var(--logichub-border)] backdrop-blur-lg rounded-2xl shadow-2xl p-5 max-w-sm w-full relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-[var(--logichub-accent)]/20 rounded-full blur-2xl animate-pulseSlow"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[var(--logichub-accent-secondary)]/20 rounded-full blur-2xl animate-pulseSlow"></div>

        <div className="flex items-start space-x-4 relative z-10">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-10 h-10 bg-[var(--logichub-accent)]/20 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-[var(--logichub-accent)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[var(--logichub-primary-text)]">
                Email Verification Required
              </h4>
              <button
                onClick={onClose}
                className="text-[var(--logichub-muted-text)] hover:text-[var(--logichub-primary-text)] transition-colors ml-2"
                aria-label="Close toast"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-[var(--logichub-secondary-text)] mt-1">
              Check your email for a verification link to complete your login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationToast;
