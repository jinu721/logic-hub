import { User, X } from "lucide-react";
import { Report } from "./Reports";

type ReportModalProps = {
  selectedReporters: Report[];
  selectedEntityId: string;
  onClose: () => void;
};

const ReportModal: React.FC<ReportModalProps> = ({
  selectedReporters,
  selectedEntityId,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden border border-white/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Reporters</h3>
            <p className="text-slate-300 text-sm">
              Entity ID: {selectedEntityId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 text-white hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
          {selectedReporters.map((reporter: Report, index) => (
            <div
              key={`${reporter._id}-${index}`}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-base truncate">
                        {reporter.reporter?.username}
                      </p>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                        Reporter
                      </span>
                    </div>
                    {reporter.reporter?.email && (
                      <p className="text-slate-300 text-sm truncate">
                        {reporter.reporter?.email}
                      </p>
                    )}
                  </div>

                  <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-wide">
                      Reason
                    </p>
                    <p className="text-white text-sm leading-relaxed">
                      {reporter.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-slate-300 text-sm text-center">
            {selectedReporters.length} reporter
            {selectedReporters.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
