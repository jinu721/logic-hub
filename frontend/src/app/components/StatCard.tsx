
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }: StatCardProps) => (
  <div className="text-center group">
    <div className="mb-3 inline-flex p-3 bg-slate-800/30 rounded-lg group-hover:bg-slate-800/50 transition-all duration-300">
      <div className="text-slate-300">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-slate-400 text-sm">{label}</div>
  </div>
);

export default StatCard;