import { CheckCircle } from "lucide-react";

interface DomainCompletePopupProps {
  xp?: number;
}

const DomainCompletePopup: React.FC<DomainCompletePopupProps> = ({ xp = 150 }) => {
  return (
    <div className="fixed bottom-4 sm:bottom-8 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-2xl bg-green-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl shadow-green-500/10 z-50">
      <div className="flex items-start sm:items-center text-green-200">
        <CheckCircle
          size={24}
          className="text-green-400 mr-3 sm:mr-4 flex-shrink-0 mt-0.5 sm:mt-0"
        />
        <p className="font-medium text-sm sm:text-base">
          Challenge completed! You`ve earned {xp} XP.
        </p>
      </div>
    </div>
  );
};

export default DomainCompletePopup;
