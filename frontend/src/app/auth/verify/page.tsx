export const dynamic = 'force-dynamic';

import GeometricBackground from '@/components/common/GeometricBackground';
import VerifyForm from './components/Verify';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify | CodeMaze',
  description: 'Verify your account and start your journey',
};

export default function OtpVerification() {
  return (
    <div className="min-h-screen bg-[var(--logichub-primary-bg)] flex items-center justify-center p-4">
      <GeometricBackground/>
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[--logichub-secondary-bg] p-6 text-center">
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