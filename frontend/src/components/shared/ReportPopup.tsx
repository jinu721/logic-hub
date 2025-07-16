import React, { useState } from 'react';
import { AlertCircle, Flag, X } from 'lucide-react';

interface ReportPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  reportType?: 'user' | 'group';
}

const ReportPopup: React.FC<ReportPopupProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reportType = 'user',
}) => {
  const [reportReason, setReportReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  const reasons: string[] = [
    'Inappropriate content',
    'Harassment or bullying',
    'Spam or scam',
    'Hate speech',
    'Violence or threats',
    'Other (please specify)',
  ];

  const handleSubmit = () => {
    if (!reportReason) {
      setError('Please select a reason for reporting');
      return;
    }

    if (reportReason === 'Other (please specify)') {
      if (!customReason.trim()) {
        setError('Please provide details for your report');
        return;
      }
      onSubmit(customReason.trim());
    } else {
      onSubmit(reportReason);
    }

    setReportReason('');
    setCustomReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-10 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Flag size={18} className="text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-white">
              Report {reportType === 'user' ? 'User' : 'Group'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-gray-300 mb-4">
            Please select a reason for your report. This will help us take appropriate action.
          </p>

          {error && (
            <div className="flex items-center bg-red-500 bg-opacity-10 border border-red-500 text-red-400 px-3 py-2 rounded-md mb-4">
              <AlertCircle size={16} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Reason for reporting
            </label>
            <div className="space-y-2">
              {reasons.map((reason) => (
                <div key={reason} className="relative flex items-center">
                  <input
                    type="radio"
                    id={reason}
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={() => {
                      setReportReason(reason);
                      setError('');
                    }}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-600 bg-gray-700"
                  />
                  <label
                    htmlFor={reason}
                    className="ml-2 block text-sm text-gray-300 cursor-pointer"
                  >
                    {reason}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {reportReason === 'Other (please specify)' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Please provide details
              </label>
              <textarea
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  if (e.target.value.trim()) setError('');
                }}
                placeholder="Describe the issue in detail..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>
          )}
        </div>

        <div className="bg-gray-700 px-4 py-3 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
