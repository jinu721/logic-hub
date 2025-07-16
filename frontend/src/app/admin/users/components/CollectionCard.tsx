import { Gift } from "lucide-react";

type Props = {
    title: string;
    buttonText: string;
    onButtonClick: () => void;
    children: React.ReactNode;
    itemCount: number;
}

export const CollectionCard = ({ title, buttonText, onButtonClick, children, itemCount }:Props) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
    <div className="p-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {itemCount > 0 && (
          <span className="ml-2 bg-gray-700 text-gray-300 text-sm px-2 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </div>
      <button
        onClick={onButtonClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg flex items-center text-sm font-medium transition-colors"
      >
        <Gift size={16} className="mr-2" />
        {buttonText}
      </button>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);
