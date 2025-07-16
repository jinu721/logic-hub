import { useRef } from "react";
import { Image, Mic, Plus, Reply, Send, Smile, X } from "lucide-react";
import { MessageIF } from "@/types/message.types";

type MessageType = "text" | "image" | "poll" | "audio" | "file";

interface Sticker {
  id: string;
  url: string;
}

interface Props {
  stickers: Sticker[];
  replyToMessage: MessageIF | null;
  showMediaOptions: boolean;
  setShowMediaOptions: (value: boolean) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (value: boolean) => void;
  activeEmojiTab: "emojis" | "stickers";
  setActiveEmojiTab: (tab: "emojis" | "stickers") => void;
  userMessage: string;
  setUserMessage: (msg: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSendMessage: (
    message: string,
    type: MessageType,
    mediaUrl: string,
    mediaType: string,
    replyTo?: MessageIF | null
  ) => void;
  handleSendSticker: (url: string) => void;
  setIsRecording: (value: boolean) => void;
  setReplyToMessage: (msg: null) => void;
  handleSelectMedia: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ChatInput({
  stickers,
  replyToMessage,
  showMediaOptions,
  setShowMediaOptions,
  showEmojiPicker,
  setShowEmojiPicker,
  activeEmojiTab,
  setActiveEmojiTab,
  userMessage,
  setUserMessage,
  handleInputChange,
  handleSendMessage,
  handleSendSticker,
  setIsRecording,
  setReplyToMessage,
  handleSelectMedia,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      {/* Media Options */}
      {showMediaOptions && (
        <div className="absolute bottom-full mb-2 left-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl p-3 w-60 border border-gray-700">
          <div className="flex justify-between items-center pb-2 border-b border-gray-700 mb-2">
            <h4 className="text-sm font-medium text-gray-200">Add Content</h4>
            <button
              type="button"
              onClick={() => setShowMediaOptions(false)}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50 transition-all duration-200"
            >
              <X size={16} />
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleSelectMedia}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />

          <div className="grid grid-cols-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center p-3 rounded-md bg-gray-800/50 hover:bg-gray-700 transition-colors duration-200"
              title="Send Image/File"
            >
              <div className="mr-2 rounded-full bg-blue-500/20 p-2 group-hover:bg-blue-500/30 transition-colors duration-200">
                <Image size={18} className="text-blue-400" />
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                Media
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Emoji/Sticker Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-lg p-3 w-72">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-3">
              {["emojis", "stickers"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveEmojiTab(tab as "emojis" | "stickers")
                  }
                  className={`text-sm font-medium ${
                    activeEmojiTab === tab
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-400 hover:text-gray-300"
                  } pb-1`}
                >
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
            >
              <X size={16} />
            </button>
          </div>

          {activeEmojiTab === "emojis" ? (
            <div className="mt-2">
              <div className="flex overflow-x-auto pb-2 mb-2 scrollbar-thin scrollbar-thumb-gray-600">
                {["😀", "🎉", "❤️", "🔥", "🐱", "🍕", "⚽", "✈️"].map(
                  (emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="px-3 py-1 mx-1 rounded-full bg-gray-700 text-gray-300 flex-shrink-0"
                    >
                      {emoji}
                    </button>
                  )
                )}
              </div>
              <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
                {[
                  "😀",
                  "😂",
                  "😍",
                  "🤔",
                  "😎",
                  "😢",
                  "🙌",
                  "👍",
                  "🎉",
                  "❤️",
                  "🔥",
                  "👌",
                  "✨",
                  "💯",
                  "🤣",
                  "👏",
                  "😊",
                  "🥰",
                  "😇",
                  "🙂",
                  "🤩",
                  "😋",
                  "😆",
                  "😝",
                  "🤗",
                  "🤭",
                  "🥳",
                  "🤪",
                  "😜",
                  "😘",
                  "😚",
                  "😙",
                ].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setUserMessage(userMessage + emoji)}
                    className="p-2 hover:bg-gray-700 rounded text-xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
              {stickers.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  onClick={() => handleSendSticker(sticker.url)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <img
                    src={sticker.url}
                    alt="Sticker"
                    className="w-full h-auto rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reply Preview */}
      {replyToMessage && (
        <div className="bg-gray-800 rounded-t-lg border-l-2 border-purple-500 p-2 mb-1 flex items-start justify-between">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center mb-1">
              <Reply size={14} className="text-purple-400 mr-1" />
              <span className="text-xs text-purple-400 font-medium">
                Replying to {replyToMessage.sender?.username || "User"}
              </span>
            </div>
            <div className="text-sm text-gray-300 line-clamp-1">
              {replyToMessage.type === "text"
                ? "Text"
                : replyToMessage.type === "image"
                ? "Image"
                : replyToMessage.type === "poll"
                ? "Poll"
                : replyToMessage.type === "audio"
                ? "Audio message"
                : "File"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReplyToMessage(null)}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div
        className={`flex items-center bg-gray-700 ${
          replyToMessage ? "rounded-b-lg" : "rounded-lg"
        } p-1`}
      >
        <button
          type="button"
          onClick={() => setShowMediaOptions(!showMediaOptions)}
          className={`p-2 rounded-full transition-colors ${
            showMediaOptions
              ? "bg-purple-600 text-white"
              : "hover:bg-gray-600 text-gray-400 hover:text-white"
          }`}
        >
          <Plus size={18} />
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder={
            replyToMessage ? "Type your reply..." : "Type a message..."
          }
          value={userMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(userMessage, "text", "", "", replyToMessage);
            }
          }}
          className="flex-1 bg-transparent border-none focus:outline-none text-gray-100 px-3 py-2"
        />

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 rounded-full transition-colors ${
              showEmojiPicker
                ? "bg-purple-600 text-white"
                : "hover:bg-gray-600 text-gray-400 hover:text-white"
            }`}
          >
            <Smile size={18} />
          </button>

          <button
            type="button"
            onClick={() => setIsRecording(true)}
            className="p-2 rounded-full hover:bg-gray-600 text-gray-400 hover:text-white transition-colors"
          >
            <Mic size={18} />
          </button>

          <button
            type="button"
            onClick={() =>
              handleSendMessage(userMessage, "text", "", "", replyToMessage)
            }
            className={`p-2 rounded-full ${
              userMessage.trim() === ""
                ? "bg-gray-600 text-gray-400"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            } transition-colors`}
            disabled={userMessage.trim() === ""}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
