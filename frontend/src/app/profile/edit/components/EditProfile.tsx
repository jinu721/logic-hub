"use client";

import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import {
  checkUser,
  getMyProfile,
  updateUser,
} from "@/services/client/clientServices";
import { User, UserIF } from "@/types/user.types";
import EditHeader from "./EditHeader";
import EditInformations from "./EditInformations";
import EditStats from "./EditStats";
import { useRouter } from "next/navigation";
import { InventoryIF } from "@/types/inventory.types";
import Spinner from "@/components/shared/CustomLoader";

const EditProfile = () => {
  const [userData, setUserData] = useState<UserIF | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    bio: "",
    twoFactorEnabled: false,
    notifications: true,
    avatar: "",
    banner: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [formValid, setFormValid] = useState(true);

  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getMyProfile();
        const user = response.user;
        setUserData(user);
        setUser({
          username: user.username || "",
          email: user.email || "",
          bio: user.bio || "",
          twoFactorEnabled: user.twoFactorEnabled || false,
          notifications:
            user.notifications !== undefined ? user.notifications : true,
          avatar: user.avatar?._id || "",
          banner: user.banner?._id || "",
        });
        setCurrentAvatar(user.avatar?.image);
        setCurrentBanner(user.banner?.image);
      } catch (err) {
        console.error("Error loading user data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;

    if (user.username === userData.username) {
      setUsernameError("");
      setUsernameAvailable(true);
      return;
    }

    if (user.username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      setFormValid(false);
      return;
    }

    if (user.username.length > 20) {
      setUsernameError("Username must be less than 20 characters");
      setFormValid(false);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(user.username)) {
      setUsernameError("Only letters, numbers, and underscores allowed");
      setFormValid(false);
      return;
    }

    const timer = setTimeout(() => {
      checkUsernameAvailability(user.username);
    }, 500);

    return () => clearTimeout(timer);
  }, [user.username, userData?.username]);

  useEffect(() => {
    setFormValid(
      !usernameError &&
        usernameAvailable &&
        user.username.length >= 3 &&
        !isCheckingUsername
    );
  }, [user.username, usernameError, usernameAvailable, isCheckingUsername]);

  const checkUsernameAvailability = async (username: string) => {
    setIsCheckingUsername(true);
    try {
      const response = await checkUser({ type: "username", value: username });
      if (!response.status) {
        setUsernameError("Username is already taken");
        setUsernameAvailable(false);
      } else {
        setUsernameError("");
        setUsernameAvailable(true);
      }
    } catch (err) {
      console.error(err);
      setUsernameError("Error checking username");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const selectAvatar = (item: InventoryIF) => {
    setUser((prev) => ({ ...prev, avatar: item._id ?? null }));

    setCurrentAvatar(item.image);
  };

  const selectBanner = (item: InventoryIF) => {
    setUser((prev) => ({ ...prev, banner: item._id ?? null }));
    setCurrentBanner(item.image);
  };

  const handleSubmit = async () => {
    if (!formValid) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await updateUser(user);
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner />
        </div>
      ) : userData ? (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
            <EditHeader
              user={user}
              userData={userData}
              currentBanner={currentBanner}
              currentAvatar={currentAvatar}
              updateAvatar={selectAvatar}
              updateBanner={selectBanner}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <EditInformations
                user={user}
                userData={userData}
                usernameError={usernameError}
                isCheckingUsername={isCheckingUsername}
                setUser={setUser}
              />
              <EditStats user={user} userData={userData} setUser={setUser} />
            </div>

            {submitSuccess && (
              <div className="bg-green-600/10 border border-green-400 text-green-300 px-6 py-4 rounded-xl flex items-center gap-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span>Profile updated successfully!</span>
              </div>
            )}

            {submitError && (
              <div className="bg-red-600/10 border border-red-400 text-red-300 px-6 py-4 rounded-xl flex items-center gap-3">
                <X size={20} className="text-red-400" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-6 border-t border-gray-700/50">
              <button
                onClick={handleCancel}
                className="bg-gray-800/80 hover:bg-gray-700/80 px-6 py-3 cursor-pointer rounded-xl flex items-center gap-2 transition-all border border-gray-600/50"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>

              <button
                onClick={handleSubmit}
                disabled={!formValid || isSubmitting}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer  font-medium transition-all duration-300 ${
                  formValid
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border border-blue-500/20"
                    : "bg-gray-600/50 cursor-not-allowed border border-gray-600/30"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EditProfile;
