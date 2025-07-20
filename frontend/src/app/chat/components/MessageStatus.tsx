import { FC, useState } from "react";

interface SeenByUser {
  username: string;
  isOnline: boolean;
  avatar: {
    image: string;
  };
}

interface MessageStatusProps {
  isSeen: boolean;
  seenBy?: SeenByUser[];
  isGroup: boolean;
}

const MessageStatus: FC<MessageStatusProps> = ({
  isSeen,
  seenBy = [],
  isGroup,
}) => {
  const [showSeenBy, setShowSeenBy] = useState(false);


  console.log("SEEN BY", seenBy);
  console.log("IS SEEN", isSeen);

  return (
    <div className="flex items-center mt-1 text-xs relative">
      {!isGroup ? (
        <div className="text-gray-400">
          {isSeen ? (
            <div className="flex items-center space-x-0.5">
              <div className="relative flex items-center">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  className="text-blue-400"
                >
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  className="text-blue-400 -ml-1"
                >
                  <path
                    fill="currentColor"
                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                className="text-gray-500"
              >
                <path
                  fill="currentColor"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                className="text-gray-600 -ml-1"
              >
                <path
                  fill="currentColor"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
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
            <div className="flex -space-x-1">
              {seenBy.slice(0, 2).map((user, idx) => (
                <div
                  key={idx}
                  className="relative w-4 h-4 rounded-full border border-gray-600 bg-gray-700"
                  style={{ zIndex: 10 - idx }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar.image}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[6px] font-medium">
                      {user.username
                        ? user.username.charAt(0).toUpperCase()
                        : "Unknown"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {seenBy.length > 2 && (
              <span className="ml-1 text-[9px] text-gray-500 font-medium">
                +{seenBy.length - 2}
              </span>
            )}

            {showSeenBy && (
              <div className="absolute bottom-6 right-0 bg-gray-800 rounded-lg p-2 shadow-xl z-50 w-48 border border-gray-700">
                <div className="text-[10px] font-medium text-gray-300 mb-1.5 flex items-center">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mr-1.5"></div>
                  Seen by {seenBy.length}
                </div>
                <div className="max-h-24 overflow-y-auto space-y-0.5">
                  {seenBy.map((user, idx) => (
                    <div
                      key={idx}
                      className="flex items-center py-1 hover:bg-gray-700 rounded px-1 -mx-1 transition-colors"
                    >
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar.image}
                            alt={user.username}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-[6px] font-medium">
                            {user.username
                              ? user.username.charAt(0).toUpperCase()
                              : "Unknown"}
                          </div>
                        )}
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full border border-gray-800"></div>
                        )}
                      </div>
                      <span className="ml-1.5 text-[10px] text-gray-300 font-medium truncate">
                        {user.username}
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
