import React from "react";
import BaseMessage from "./BaseMessage";
import { MessageIF } from "@/types/message.types";

interface TextMessageProps {
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

const TextMessage: React.FC<TextMessageProps> = ({
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
        <p className="text-sm">{message.content}</p>
      </div>
    </BaseMessage>
  );
};

export default TextMessage;
