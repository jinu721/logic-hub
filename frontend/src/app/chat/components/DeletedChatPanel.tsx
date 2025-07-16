import { FC } from "react"
import { LogOut } from "lucide-react"

type Props = {
  isGroupChat: boolean
  handleLeaveGroup: () => void
  handleDeleteChat: () => void
}

const DeletedChatPanel: FC<Props> = ({ isGroupChat, handleLeaveGroup, handleDeleteChat }) => (
  <div className="flex flex-col items-center justify-center py-3 bg-gray-700 rounded-lg">
    <p className="text-sm text-gray-300 mb-3">
      {isGroupChat ? "This group has been deleted" : "This conversation has been deleted"}
    </p>
    <button
      onClick={isGroupChat ? handleLeaveGroup : handleDeleteChat}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center text-sm font-medium"
    >
      <LogOut size={16} className="mr-2" />
      {isGroupChat ? "Leave Group" : "Delete Chat"}
    </button>
  </div>
)

export default DeletedChatPanel
