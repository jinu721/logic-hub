"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Shield } from "lucide-react";

interface UserSettings {
  twoFactorEnabled: boolean;
  avatar: any;
  banner: any;
}

interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface SettingsSecurityProps {
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  handleChangePassword: () => void;
  isLoading: boolean;
  errors: Errors;
  handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsSecurity:React.FC<SettingsSecurityProps> = ({
  userSettings,
  setUserSettings,
  handleChangePassword,
  isLoading,
  errors,
  handleChangeInput,
}) => {
  const router = useRouter();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-4">
        <Lock className="h-5 w-5 text-green-300" />
        <h3 className="text-lg font-bold text-white">Security Settings</h3>
      </div>

      <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-white">Change Password</h4>
          <button
            onClick={() => router.push("/auth/forgot")}
            className="text-xs text-blue-300 hover:text-blue-200 transition-colors duration-200"
          >
            Forgot Password?
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                name="currentPassword"
                onChange={handleChangeInput}
                type={showCurrentPassword ? "text" : "password"}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl p-3 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-300 text-xs mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  onChange={handleChangeInput}
                  type={showNewPassword ? "text" : "password"}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl p-3 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
                  placeholder="New password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-300 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  onChange={handleChangeInput}
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl p-3 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-300 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-blue-400/25 hover:scale-105"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/10 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-white mb-3">
          Two-Factor Authentication
        </h4>
        <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-300" />
            <div>
              <div className="font-medium text-white text-sm">Enable 2FA</div>
              <div className="text-xs text-slate-300">Extra security layer</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={userSettings.twoFactorEnabled}
              onChange={() =>
                setUserSettings((prevSettings) => ({
                  ...prevSettings,
                  twoFactorEnabled: !prevSettings.twoFactorEnabled,
                }))
              }
            />
            <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
        </div>
      </div>
    </div>
  );
}

export default SettingsSecurity;
