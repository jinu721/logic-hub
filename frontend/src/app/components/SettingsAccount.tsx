"use client";

import { User } from "lucide-react";

interface SettingsAccountProps {
  user: {
    username: string;
    email: string;
  };
  handleClickEditProfile: () => void;
}

const SettingsAccount: React.FC<SettingsAccountProps> = ({ user, handleClickEditProfile }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <User className="h-5 w-5 text-blue-300" />
        <h3 className="text-lg font-bold text-white">Account Settings</h3>
      </div>

      <div className="grid gap-4">
        <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/10 backdrop-blur-sm">
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            readOnly
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
            value={user.username}
          />
        </div>

        <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/10 backdrop-blur-sm">
          <label className="block text-xs font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            readOnly
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
            value={user.email}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleClickEditProfile}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-green-400/25 hover:scale-105"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsAccount;