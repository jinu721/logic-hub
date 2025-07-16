import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  options: Option[];
  currentValue: string;
  onSelect: (value: string) => void;
  icon?: React.ReactNode;
  placeholder?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  currentValue,
  onSelect,
  icon,
  placeholder = "Select...",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentLabel = () => {
    const selected = options.find((opt) => opt.value === currentValue);
    return selected ? selected.label : placeholder;
  };

  return (
    <div className="relative z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 min-w-40 hover:border-gray-600 transition"
      >
        {icon}
        <span className="flex-1 text-left truncate">{getCurrentLabel()}</span>
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full bg-gray-900 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-800 transition ${
                  currentValue === option.value
                    ? "text-purple-400"
                    : "text-gray-300"
                }`}
                onClick={() => {
                  onSelect(option.value);
                  setIsOpen(false);
                }}
              >
                {currentValue === option.value && (
                  <div className="w-1 h-4 bg-purple-500 rounded-full mr-2"></div>
                )}
                <span
                  className={currentValue === option.value ? "ml-2" : "ml-5"}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
