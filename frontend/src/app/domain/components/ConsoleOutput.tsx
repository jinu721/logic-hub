import React from "react";
import { Terminal, Trash2, RefreshCw } from "lucide-react";

type OutputType = "error" | "success" | "warning" | "info";

interface ConsoleMessage {
  type: OutputType;
  message: string;
}

interface ConsoleOutputProps {
  challenge?: { type: string };
  consoleOutput: ConsoleMessage[];
  setConsoleOutput: (output: ConsoleMessage[]) => void;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  challenge,
  consoleOutput,
  setConsoleOutput,
}) => {
  if (challenge?.type !== "code") return null;

  return (
    <div className="bg-gray-900/80 rounded-xl border border-gray-700/50 shadow-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-indigo-900/10">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center">
              <Terminal size={16} className="text-indigo-400" />
              <span className="font-semibold ml-2 text-white">Console Output</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors group text-gray-400 hover:text-white"
              onClick={() => setConsoleOutput([])}
              title="Clear console"
            >
              <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              className="p-1.5 rounded-full hover:bg-gray-700/50 transition-colors group text-gray-400 hover:text-white"
              onClick={() => setConsoleOutput([])}
              title="Refresh console"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="p-4 font-mono text-sm h-40 overflow-auto bg-[#1e1e2e] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {consoleOutput.length > 0 ? (
            consoleOutput.map((output, index) => (
              <div key={index} className="mb-1.5 flex items-start animate-fadeIn">
                <span
                  className={`mr-2 inline-block ${
                    output.type === "error"
                      ? "text-red-500"
                      : output.type === "success"
                      ? "text-green-500"
                      : output.type === "warning"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                ></span>
                <p
                  className={`${
                    output.type === "error"
                      ? "text-red-400"
                      : output.type === "success"
                      ? "text-green-400"
                      : output.type === "warning"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                >
                  {output.message}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Terminal size={24} className="mb-2 opacity-50" />
              <p>Run your code to see output here</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 right-0 left-0 h-8 bg-gradient-to-t from-[#1e1e2e] to-transparent pointer-events-none"></div>
      </div>

      <div className="border-t border-gray-800 bg-gray-900/50 px-3 py-2 text-xs text-gray-400 flex justify-between items-center">
        <span>
          {consoleOutput.length} message{consoleOutput.length !== 1 ? "s" : ""}
        </span>
        <span className="font-mono">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default ConsoleOutput;
