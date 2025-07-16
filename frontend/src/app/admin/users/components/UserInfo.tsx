import React from "react";
import { InfoCard } from "./InfoCard";
import { InfoItem } from "./InfoItem"
import { formatDate } from "@/utils/date.format";
import { UserIF } from "@/types/user.types";

interface UserInfoProps {
  user: UserIF;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <InfoCard title="User Information">
        <InfoItem
          label="Account Status"
          value={user.isBanned ? "Banned" : "Active"}
          valueColor={user.isBanned ? "text-red-400" : "text-green-400"}
        />
        <InfoItem
          label="Verification"
          value={user.isVerified ? "Verified" : "Unverified"}
          valueColor={user.isVerified ? "text-blue-400" : "text-gray-300"}
        />
        <InfoItem
          label="2FA"
          value={user.twoFactorEnabled ? "Enabled" : "Disabled"}
          valueColor={user.twoFactorEnabled ? "text-blue-400" : "text-gray-300"}
        />
        <InfoItem label="Joined" value={formatDate(user.timestamp)} />
        <InfoItem
          label="Last Active"
          value={user.lastSeen ? formatDate(user.lastSeen.toString()) : "Unknown"}
        />
      </InfoCard>

      <InfoCard title="User Stats">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Level</span>
            <div className="bg-gray-900 px-4 py-1 rounded-full">
              <span className="text-blue-400 font-bold">{user.stats.level}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${(user.stats.xpPoints % 1000) / 10}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-gray-400 text-xs">
            <span>{user.stats.xpPoints % 1000} XP</span>
            <span>{Math.floor(user.stats.xpPoints / 1000) * 1000 + 1000} XP</span>
          </div>
        </div>
        <InfoItem
          label="Daily Streak"
          value={`${user.stats.currentStreak} days`}
          valueColor="text-yellow-400"
        />
        <InfoItem label="Longest Streak" value={user.stats.longestStreak.toString()} />
        <InfoItem
          label="XP Points"
          value={user.stats.totalXpPoints.toString()}
          valueColor="text-emerald-400"
        />
      </InfoCard>
    </div>
  );
};

export default UserInfo;
