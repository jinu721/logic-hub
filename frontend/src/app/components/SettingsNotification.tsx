"use client";

import { FC } from "react";
import { Bell } from "lucide-react";

interface SettingsNotificationProps {
  notification: boolean;
  toggleNotifications: () => void;
}

const SettingsNotification: FC<SettingsNotificationProps> = ({
  notification,
  toggleNotifications,
}) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-3 mb-4">
      <Bell className="h-5 w-5 text-yellow-300" />
      <h3 className="text-lg font-bold text-white">Notification Settings</h3>
    </div>

    <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/10 backdrop-blur-sm">
      <h4 className="text-sm font-semibold text-white mb-3">
        Push Notifications
      </h4>

      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl border border-slate-600/30">
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-yellow-300" />
          <div>
            <div className="font-medium text-white text-sm">
              Enable Notifications
            </div>
            <div className="text-xs text-slate-300">Activity updates</div>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={notification}
            onChange={toggleNotifications}
          />
          <div className="relative w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500" />
        </label>
      </div>
    </div>
  </div>
);

export default SettingsNotification;
