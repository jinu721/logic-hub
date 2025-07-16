import { useState, useEffect } from "react";

export default function TimeUpPopup() {
  const [showSubmitting, setShowSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubmitting(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-60 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          <h1 className="text-5xl font-black text-gray-200 tracking-wider font-mono select-none">
            TIME'S
          </h1>
          <h1 className="text-5xl font-black text-gray-200 tracking-wider font-mono select-none mt-2">
            UP!
          </h1>
        </div>
        
        <div 
          className={`mt-8 transition-all duration-700 ease-in-out ${
            showSubmitting 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
            
            <p className="text-lg font-medium text-blue-400 tracking-wide">
              Challenge is submitting, please wait...
            </p>
          </div>
          
          <div className="flex justify-center mt-3 space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}