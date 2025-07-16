import React from "react";

interface ToastProps {
  onClose: () => void;
  onAction: () => void;
}

const VerificationToast: React.FC<ToastProps> = ({ onClose, onAction }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slideIn">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 max-w-sm w-full backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-amber-400"
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
              <h4 className="text-sm font-semibold text-white">
                Email Verification Required
              </h4>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors ml-2"
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
            <p className="text-sm text-gray-300 mt-1">
              Check your email for a verification link to complete your login.
            </p>

            <button
              onClick={onAction}
              className="mt-3 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors border-b border-transparent hover:border-cyan-400"
            >
              Got it
            </button>
          </div>
        </div>

        <div className="mt-3 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-cyan-500 rounded-full animate-shrink" />
        </div>
      </div>
    </div>
  );
};

export default VerificationToast;
