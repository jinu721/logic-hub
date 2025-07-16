type Props = {
    label: string;
    value: string;
    valueColor?: string;
}

export const InfoItem = ({ label, value, valueColor = "text-white" }:Props) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}:</span>
    <span className={`font-medium ${valueColor}`}>{value}</span>
  </div>
);