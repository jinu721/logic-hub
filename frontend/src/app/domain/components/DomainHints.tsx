import { FC } from "react";
import { Lightbulb } from "lucide-react";
import { ChallengeDomainIF } from "@/types/domain.types";

interface DomainHintsProps {
  challenge?:ChallengeDomainIF
}

const DomainHints: FC<DomainHintsProps> = ({ challenge }) => {
  const hints = challenge?.hints || [
    "Break down the problem.",
    "Think of edge cases.",
  ];

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 flex items-center text-slate-100">
        <Lightbulb size={20} className="mr-2 text-amber-400" />
        <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full mr-3"></div>
        Hints & Tips
      </h3>

      <div className="space-y-4">
        {hints.map((hint, index) => (
          <div
            key={index}
            className="group bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/40 transition-all duration-300"
          >
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 rounded-lg w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 group-hover:scale-105 transition-transform">
                {index + 1}
              </div>
              <div>
                <h4 className="font-bold text-slate-200 mb-1 text-sm">
                  Hint {index + 1}
                </h4>
                <p className="text-slate-300 text-sm">{hint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainHints;
