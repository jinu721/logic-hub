"use client";

import React, { useEffect, useState } from "react";
import { Bell, Lock, CreditCard, User, X, Settings as SettingsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  cancelMembership,
  changePassword,
  toggleUserNotification,
  updateUser,
} from "@/services/client/clientServices";
import { validation } from "@/utils/validations.helper";
import { axiosInstance } from "@/services/apiServices";
import { logout } from "@/redux/slices/authSlice";
import { useToast } from "@/context/Toast";

import DeleteConfirmationModal from "@/components/shared/Delete";
import SettingsAccount from "./SettingsAccount";
import SettingsSecurity from "./SettingsSecurity";
import SettingsNotification from "./SettingsNotification";
import SettingsPremium from "./SettingsPremium";
import SettingsSidebar from "./SettingsSidebar";

interface SettingsProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, isOpen, onClose }) => {

  const [notification, setNotification] = useState<boolean>(user.notifications);
  const [activeSection, setActiveSection] = useState<string>("account");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userSettings, setUserSettings] = useState({
    twoFactorEnabled: user?.twoFactorEnabled || false,
    avatar: user?.avatar || null,
    banner: user?.banner || null,
  });
  const [logoutModel, setLogoutModel] = useState(false);
  const [cancelModel, setCancelModel] = useState(false);

  const { showToast } = useToast() as any;
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const updateSettings = async () => {
      try {
        await updateUser(userSettings);
      } catch (err) {
        console.error(err);
      }
    };
    updateSettings();
  }, [userSettings]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "newPassword" && validation("password", value)) {
      setErrors((prev) => ({ ...prev, newPassword: validation("password", value) as string }));
    } else if (name === "confirmPassword" && value !== formData.newPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleChangePassword = async () => {
    if (!Object.values(errors).every((err) => !err)) return;

    setIsLoading(true);
    try {
      await changePassword(formData.newPassword, formData.currentPassword);
      showToast({ type: "success", message: "Password Changed Successfully" });
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      console.error(err);
      if (err.response?.data?.message?.includes("password")) {
        setErrors((prev) => ({ ...prev, currentPassword: err.response.data.message }));
      } else {
        showToast({ type: "error", message: "Error Changing password" });
      }
    }
  };

  const handleConfirmLogout = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/logout", null, { withCredentials: true });
      dispatch(logout());
      localStorage.clear();
      router.push("/auth/login");
    } catch (err) {
      console.error(err);
      showToast({ type: "error", message: "Error Logging out" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutUser = () => setLogoutModel(true);
  const handleCancelMembership = () => setCancelModel(true);

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    try {
      await cancelMembership();
      user.membership.isActive = false;
      setCancelModel(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNotifications = async () => {
    setNotification((prev: boolean) => !prev);
    try {
      await toggleUserNotification();
    } catch (err) {
      console.error(err);
      showToast({ type: "error", message: "Error Toggling Notifications" });
    }
  };

  const handleClickEditProfile = () => {
    onClose();
    router.push("/profile/edit");
  };

  if (!isOpen) return null;

  const menuItems = [
    { id: "account", icon: User, label: "Account", color: "text-blue-400" },
    { id: "security", icon: Lock, label: "Security", color: "text-green-400" },
    { id: "notifications", icon: Bell, label: "Notifications", color: "text-yellow-400" },
    { id: "premium", icon: CreditCard, label: "Premium", color: "text-purple-400" },
  ];

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-slate-800/80 to-slate-900/80">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                <SettingsIcon className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Settings</h2>
                <p className="text-slate-300 text-xs">Manage preferences</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-2xl transition-all duration-200 text-slate-300 hover:text-white group">
              <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          <div className="flex h-[calc(85vh-80px)]">
            <SettingsSidebar
              user={user}
              menuItems={menuItems}
              activeSection={activeSection}
              toggleSection={setActiveSection}
              handleLogoutUser={handleLogoutUser}
            />

            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-900/30 to-slate-800/30">
              {activeSection === "account" && (
                <SettingsAccount user={user} handleClickEditProfile={handleClickEditProfile} />
              )}
              {activeSection === "security" && (
                <SettingsSecurity
                  userSettings={userSettings}
                  setUserSettings={setUserSettings}
                  handleChangePassword={handleChangePassword}
                  isLoading={isLoading}
                  errors={errors}
                  handleChangeInput={handleChangeInput}
                />
              )}
              {activeSection === "notifications" && (
                <SettingsNotification
                  notification={notification}
                  toggleNotifications={toggleNotifications}
                />
              )}
              {activeSection === "premium" && (
                <SettingsPremium
                  user={user}
                  handleCancelMembership={handleCancelMembership}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {logoutModel && (
        <DeleteConfirmationModal
          isOpen={logoutModel}
          onClose={() => setLogoutModel(false)}
          onConfirm={handleConfirmLogout}
          isLoading={isLoading}
        />
      )}

      {cancelModel && (
        <DeleteConfirmationModal
          isOpen={cancelModel}
          onClose={() => setCancelModel(false)}
          onConfirm={handleConfirmCancel}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default Settings;