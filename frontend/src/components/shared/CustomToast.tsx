import { useState, useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Trophy, X, Zap } from 'lucide-react';

export default function GameToast({
  type = 'success',
  message = 'You have completed your mission',
  xp = null,
  reward = null,
  duration = 3000,
  onClose,
  isVisible = true
}) {
  const [visible, setVisible] = useState(isVisible);
  const [animationState, setAnimationState] = useState('entering');

  useEffect(() => {
    if (isVisible) {
      setAnimationState('entering');
      
      const entryTimer = setTimeout(() => {
        setAnimationState('idle');
      }, 300);
      
      const dismissTimer = setTimeout(() => {
        setAnimationState('exiting');
        
        setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 300);
      }, duration);
      
      return () => {
        clearTimeout(entryTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [isVisible, duration, onClose]);
  
  if (!visible) return null;
  
  const toastConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    achievement: {
      icon: Trophy,
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    levelup: {
      icon: Trophy,
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    legendary: {
      icon: Trophy,
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200'
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    }
  };
  
  const config = toastConfig[type] || toastConfig.success;
  const IconComponent = config.icon;
  
  const animationClasses = {
    entering: 'animate-slide-in',
    idle: '',
    exiting: 'animate-slide-out'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`
          bg-white border ${config.borderColor} shadow-lg rounded-lg
          w-80 overflow-hidden
          ${animationClasses[animationState]}
        `}
      >
        <div className="relative p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {message}
                </p>
                
                <button 
                  onClick={() => {
                    setAnimationState('exiting');
                    setTimeout(() => {
                      setVisible(false);
                      if (onClose) onClose();
                    }, 300);
                  }}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded-md p-1 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              </div>
              
              {(xp || reward) && (
                <div className="flex items-center gap-2 mt-3">
                  {xp && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-md border border-gray-200">
                      <Zap className="text-yellow-600 w-3.5 h-3.5" />
                      <span className="text-gray-700 text-xs font-medium">+{xp} XP</span>
                    </div>
                  )}
                  
                  {reward && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-md border border-gray-200">
                      <Trophy className="text-amber-600 w-3.5 h-3.5" />
                      <span className="text-gray-700 text-xs font-medium">{reward}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`        
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        
        .animate-slide-out {
          animation: slide-out 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
