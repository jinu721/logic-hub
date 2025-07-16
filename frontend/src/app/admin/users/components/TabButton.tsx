import { ReactNode } from "react";

type Props = {
  active: boolean;
  onClick: () => void;
  icon?: ReactNode;
  label: string;
};
export const TabButton = ({ active, onClick, icon, label }:Props) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
      active 
        ? "bg-blue-600 text-white" 
        : "text-gray-400 hover:bg-gray-700 hover:text-white"
    }`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {label}
  </button>
);