import { MessageIF } from "@/types/message.types";
import React from "react";


interface Props {
  messages: MessageIF[];
}

const RecentMedia: React.FC<Props> = ({ messages }) => {
  const recentImages = messages
    .filter((msg) => msg.media?.type === "image" && !msg.isDeleted)
    .slice(-10)
    .reverse();

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Media</h3>

      <div className="grid grid-cols-3 gap-2">
        {recentImages.map((message, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg aspect-square overflow-hidden"
          >
            <img
              src={message.media!.url}
              alt="media"
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMedia;
