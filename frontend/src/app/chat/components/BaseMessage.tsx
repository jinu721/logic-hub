import { useState, useRef } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MessageReactions from "./MessageReactions";
import EmojiReactions from "./EmojiReactions";
import MessageStatus from "./MessageStatus";
import MessageActionMenu from "./MessageActionMenu";
import EditMessageModal from "./EditMessageModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { MessageIF } from "@/types/message.types";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

interface Props {
  message: MessageIF;
  isOther: boolean;
  isGroup: boolean;
  children: React.ReactNode;
  onEdit: (message: MessageIF) => void;
  onDelete: (id: string) => void;
  onReport: (id: string) => void;
  onReply: (message: MessageIF) => void;
  onReact: (id: string, emoji: string) => void;
  onReplyClick?: (id: string) => void;
  activeActionMessageId: string | null;
  setActiveActionMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  activeEmojiMessageId: string | null;
  setActiveEmojiMessageId: React.Dispatch<React.SetStateAction<string | null>>;
}

const BaseMessage = ({
  message,
  isOther,
  isGroup,
  children,
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
}: Props) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const emojisTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActive = activeActionMessageId === message._id;
  const isEmojiBarVisible = activeEmojiMessageId === message._id;

  const isSelf = !isOther;

  const router = useRouter();

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleEditSave = (editedContent: string) => {
    onEdit({ ...message, content: editedContent });
    setShowEditModal(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(message._id as string);
    setShowDeleteModal(false);
  };

  const handleReplyMessageClick = () => {
    if (message.replyTo && onReplyClick) {
      onReplyClick(message.replyTo._id as string);
    }
  };

  const Avatar = () => {
    if (!message.sender) return null;

    const hasAvatar = message.sender.avatar && message.sender.avatar.image;
    const username = message.sender.username || "";
    const initial = username.charAt(0).toUpperCase();
    const randomColors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-red-500",
    ];

    const colorIndex = username.length % randomColors.length;
    const bgColor = randomColors[colorIndex];

    if (hasAvatar) {
      return (
        <div onClick={() => router.push(`/profile/${message.sender.username}`)}>
          <img
            src={message.sender.avatar.image}
            alt={username}
            className="w-8 h-8 cursor-pointer rounded  object-cover flex-shrink-0 shadow-sm"
          />
        </div>
      );
    }

    return (
      <div
        onClick={() => router.push(`/profile/${message.sender.username}`)}
        className={`w-8 h-8 rounded flex-shrink-0 cursor-pointer flex items-center justify-center text-sm font-semibold text-white ${bgColor} shadow-sm`}
      >
        {initial}
      </div>
    );
  };

  const ReplyPreview = () => {
    if (!message.replyTo) return null;

    const replyMessage = message.replyTo;

    return (
      <div
        className="px-3 py-2 mb-1 bg-gray-700 bg-opacity-40 rounded-t-lg border-l-2 border-blue-400 cursor-pointer"
        onClick={handleReplyMessageClick}
      >
        <div className="flex items-center mb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 mr-1 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span onClick={() => router.push(`/profile/${message.sender.username}`)} className="text-xs font-medium text-blue-400 cursor-pointer">
            {replyMessage.sender?.username || "User"}
          </span>
        </div>
        <div className="text-xs text-gray-300 truncate">
          {replyMessage.type === "text" && replyMessage.content}
          {replyMessage.type === "image" && "📷 Image"}
          {replyMessage.type === "video" && "🎥 Video"}
          {replyMessage.type === "audio" && "🎵 Audio"}
          {replyMessage.type === "voice" && "🎤 Voice Message"}
          {replyMessage.type === "sticker" && "😊 Sticker"}
          {replyMessage.type === "document" && "📄 Document"}
        </div>
      </div>
    );
  };

  const renderMessageContent = () => {
    if (message.isDeleted) {
      return (
        <div
          className={`p-3 rounded-lg ${isSelf ? "bg-gray-700" : "bg-gray-800"
            } text-gray-400 italic`}
        >
          This message was deleted
        </div>
      );
    }

    return (
      <>
        {message.replyTo && <ReplyPreview />}
        {children}
        {message.isEdited && (
          <span className="text-xs text-gray-400 ml-2 italic">(edited)</span>
        )}
      </>
    );
  };

  return (
    <div
      className={`flex items-start mb-4 ${isSelf ? "justify-end" : "justify-start"
        }`}
    >
      {isOther && isGroup && <div className="mr-2">{<Avatar />}</div>}

      <div
        className={`max-w-xs sm:max-w-md relative ${isSelf ? "mr-2" : "ml-0"}`}
      >
        {isOther && isGroup && message.sender && (
          <div className="flex items-center gap-2">
            <div
              className={`text-sm font-medium ${message.sender.membership?.isActive
                  ? "bg-gradient-to-r from-amber-200 to-yellow-400 text-transparent bg-clip-text"
                  : "text-gray-100"
                }`}
            >
              {message.sender.username}
            </div>
          </div>
        )}

        <div className="flex flex-col">
          <div
            className="relative"
            onMouseEnter={() => {
              setActiveEmojiMessageId(message._id as string);
              clearTimeout(emojisTimeoutRef.current!);
            }}
            onMouseLeave={() => {
              emojisTimeoutRef.current = setTimeout(() => {
                setActiveEmojiMessageId(null);
              }, 300);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              setActiveActionMessageId(message._id as string);
            }}
          >
            {renderMessageContent()}

            {message.reactions && message.reactions.length > 0 && (
              <MessageReactions
                reactions={message.reactions}
                isGroup={isGroup}
              />
            )}

            {isSelf && (
              <MessageStatus
                isSeen={!!message.seenBy?.length}
                seenBy={message.seenBy as any[]}
                isGroup={isGroup}
              />
            )}

            {isOther && isEmojiBarVisible && (
              <EmojiReactions
                onReact={(emoji) => onReact(message._id as string, emoji)}
              />
            )}

            <div>
              {isActive && !message.isDeleted && (
                <MessageActionMenu
                  message={message}
                  isOther={isOther}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  onReport={() => onReport(message._id as string)}
                  onReply={() => onReply(message)}
                />
              )}
            </div>
          </div>

          <div
            className={`flex ${isSelf ? "justify-end" : "justify-start"} mt-1`}
          >
            <span className="text-xs text-gray-400">
              {dayjs(message.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>

      {!message.isDeleted && (
        <EditMessageModal
          isOpen={showEditModal}
          message={message}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default BaseMessage;
