import { UserIF } from "@/types/user.types";
import { FC, useState, useEffect, useRef, useMemo, MouseEvent } from "react";
import UserReactionItem from "./UserReactionItem";

interface Reaction {
  emoji: string;
  userId: UserIF;
}


interface MessageReactionsProps {
  reactions: Reaction[];
  isGroup: boolean;
}

const MessageReactions: FC<MessageReactionsProps> = ({ reactions, isGroup }) => {
  const [showReactors, setShowReactors] = useState<string | false>(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reactorsRef = useRef<HTMLDivElement | null>(null);
  const reactionsRef = useRef<HTMLDivElement | null>(null);

  const groupedReactions = useMemo(() => {
    if (!reactions || reactions.length === 0) return {};

    return reactions.reduce((acc: Record<string, UserIF[]>, reaction) => {
      const { emoji, userId } = reaction;
      if (!acc[emoji]) acc[emoji] = [];
      acc[emoji].push(userId);
      return acc;
    }, {});
  }, [reactions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | MouseEventInit | any) => {
      if (
        reactorsRef.current &&
        !reactorsRef.current.contains(event.target) &&
        reactionsRef.current &&
        !reactionsRef.current.contains(event.target)
      ) {
        setShowReactors(false);
      }
    };

    if (showReactors) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactors]);

  const handleReactionClick = (
    event: MouseEvent<HTMLDivElement>,
    emoji: string
  ) => {
    if (!isGroup) return;

    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY,
    });

    setShowReactors(emoji);
  };

  if (!reactions || reactions.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-1 mt-1" ref={reactionsRef}>
        {Object.entries(groupedReactions).map(([emoji, users]) => (
          <div
            key={emoji}
            className="bg-gray-700 rounded-full px-2 py-0.5 flex items-center cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={(e) => handleReactionClick(e, emoji)}
          >
            <span className="mr-1">{emoji}</span>
            <span className="text-xs text-gray-300">{users.length}</span>
          </div>
        ))}
      </div>

      {showReactors && isGroup && (
        <div
          ref={reactorsRef}
          className="absolute bg-gray-800 rounded-md shadow-lg p-2 z-10 w-48 max-h-60 overflow-y-auto"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
        >
          <div className="mb-2 border-b border-gray-700 pb-1">
            <span className="text-lg mr-2">{showReactors}</span>
            <span className="text-sm text-gray-300">
              {groupedReactions[showReactors]?.length || 0}{" "}
              {groupedReactions[showReactors]?.length === 1
                ? "reaction"
                : "reactions"}
            </span>
          </div>

          <div className="space-y-2">
            {groupedReactions[showReactors]?.map((user) => (
              <UserReactionItem key={user.userId || user._id} user={user} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageReactions;
