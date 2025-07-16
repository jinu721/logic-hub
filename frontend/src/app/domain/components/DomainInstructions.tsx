import { FC } from "react";
import { AlertTriangle } from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";


interface DomainInstructionsProps {
  challenge?: ChallengeDomainIF;
}

const DomainInstructions: FC<DomainInstructionsProps> = ({ challenge }) => {
  const tags = challenge?.tags || ["Tag1", "Tag2", "Tag3"];
  const isCodeType = challenge?.type === "code";

  return (
    <div className="prose prose-invert max-w-none">
      <div className="flex-shrink-0 p-3 sm:p-4 lg:p-5 border-b border-slate-700/30 bg-gradient-to-r from-slate-800/30 to-slate-700/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 lg:mb-4 gap-3">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 leading-tight truncate">
            {challenge?.title || "Challenge Title"}
          </h2>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed mb-3">
          {challenge?.description || "Challenge description would appear here."}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-slate-700/40 text-slate-300 text-xs py-1 px-3 rounded-md border border-slate-600/30 backdrop-blur-sm hover:border-slate-500/50 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4 mt-4 text-slate-100 flex items-center">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></div>
        Problem Statement
      </h3>

      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/30 backdrop-blur-sm mb-5">
        <p className="text-slate-300 text-sm leading-relaxed">
          {challenge?.instructions || "Loading challenge instructions..."}
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
        <h4 className="text-base font-bold mb-3 text-blue-300 flex items-center">
          <AlertTriangle size={18} className="mr-2 text-amber-400" />
          Requirements
        </h4>

        <ul className="space-y-2 text-slate-300 text-sm list-none">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
            Complete within time limit
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
            All test cases must pass
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3"></span>
            Handle edge cases
          </li>
          {isCodeType && (
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
              Follow best coding practices
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DomainInstructions;
