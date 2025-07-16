import { FC, useState } from "react";

interface SeenByUser {
  name: string;
  avatar: string;
  avatarColor?: string; 
}

interface MessageStatusProps {
  isSeen: boolean;
  seenBy?: SeenByUser[];
  isGroup: boolean;
}

const MessageStatus: FC<MessageStatusProps> = ({ isSeen, seenBy = [], isGroup }) => {
  const [showSeenBy, setShowSeenBy] = useState(false);

  return (
    <div className="flex items-center mt-1 text-xs relative">
      {!isGroup ? (
        <div className="text-gray-400">
          {isSeen ? (
            <div className="flex -space-x-1">
              <div className="h-3 w-3 rounded-full border border-gray-500"></div>
              <div className="h-3 w-3 rounded-full border border-gray-500"></div>
            </div>
          ) : (
            <div className="flex -space-x-1">
              <div className="h-3 w-3 rounded-full border border-gray-400"></div>
            </div>
          )}
        </div>
      ) : (
        seenBy.length > 0 && (
          <div
            className="text-gray-400 flex items-center cursor-pointer"
            onMouseEnter={() => setShowSeenBy(true)}
            onMouseLeave={() => setShowSeenBy(false)}
          >
            <div className="flex -space-x-2">
              {seenBy.slice(0, 3).map((user, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full bg-gray-600 border border-gray-800 flex items-center justify-center text-[8px]"
                >
                  {user.avatar}
                </div>
              ))}
            </div>
            {seenBy.length > 3 && (
              <span className="ml-1 text-[10px]">+{seenBy.length - 3}</span>
            )}
            {showSeenBy && (
              <div className="absolute bottom-6 right-0 bg-gray-800 rounded-md p-2 shadow-lg z-20 w-48 border border-gray-700">
                <h4 className="text-xs font-medium text-gray-300 mb-1">
                  Seen by:
                </h4>
                <div className="max-h-24 overflow-y-auto">
                  {seenBy.map((user, idx) => (
                    <div key={idx} className="flex items-center py-1">
                      <div
                        className={`w-5 h-5 rounded-full ${
                          user.avatarColor ?? "bg-gray-600"
                        } flex items-center justify-center text-[10px]`}
                      >
                        {user.avatar}
                      </div>
                      <span className="ml-2 text-xs text-gray-200">
                        {user.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default MessageStatus;
