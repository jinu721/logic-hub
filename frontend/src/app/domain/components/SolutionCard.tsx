import { FC } from "react";
import { User, Clock, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { SolutionIF } from "@/types/solution.types";


interface SolutionCardProps {
  solution: SolutionIF;
  onClick?: () => void;
}

const SolutionCard: FC<SolutionCardProps> = ({ solution, onClick }) => {
  return (
    <div
      className="bg-gray-800 rounded-lg border border-gray-700 mb-4 overflow-hidden hover:border-indigo-500 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <h3 className="font-medium text-gray-200">{solution.title}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span>{solution.user.username || "Anonymous"}</span>
                <span className="mx-2">•</span>
                <Clock size={12} className="mr-1" />
                <span>{new Date(solution.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-400 text-sm">
              <Heart size={14} className="mr-1" />
              <span>{solution.likes.length}</span>
            </div>
            <div className="flex items-center text-gray-400 text-sm">
              <MessageCircle size={14} className="mr-1" />
              <span>{solution.comments.length}</span>
            </div>
            <ExternalLink size={16} className="text-gray-500" />
          </div>
        </div>

        <div className="mt-3 text-gray-400 text-sm line-clamp-2">
          {solution.content}
        </div>

        <div className="mt-3 flex items-center flex-wrap gap-2">
          {solution.implementations && solution.implementations.length > 0 ? (
            solution.implementations.map((impl, idx) => (
              <span key={idx} className="bg-gray-700 text-indigo-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-indigo-500/20">
                {impl.language}
              </span>
            ))
          ) : (
            <span className="bg-gray-700 text-gray-400 text-[10px] px-2 py-0.5 rounded">
              Logic
            </span>
          )}
          {solution.likes.length > 5 && (
            <span className="bg-pink-500 bg-opacity-10 text-pink-400 text-[10px] px-2 py-0.5 rounded flex items-center border border-pink-500/20">
              <Heart size={10} className="mr-1" fill="currentColor" />
              POPULAR
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
