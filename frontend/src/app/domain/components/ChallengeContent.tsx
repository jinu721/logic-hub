import React, { useEffect, useState } from "react";
import {
  Lock,
  XCircle,
  AlertTriangle,
  FileText,
  Lightbulb,
  Key,
} from "lucide-react";
import CodeEditor, { Language } from "./CodeEditor"; 
import { ChallengeDomainIF } from "@/types/domain.types"

interface ChallengeContentProps {
  challenge?: ChallengeDomainIF;
  cipherFailed: boolean;
  userInput: string;
  setUserInput: (value: string) => void;
  codeToShow: any;
  currentLanguage: Language;
}

const ChallengeContent: React.FC<ChallengeContentProps> = ({
  challenge,
  cipherFailed,
  userInput,
  setUserInput,
  codeToShow,
  currentLanguage,
}) => {
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing,setIsClearing] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem(`userNote:${challenge?._id}`);
    if (savedNote) {
      setNoteText(savedNote);
    }
  }, [challenge]);

  const handleSaveNote = () => {
    setIsSaving(true);
    localStorage.setItem(`userNote:${challenge?._id}`, noteText);
    setTimeout(() => setIsSaving(false), 1000);
  };
  
  const handleClearNote = () => {
    setIsClearing(true);
    setNoteText("");
    localStorage.removeItem(`userNote:${challenge?._id}`);
    setTimeout(() => setIsClearing(false), 1000);
  };

  switch (challenge?.type) {
    case "code":
      return (
        <div className="flex-1  overflow-auto bg-gray-850">
          <div className="mb-4">
            <CodeEditor
              setUserInput={setUserInput}
              currentLanguage={currentLanguage}
              codeBoilerplates={codeToShow}
            />
          </div>
        </div>
      );

    case "cipher":
      return (
        <div className="flex-1 overflow-auto p-4 bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 min-h-screen">
          <div className="mb-6 bg-gradient-to-r from-gray-800/90 to-gray-850/90 border border-gray-700/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            {!cipherFailed && (
              <div className="mb-4">
                <h4 className="text-md font-medium mb-3 text-gray-200 flex items-center">
                  <Lock className="mr-2 text-purple-400" size={18} />
                  Encrypted Message
                </h4>
                <div className="p-4 bg-gradient-to-br from-gray-900 to-slate-900 rounded-xl border border-gray-700/50 font-mono text-base tracking-wide text-indigo-200 shadow-inner overflow-x-auto">
                  {typeof challenge.initialCode === "string"
                    ? challenge.initialCode
                    : "Not Yet!"}
                </div>
              </div>
            )}

            {cipherFailed && (
              <div className="animate-fadeIn">
                <h4 className="text-md font-medium mb-3 text-red-300 flex items-center">
                  <XCircle className="mr-2 text-red-400" size={18} />
                  Failed Attempt
                </h4>
                <div className="p-4 bg-gradient-to-br from-red-950/20 to-gray-900 rounded-xl border border-red-700/30 font-mono text-sm tracking-wide text-gray-300 shadow-inner">
                  <div className="flex items-start">
                    <div className="bg-red-900/30 p-2 rounded-lg mr-3">
                      <AlertTriangle className="text-red-400" size={20} />
                    </div>
                    <div>
                      <p className="text-red-300 font-medium mb-1 text-sm">
                        Decryption Failed
                      </p>
                      <p className="text-gray-400 text-xs">
                        Your solution didn`t match the expected output. Try a
                        different approach or reveal another clue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-850/90 rounded-2xl p-5 shadow-xl backdrop-blur-md border border-gray-700/50">
              <h4 className="text-md font-semibold mb-4 text-gray-200 flex items-center">
                <Key className="mr-2 text-emerald-400" size={18} />
                Solution Input
              </h4>

              <div className="p-3 bg-gray-800/60 rounded-xl border border-gray-700/50 mb-4">
                <p className="text-gray-300 text-sm">
                  Enter the solution to decode the cipher
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pr-10 bg-gradient-to-r from-gray-900 to-slate-900 border border-gray-700/50 rounded-xl font-mono text-lg tracking-wide text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 shadow-inner transition-all duration-200"
                  placeholder="Enter solution..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded-full p-1 transition-all duration-200"
                  onClick={() => setUserInput("")}
                >
                  ×
                </button>
              </div>
              <div className="mt-3 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-2xl p-5 shadow-xl backdrop-blur-md border border-purple-700/30">
                <h4 className="text-md font-semibold mb-4 text-purple-300 flex items-center">
                  <Lightbulb className="mr-2 text-yellow-400" size={18} />
                  Hints & Tips
                </h4>
                <div className="bg-purple-900/20 p-3 rounded-xl border border-purple-700/20">
                  <p className="text-purple-200 text-sm">
                    💡Pattern first, code later.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/90 to-gray-850/90 rounded-2xl p-5 shadow-xl backdrop-blur-md border border-gray-700/50">
              <h4 className="text-md font-semibold mb-4 text-gray-200 flex items-center">
                <FileText className="mr-2 text-blue-400" size={18} />
                Working Notes
              </h4>

              <textarea
                className="w-full h-48 p-3 bg-gradient-to-br from-gray-900 to-slate-900 border border-gray-700/50 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none shadow-inner transition-all duration-200"
                placeholder="Type your working notes here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              ></textarea>

              <div className="flex gap-2 mt-3">
                <button onClick={handleSaveNote} className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium py-2 px-3 rounded-lg text-sm transition-all duration-200 border border-blue-600/30">
                  {isSaving ? "Saving..." : "Save Notes"}
                </button>
                <button onClick={handleClearNote} className="flex-1 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 font-medium py-2 px-3 rounded-lg text-sm transition-all duration-200 border border-gray-600/30">
                  {isClearing ? "Clearing..." : "Clear Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div className="p-6 text-white">Unsupported challenge type</div>;
  }
};

export default ChallengeContent;
