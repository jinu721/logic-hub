import { FC, useEffect, useState } from "react";
import { X } from "lucide-react";

interface Message {
  content?: string;
  [key: string]: any; 
}

interface EditMessageModalProps {
  isOpen: boolean;
  message: Message | null;
  onClose: () => void;
  onSave: (newContent: string) => void;
}

const EditMessageModal: FC<EditMessageModalProps> = ({
  isOpen,
  message,
  onClose,
  onSave,
}) => {
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    if (isOpen && message) {
      setEditedContent(message.content || "");
    }
  }, [isOpen, message]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Edit Message</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Close edit modal"
          >
            <X size={20} />
          </button>
        </div>

        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedContent)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
            disabled={editedContent.trim() === ""}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMessageModal;
