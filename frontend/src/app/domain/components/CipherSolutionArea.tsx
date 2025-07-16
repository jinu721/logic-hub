import React from "react";
import { Eye, FileText } from "lucide-react";

interface CipherSolutionAreaProps {
  challenge?: {
    type: string;
  };
  userInput: string;
  setUserInput: (value: string) => void;
}

const CipherSolutionArea: React.FC<CipherSolutionAreaProps> = ({
  challenge,
  userInput,
  setUserInput,
}) => {
  if (challenge?.type !== "cipher") return null;

  return (
    <div className="p-6 flex-1 bg-gradient-to-b from-gray-800 to-gray-850">
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3 text-gray-200 flex items-center">
          <Eye className="mr-2 text-purple-400" size={20} />
          Your Solution
        </h4>

        <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 mb-4">
          <p className="text-gray-300">Enter the solution to decode the cipher</p>
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full p-4 pr-12 bg-gray-900 border border-gray-700 rounded-lg font-mono text-xl tracking-wide text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
            placeholder="Enter solution..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            onClick={() => setUserInput("")}
          >
            ×
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-medium mb-3 text-gray-200 flex items-center">
          <FileText className="mr-2 text-blue-400" size={20} />
          Working Notes
        </h4>
        <textarea
          className="w-full h-48 p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-inner"
          placeholder="Type your working notes here..."
        ></textarea>
      </div>
    </div>
  );
};

export default CipherSolutionArea;
