import React, { RefObject, useState } from "react";
import { MessageSquare } from "lucide-react";
import { MessageIF } from "@/types/message.types";
import { ConversationIF } from "@/types/conversation.types";
import { UserIF } from "@/types/user.types";

interface ChatMessagesProps {
  messages: MessageIF[];
  currentUserId: string;
  currentConversationData: ConversationIF;
  chatContainerRef: RefObject<HTMLDivElement>;
  messageRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  messagesEndRef: RefObject<HTMLDivElement>;
  isGroup: boolean;
  renderMessage: (props: {
    message: MessageIF;
    isOther: boolean;
    isGroup: boolean;
    onDelete: (id: string) => void;
    onReport: (id: string) => void;
    onReply: (message: MessageIF) => void;
    onReact: (id: string, emoji: string) => void;
    onReplyClick: (messageId: string) => void;
    onEdit: (message: MessageIF) => void;
    currentUserId: string;
    activeActionMessageId: string | null;
    setActiveActionMessageId: React.Dispatch<
      React.SetStateAction<string | null>
    >;
    activeEmojiMessageId: string | null;
    setActiveEmojiMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  }) => React.ReactNode;
  handleDeleteMessage: (id: string) => void;
  handleReportMessage: (id: string) => void;
  handleReplyMessage: (message: MessageIF) => void;
  handleReactMessage: (id: string, emoji: string) => void;
  handleReplyClick: (messageId: string) => void;
  handleEditMessage: (message: MessageIF) => void;
  typingUsers: UserIF[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  currentUserId,
  currentConversationData,
  chatContainerRef,
  messageRefs,
  messagesEndRef,
  isGroup,
  renderMessage,
  handleDeleteMessage,
  handleReportMessage,
  handleReplyMessage,
  handleReactMessage,
  handleReplyClick,
  handleEditMessage,
  typingUsers,
}) => {
  const [activeActionMessageId, setActiveActionMessageId] = useState<
    string | null
  >(null);
  const [activeEmojiMessageId, setActiveEmojiMessageId] = useState<
    string | null
  >(null);

  return (
    <>
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={chatContainerRef}
      >
        {messages && messages.length > 0 ? (
          <>
            {messages.map((message, index) => {
              const isOther =
                message.sender?.userId !== currentConversationData.currentUserId;

              return (
                <div
                  key={index}
                  ref={(el) => {
                    if (el) messageRefs.current[message._id as string] = el;
                  }}
                >
                  {renderMessage({
                    message,
                    isOther,
                    isGroup,
                    onDelete: handleDeleteMessage,
                    onReport: handleReportMessage,
                    onReply: handleReplyMessage,
                    onReact: handleReactMessage,
                    onReplyClick: handleReplyClick,
                    onEdit: handleEditMessage,
                    currentUserId,
                    activeActionMessageId,
                    setActiveActionMessageId,
                    activeEmojiMessageId,
                    setActiveEmojiMessageId,
                  })}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare size={48} strokeWidth={1.5} />
            <p className="mt-4 text-lg font-medium">No messages yet</p>
            <p className="text-sm">
              Start the conversation by sending a message
            </p>
          </div>
        )}
      </div>
      {typingUsers.length > 0 && (
        <div className="bg-gray-800/70 rounded py-1 px-2 flex items-center gap-2 max-w-fit">
          <div className="flex">
            {typingUsers.slice(0, 2).map((user) => (
              <div
                key={user._id}
                className="w-6 h-6 rounded-sm overflow-hidden border border-gray-700"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar.image}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-xs">
                    {user?.username?.[0].toUpperCase()}
                  </div>
                )}
              </div>
            ))}

            {typingUsers.length > 2 && (
              <div className="w-6 h-6 rounded-sm bg-gray-700 flex items-center justify-center text-gray-300 text-xs">
                +{typingUsers.length - 2}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <div className="flex space-x-1">
              <span
                className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessages;
