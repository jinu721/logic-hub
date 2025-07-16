
"use client";

import { AlertTriangle, X } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isLoading }: Props) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white flex items-center">
            <AlertTriangle className="mr-2" size={24} />
            Confirm Action
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="px-6 py-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to continue this ?
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium text-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium text-white transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Conforming...
                </>
              ) : (
                'Conform Action'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}