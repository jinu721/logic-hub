import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import TextMessage from "./TextMessage";
import SystemMessage from "./SystemMessage";
import ImageMessage from "./ImageMessage";
import StickerMessage from "./StickerMessage";
import AudioMessage from "./AudioMessage";
import { MessageIF } from "@/types/message.types";

interface RenderMessageProps {
  message: MessageIF;
  isOther: boolean;
  isGroup: boolean;
  onDelete: (id: string) => void;
  onReport: (id: string) => void;
  onReply: (msg: MessageIF) => void;
  onReact: (id: string, emoji: string) => void;
  onReplyClick: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onVotePoll: (pollId: string, optionIndex: number, userId: string) => void;
  currentUserId: string;
  activeActionMessageId: string | null;
  setActiveActionMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  activeEmojiMessageId: string | null;
  setActiveEmojiMessageId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const renderMessage = ({
  message,
  isOther,
  isGroup,
  onDelete,
  onReport,
  onReply,
  onReact,
  onReplyClick,
  onEdit,
  onVotePoll,
  currentUserId,
  activeActionMessageId,
  setActiveActionMessageId,
  activeEmojiMessageId,
  setActiveEmojiMessageId,
}: RenderMessageProps) => {
  const props = {
    message,
    isOther,
    isGroup,
    onDelete,
    onReport,
    onReply,
    onReact,
    onReplyClick,
    onEdit,
    onVotePoll,
    currentUserId,
    activeActionMessageId,
    setActiveActionMessageId,
    activeEmojiMessageId,
    setActiveEmojiMessageId,
  };

  switch (message.type) {
    case "date":
      return (
        <div key={message._id} className="flex items-center justify-center">
          <div className="bg-gray-700 text-gray-300 text-xs rounded-full px-3 py-1">
            {message.content}
          </div>
        </div>
      );

    case "system":
      return (
        <SystemMessage
          key={message._id}
          {...{
            ...props,
            message: { ...message, content: message.content ?? "" },
          }}
        />
      );

    case "text":
      return <TextMessage key={message._id} {...props} />;

    case "image":
      return <ImageMessage key={message._id} {...props} />;

    case "sticker":
      return <StickerMessage key={message._id} {...props} />;

    case "audio":
      return <AudioMessage key={message._id} {...props} />;

    case "typing":
      return (
        <div key={message._id} className="flex items-start">
          <div
            className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold`}
          >
            {message?.sender?.avatar.image ? (
              <img
                src={message.sender.avatar.image}
                alt={message.sender.username}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            ) : (
              message.sender.username.charAt(0).toUpperCase()
            )}
          </div>
          <div className="ml-2 bg-gray-700 rounded-lg px-4 py-2 mt-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
