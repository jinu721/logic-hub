import React from "react";
import BaseMessage from "./BaseMessage";
import { MessageIF } from "@/types/message.types";

interface ImageMessageProps {
  message: MessageIF;
  isOther: boolean;
  isGroup: boolean;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReport: (id: string) => void;
  onReply: (msg: MessageIF) => void;
  onReact: (id: string, emoji: string) => void;
  onReplyClick: (id: string) => void;
  activeActionMessageId: string | null;
  setActiveActionMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  activeEmojiMessageId: string | null;
  setActiveEmojiMessageId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageMessage: React.FC<ImageMessageProps> = ({
  message,
  isOther,
  isGroup,
  onEdit,
  onDelete,
  onReport,
  onReply,
  onReact,
  onReplyClick,
  activeActionMessageId,
  setActiveActionMessageId,
  activeEmojiMessageId,
  setActiveEmojiMessageId,
}) => {
  const isSelf = !isOther;

  return (
    <BaseMessage
      message={message}
      isOther={isOther}
      isGroup={isGroup}
      onEdit={onEdit}
      onDelete={onDelete}
      onReport={onReport}
      onReply={onReply}
      onReact={onReact}
      onReplyClick={onReplyClick}
      activeActionMessageId={activeActionMessageId}
      setActiveActionMessageId={setActiveActionMessageId}
      activeEmojiMessageId={activeEmojiMessageId}
      setActiveEmojiMessageId={setActiveEmojiMessageId}
    >
      <div
        className={`${
          isSelf ? "bg-purple-600" : "bg-gray-700"
        } rounded-lg p-3 mt-1`}
      >
        {message.content && <p className="text-sm mb-2">{message.content}</p>}
        {message.media?.url && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={message.media.url}
              alt="Media content"
              className="w-full h-auto max-h-64 object-contain bg-gray-800"
            />
          </div>
        )}
      </div>
    </BaseMessage>
  );
};

export default ImageMessage;
