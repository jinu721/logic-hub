import React from "react";
import { CollectionCard } from "./CollectionCard";
import { Award } from "lucide-react";
// import { formatDate } from "@/utils/date.format";
import { UserIF } from "@/types/user.types";



interface UserBadgesProps {
  user: UserIF;
  handleGiftClick: (type: "badges") => void;
}

const UserBadges: React.FC<UserBadgesProps> = ({
  user,
  handleGiftClick,
}) => {
  const badges = user.inventory.badges || [];

  return (
    <CollectionCard
      title="Badge Collection"
      buttonText="Gift Badge"
      onButtonClick={() => handleGiftClick("badges")}
      itemCount={badges.length}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.length > 0 ? (
          badges.map((badge) => {

            return (
              <div
                key={badge._id}
                className="bg-gray-700 p-4 rounded-lg flex items-center border border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                  {badge.image ? (
                    <img
                      src={badge.image}
                      alt={badge.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Award size={24} className="text-white" />
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {badge.name}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {badge.description}
                  </div>
                  {/* {badge.awardedAt && (
                    <div className="text-gray-400 text-xs mt-1">
                      Awarded: {formatDate(badge.awardedAt)}
                    </div>
                  )} */}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400">No badges earned</p>
        )}
      </div>
    </CollectionCard>
  );
};

export default UserBadges;
