export const dynamic = 'force-dynamic';

import VerifyForm from './components/Verify';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify | CodeMaze',
  description: 'Verify your account and start your journey',
};

export default function OtpVerification() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 p-6 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Verify Your Account</h2>
          <p className="text-sm text-gray-300 mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <VerifyForm/>
      </div>
    </div>
  );
}