import { UserIF } from "@/types/user.types";
import { FC } from "react";


interface UserReactionItemProps {
  user: UserIF;
}

const UserReactionItem: FC<UserReactionItemProps> = ({ user }) => {
  const hasAvatar = user.avatar?.image;
  const username = user.username || "";
  const initial = username.charAt(0).toUpperCase();

  const randomColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const colorIndex = username.length % randomColors.length;
  const bgColor = randomColors[colorIndex];

  return (
    <div className="flex items-center space-x-2">
      {hasAvatar ? (
        <img
          src={user.avatar.image}
          alt={username}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      ) : (
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold text-white ${bgColor}`}
        >
          {initial}
        </div>
      )}
      <span className="text-sm text-gray-200">{username}</span>
    </div>
  );
};

export default UserReactionItem;
