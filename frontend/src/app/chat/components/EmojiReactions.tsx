import { FC } from "react";

interface EmojiReactionsProps {
  onReact: (emoji: string) => void;
}

const EmojiReactions: FC<EmojiReactionsProps> = ({ onReact }) => {
  const emojis = ["👍", "❤️", "😂", "😮", "😢"];

  return (
    <div className="absolute -bottom-5 left-2 bg-gray-800 rounded-full py-0 px-1 flex space-x-0.5 shadow-lg z-10 scale-90 border border-gray-700">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="hover:bg-gray-700 rounded-full p-0.5 transition-colors"
          aria-label={`React with ${emoji}`}
        >
          <span className="text-2xl">{emoji}</span>
        </button>
      ))}
    </div>
  );
};

export default EmojiReactions;
