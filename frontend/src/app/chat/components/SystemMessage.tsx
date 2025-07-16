import React from "react";

interface Message {
  content: string;
  [key: string]: any;
}

interface SystemMessageProps {
  message: Message;
}

const SystemMessage: React.FC<SystemMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center my-3">
      <div className="bg-gray-800 text-gray-300 rounded-lg px-4 py-2 text-sm">
        {message.content}
      </div>
    </div>
  );
};

export default SystemMessage;
