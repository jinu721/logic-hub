import { FC } from "react"
import { LogOut,  UserX, MessageSquareX, AlertCircle } from "lucide-react"

type Props = {
  isGroupChat: boolean
  type: "removed-group" | "deleted-chat" | "blocked-user" | "archived-chat"
  handleLeaveGroup: () => void
  handleDeleteChat: () => void
  handleUnblock?: () => void
  handleRestore?: () => void
}

const AccessBlockedPanel: FC<Props> = ({ 
  isGroupChat, 
  type, 
  handleLeaveGroup, 
  handleDeleteChat, 
  handleUnblock, 
  handleRestore 
}) => {
  const getConfig = () => {
    switch (type) {
      case "removed-group":
        return {
          icon: UserX,
          title: "You've been removed from this group",
          description: "You no longer have access to this group conversation",
          buttonText: "Leave Group",
          buttonAction: handleLeaveGroup,
          buttonColor: "bg-red-600 hover:bg-red-700"
        }
      
      case "deleted-chat":
        return {
          icon: MessageSquareX,
          title: isGroupChat ? "This group has been deleted" : "This conversation has been deleted",
          description: isGroupChat 
            ? "This group is no longer available" 
            : "This conversation is no longer available",
          buttonText: isGroupChat ? "Leave Group" : "Delete Chat",
          buttonAction: isGroupChat ? handleLeaveGroup : handleDeleteChat,
          buttonColor: "bg-red-600 hover:bg-red-700"
        }
      
      case "blocked-user":
        return {
          icon: AlertCircle,
          title: "User blocked",
          description: "You have blocked this user. Unblock to continue messaging",
          buttonText: "Unblock User",
          buttonAction: handleUnblock || (() => {}),
          buttonColor: "bg-blue-600 hover:bg-blue-700"
        }
      
      case "archived-chat":
        return {
          icon: MessageSquareX,
          title: isGroupChat ? "Group archived" : "Chat archived",
          description: isGroupChat 
            ? "This group has been moved to your archived conversations" 
            : "This conversation has been moved to your archived chats",
          buttonText: "Restore Chat",
          buttonAction: handleRestore || (() => {}),
          buttonColor: "bg-green-600 hover:bg-green-700"
        }
      
      default:
        return {
          icon: AlertCircle,
          title: "Access restricted",
          description: "This conversation is currently unavailable",
          buttonText: "Close",
          buttonAction: () => {},
          buttonColor: "bg-gray-600 hover:bg-gray-700"
        }
    }
  }

  const config = getConfig()
  const IconComponent = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="p-2 rounded-full bg-gray-700/50 mb-3">
        <IconComponent size={20} className="text-gray-400" />
      </div>
      
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-sm font-medium text-gray-300">
          {config.title}
        </h3>
        <p className="text-xs text-gray-500 max-w-xs">
          {config.description}
        </p>
      </div>
      
      <button
        onClick={config.buttonAction}
        className={`px-3 py-1.5 ${config.buttonColor} text-white rounded text-xs font-medium transition-colors duration-200 flex items-center space-x-1.5`}
      >
        <LogOut size={12} />
        <span>{config.buttonText}</span>
      </button>
    </div>
  )
}

export default AccessBlockedPanel