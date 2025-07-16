import { FC } from "react";
import { Pencil, Trash, Reply, Flag } from "lucide-react";
import { MessageIF } from "@/types/message.types";

interface MessageActionMenuProps {
  message: MessageIF;
  isOther: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: () => void;
  onReply: (message: MessageIF) => void;
}

const MessageActionMenu: FC<MessageActionMenuProps> = ({
  message,
  isOther,
  onEdit,
  onDelete,
  onReport,
  onReply,
}) => {
  return (
    <div className="absolute -top-10 right-0 bg-gray-800 rounded-lg p-1 flex space-x-1 shadow-lg z-20 border border-gray-700">
      {!isOther ? (
        <>
          {message.type === "text" && (
            <button
              onClick={onEdit}
              className="hover:bg-gray-700 rounded-full p-1.5 transition-colors"
              aria-label="Edit message"
            >
              <Pencil size={14} className="text-gray-300" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="hover:bg-gray-700 rounded-full p-1.5 transition-colors"
            aria-label="Delete message"
          >
            <Trash size={14} className="text-gray-300" />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onReply(message)}
            className="hover:bg-gray-700 rounded-full p-1.5 transition-colors"
            aria-label="Reply to message"
          >
            <Reply size={14} className="text-gray-300" />
          </button>
          <button
            onClick={onReport}
            className="hover:bg-gray-700 rounded-full p-1.5 transition-colors"
            aria-label="Report message"
          >
            <Flag size={14} className="text-gray-300" />
          </button>
        </>
      )}
    </div>
  );
};

export default MessageActionMenu;
