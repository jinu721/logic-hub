import React from "react";
import BaseMessage from "./BaseMessage";
import { MessageIF } from "@/types/message.types";

interface StickerMessageProps {
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

const StickerMessage: React.FC<StickerMessageProps> = ({
  message,
  isOther,
  isGroup,
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
  return (
    <BaseMessage
      message={message}
      isOther={isOther}
      isGroup={isGroup}
      onDelete={onDelete}
      onReport={onReport}
      onReply={onReply}
      onReact={onReact}
      onEdit={() => {}}
      onReplyClick={onReplyClick}
      activeActionMessageId={activeActionMessageId}
      setActiveActionMessageId={setActiveActionMessageId}
      activeEmojiMessageId={activeEmojiMessageId}
      setActiveEmojiMessageId={setActiveEmojiMessageId}
    >
      <div className="mt-1 inline-block">
        <img
          src={message?.media?.url}
          alt="Sticker"
          className="w-32 h-32 object-contain rounded-lg"
        />
      </div>
    </BaseMessage>
  );
};

export default StickerMessage;
