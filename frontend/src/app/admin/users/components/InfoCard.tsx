type Props = {
    title: string
    children: React.ReactNode
}

export const InfoCard = ({ title, children }:Props) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-lg hover:border-gray-600 transition-colors">
    <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);
