"use client"

import React from "react"
import { Shield, X } from "lucide-react"
import { UserIF,User } from "@/types/user.types";

type Props = {
  user: User
  userData: UserIF
  usernameError: string
  isCheckingUsername: boolean
  setUser: React.Dispatch<React.SetStateAction<User>>
}

const EditInformations: React.FC<Props> = ({
  user,
  userData,
  usernameError,
  isCheckingUsername,
  setUser
}) => {
  return (
    <div className="xl:col-span-2 bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/30">
          <Shield size={24} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Personal Information</h2>
          <p className="text-gray-400 text-sm">Manage your account details</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Display Name</label>
          <div className="relative">
            <input
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className={`w-full bg-gray-900/80 backdrop-blur-sm border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 ${
                usernameError
                  ? "border-red-500/50 focus:ring-red-500/50 focus:border-red-500"
                  : isCheckingUsername
                  ? "border-yellow-500/50 focus:ring-yellow-500/50 focus:border-yellow-500"
                  : "border-gray-600/50 focus:ring-blue-500/50 focus:border-blue-500"
              }`}
            />
            {isCheckingUsername && (
              <div className="absolute right-4 top-3.5 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-yellow-400 text-sm font-medium">Checking...</span>
              </div>
            )}
            {!isCheckingUsername &&
              !usernameError &&
              user.username !== userData.username && (
                <div className="absolute right-4 top-3.5 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-400 text-sm font-medium">Available</span>
                </div>
              )}
          </div>
          {usernameError && (
            <p className="text-sm text-red-400 flex items-center gap-2">
              <X size={14} />
              {usernameError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full bg-gray-900/50 border border-gray-600/30 rounded-xl px-4 py-3 focus:outline-none opacity-60 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <Shield size={12} />
            Email cannot be changed for security reasons
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Bio</label>
          <textarea
            value={user.bio}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
            className="w-full bg-gray-900/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none transition-all duration-300"
            placeholder="Tell others about yourself, your skills, and interests..."
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">Share your story with the community</p>
            <p className="text-xs text-gray-400 font-medium">{user.bio?.length}/500 characters</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditInformations
