import { ChevronRight } from "lucide-react";


interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  difficulty: string;
}

const CategoryCard:React.FC<CategoryCardProps> = ({ title, description, icon, count, difficulty }: CategoryCardProps) => (
  <div className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-6 transition-all duration-300 hover:border-slate-700/50 hover:bg-slate-900/70">
    <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
      <div className="w-full h-full border-l border-b border-slate-600 transform rotate-45 translate-x-8 -translate-y-8"></div>
    </div>

    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-slate-800/50 rounded-lg">{icon}</div>
        <div className="text-xs text-slate-400 bg-slate-800/30 px-2 py-1 rounded">
          {difficulty}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{count} problems</span>
        <button className="text-slate-300 hover:text-white transition-colors group-hover:translate-x-1 transform duration-200">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  </div>
);
export default CategoryCard;