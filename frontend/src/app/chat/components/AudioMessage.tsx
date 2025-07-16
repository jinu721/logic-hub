import React, { useEffect, useRef, useState, MouseEvent } from "react";
import { Play, Pause } from "lucide-react";
import BaseMessage from "./BaseMessage";
import { MessageIF } from "@/types/message.types";

interface AudioMessageProps {
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

const AudioMessage: React.FC<AudioMessageProps> = ({
  message,
  isOther,
  isGroup,
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
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const isSelf = !isOther;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = duration * clickPosition;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <BaseMessage
      message={message}
      isOther={isOther}
      isGroup={isGroup}
      onEdit={onEdit}
      onDelete={onDelete}
      onReport={onReport}
      onReply={onReply}
      onReact={onReact}
      onReplyClick={onReplyClick}
      activeActionMessageId={activeActionMessageId}
      setActiveActionMessageId={setActiveActionMessageId}
      activeEmojiMessageId={activeEmojiMessageId}
      setActiveEmojiMessageId={setActiveEmojiMessageId}
    >
      <div
        className={`${
          isSelf ? "bg-purple-600" : "bg-gray-700"
        } rounded-lg p-3 mt-1`}
      >
        <audio ref={audioRef} src={message?.media?.url} preload="metadata" />
        <div className="flex items-center">
          <button
            className="p-1.5 rounded-full bg-gray-600 hover:bg-gray-500 mr-3 transition-colors"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <div
            className="flex-1 cursor-pointer"
            onClick={handleProgressClick}
            ref={progressRef}
          >
            <div className="h-1 bg-gray-600 rounded-full">
              <div
                className="h-1 bg-purple-500 rounded-full"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
          <span className="ml-3 w-10 text-xs">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </BaseMessage>
  );
};

export default AudioMessage;
