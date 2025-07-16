import { UserIF } from "@/types/user.types";
import { UserX, Trash2, Flag, LogOut } from "lucide-react";

type ChatSettingsProps = {
  isGroupChat: boolean;
  isBlocked: boolean;
  userRole: "owner" | "admin" | "member";
  otherUser: UserIF | null;
  handleMemberAction: (userId: string, action: "block" | "unblock") => void;
  handleDeleteGroup: () => void;
  handleLeaveGroup: () => void;
  handleDeleteChat: () => void;
  setReportPopupOpen: (value: boolean) => void;
};

const ChatSettings: React.FC<ChatSettingsProps> = ({
  isGroupChat,
  isBlocked,
  userRole,
  otherUser,
  handleMemberAction,
  handleDeleteGroup,
  handleLeaveGroup,
  handleDeleteChat,
  setReportPopupOpen,
}) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium text-gray-300 mb-2">
      {isGroupChat ? "Group Settings" : "Chat Settings"}
    </h3>
    <div className="space-y-3">
      {!isGroupChat && otherUser && (
        <button
          onClick={() =>
            isBlocked
              ? handleMemberAction(otherUser._id, "unblock")
              : handleMemberAction(otherUser._id, "block")
          }
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 text-red-400 hover:text-red-300"
        >
          <UserX size={16} className="mr-3" />
          <span className="text-sm">
            {isBlocked ? "Unblock User" : "Block User"}
          </span>
        </button>
      )}

      {isGroupChat ? (
        userRole === "owner" ? (
          <button
            onClick={handleDeleteGroup}
            className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} className="mr-3" />
            <span className="text-sm">Delete Group</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => setReportPopupOpen(true)}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 text-yellow-500 hover:text-yellow-400"
            >
              <Flag size={16} className="mr-3" />
              <span className="text-sm">Report Group</span>
            </button>
            <button
              onClick={handleLeaveGroup}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 text-red-400 hover:text-red-300"
            >
              <LogOut size={16} className="mr-3" />
              <span className="text-sm">Leave Group</span>
            </button>
          </>
        )
      ) : (
        <button
          onClick={handleDeleteChat}
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 text-red-400 hover:text-red-300"
        >
          <Trash2 size={16} className="mr-3" />
          <span className="text-sm">Delete Chat</span>
        </button>
      )}
    </div>
  </div>
);

export default ChatSettings;
