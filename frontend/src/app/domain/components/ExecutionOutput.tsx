import React, { useState } from "react";
import {
  XCircleIcon,
  TerminalIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { useToast } from "@/context/Toast";

interface Execution {
  resultOutput?: string | object;
  testCasesPassed?: number;
  totalTestCases?: number;
  language?: string;
  codeSubmitted?: string;
}



const ExecutionOutput: React.FC<{ execution: Execution; challengeType: string }> = ({ 
  execution, 
  challengeType 
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { showToast } = useToast() as any;

  const handleCopy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log(err);
      showToast({ type: "error", message: "Failed to copy!" });
    }
  };

  if (!execution?.resultOutput) return null;

  let parsedOutput: any;
  try {
    parsedOutput = typeof execution.resultOutput === "string" 
      ? JSON.parse(execution.resultOutput) 
      : execution.resultOutput;
  } catch {
    parsedOutput = execution.resultOutput;
  }

  if (Array.isArray(parsedOutput)) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h5 className="text-sm font-medium text-gray-300 flex items-center">
            <TerminalIcon size={14} className="mr-1 text-green-400" />
            Test Results
          </h5>
          <button
            onClick={() => handleCopy(JSON.stringify(parsedOutput, null, 2))}
            className="bg-gray-700/60 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs transition-all duration-200 flex items-center"
          >
            <CopyIcon size={12} className="mr-1" />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <div className="space-y-2">
          {parsedOutput.filter((testCase: any) => !testCase.isHidden).slice(0, 2).map((testCase: any, index: number) => (
            <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700/30 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-400 font-medium">
                  {testCase.name || `Test ${index + 1}`}
                </span>
                <div className="flex items-center space-x-2">
                  {testCase.passed !== undefined && (
                    <span className={`flex items-center px-2 py-0.5 rounded text-xs ${
                      testCase.passed 
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {testCase.passed ? (
                        <CheckIcon size={10} className="mr-1" />
                      ) : (
                        <XCircleIcon size={10} className="mr-1" />
                      )}
                      {testCase.passed ? 'Pass' : 'Fail'}
                    </span>
                  )}
                  {testCase.executionTime && (
                    <span className="text-xs text-gray-400">
                      {testCase.executionTime}ms
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {testCase.input && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Input:</div>
                    <div className="bg-gray-700/30 rounded p-2">
                      <code className="text-blue-300 text-xs">
                        {Array.isArray(testCase.input) 
                          ? testCase.input.join(', ') 
                          : String(testCase.input)}
                      </code>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  {testCase.expectedOutput !== undefined && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Expected:</div>
                      <div className="bg-emerald-500/10 rounded p-2">
                        <code className="text-emerald-300 text-xs">
                          {String(testCase.expectedOutput)}
                        </code>
                      </div>
                    </div>
                  )}
                  
                  {testCase.actualOutput !== undefined && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Actual:</div>
                      <div className={`rounded p-2 ${
                        testCase.passed 
                          ? 'bg-emerald-500/10' 
                          : 'bg-red-500/10'
                      }`}>
                        <code className={`text-xs ${
                          testCase.passed ? 'text-emerald-300' : 'text-red-300'
                        }`}>
                          {String(testCase.actualOutput)}
                        </code>
                      </div>
                    </div>
                  )}
                </div>

                {testCase.error && (
                  <div>
                    <div className="text-xs text-red-300 mb-1">Error:</div>
                    <div className="bg-red-500/10 rounded p-2">
                      <code className="text-red-300 text-xs">{testCase.error}</code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-300 flex items-center">
          <TerminalIcon size={14} className="mr-1 text-green-400" />
          {challengeType === "cipher" ? "Decoded Output" : "Output"}
        </h5>
        <button
          onClick={() => handleCopy(typeof parsedOutput === 'string' ? parsedOutput : JSON.stringify(parsedOutput, null, 2))}
          className="bg-gray-700/60 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs transition-all duration-200 flex items-center"
        >
          <CopyIcon size={12} className="mr-1" />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
        <pre className="text-gray-300 text-xs leading-relaxed overflow-auto">
          {typeof parsedOutput === "string" ? parsedOutput : JSON.stringify(parsedOutput, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ExecutionOutput;