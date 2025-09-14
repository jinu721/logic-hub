
interface FeaturePointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeaturePoint: React.FC<FeaturePointProps> = ({ icon, title, description }) => (
  <div className="flex items-start space-x-4 group">
    <div className="flex-shrink-0 p-2 bg-slate-800/30 rounded-lg group-hover:bg-slate-800/50 transition-all duration-300">
      {icon}
    </div>
    <div>
      <h4 className="text-white font-medium mb-1">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default FeaturePoint;
