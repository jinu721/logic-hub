import { useState, useEffect } from 'react';
import { XCircle, Trophy, Zap } from 'lucide-react';

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
      }, 400);
      
      const dismissTimer = setTimeout(() => {
        setAnimationState('exiting');
        
        setTimeout(() => {
          setVisible(false);
          if (onClose) onClose();
        }, 400);
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
      bgGradient: 'from-emerald-600 to-green-700',
      glowColor: 'shadow-emerald-500/30',
      iconBg: 'bg-emerald-800'
    },
    achievement: {
      bgGradient: 'from-amber-600 to-yellow-700',
      glowColor: 'shadow-amber-500/30',
      iconBg: 'bg-amber-800'
    },
    levelup: {
      bgGradient: 'from-purple-600 to-fuchsia-700',
      glowColor: 'shadow-purple-500/30',
      iconBg: 'bg-purple-800'
    },
    legendary: {
      bgGradient: 'from-orange-600 to-red-700',
      glowColor: 'shadow-orange-500/30',
      iconBg: 'bg-orange-800'
    },
    error: {
      bgGradient: 'from-red-600 to-rose-700',
      glowColor: 'shadow-red-500/30',
      iconBg: 'bg-red-800'
    },
    warning: {
      bgGradient: 'from-amber-600 to-orange-700',
      glowColor: 'shadow-amber-500/30',
      iconBg: 'bg-amber-800'
    },
    info: {
      bgGradient: 'from-blue-600 to-indigo-700',
      glowColor: 'shadow-blue-500/30',
      iconBg: 'bg-blue-800'
    }
  };
  
  const config = toastConfig[type] || toastConfig.success;
  
  const animationClasses = {
    entering: 'animate-slide-in',
    idle: 'animate-float',
    exiting: 'animate-slide-out'
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`
          bg-gradient-to-r ${config.bgGradient} 
          rounded-lg shadow-lg ${config.glowColor}
          w-64 overflow-hidden
          ${animationClasses[animationState]}
        `}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSIxMDAiPgogIDxnIGZpbGw9IiNmZmYiPgogICAgPHBhdGggZD0iTTAgMGwxNCAxMC43TDAgMjEuNHoiLz4KICAgIDxwYXRoIGQ9Ik0xNyA4LjVMMSAxOS4yTDE3IDMwbDE2LTEwLjhMMTcgOC41eiIvPgogICAgPHBhdGggZD0iTTM3IDEwLjdMMjEgMEwzNyAyMS40eiIvPgogICAgPHBhdGggZD0iTTAgMjFsMTQgMTAuN0wwIDQyLjR6Ii8+CiAgICA8cGF0aCBkPSJNMTcgMjkuNUwxIDQwLjJMMTcgNTFsMTYtMTAuOEwxNyAyOS41eiIvPgogICAgPHBhdGggZD0iTTM3IDMxLjdMMjEgMjFMMzcgNDIuNHoiLz4KICAgIDxwYXRoIGQ9Ik0wIDQyLjRsMTQgMTAuN0wwIDYzLjh6Ii8+CiAgICA8cGF0aCBkPSJNMTcgNTAuNUwxIDYxLjJMMTcgNzJsMTYtMTAuOEwxNyA1MC41eiIvPgogICAgPHBhdGggZD0iTTM3IDUyLjdMMjEgNDJMMzcgNjMuNHoiLz4KICA8L2c+Cjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="relative p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-bold text-white text-base">{message}</div>
            
            <button 
              onClick={() => {
                setAnimationState('exiting');
                setTimeout(() => {
                  setVisible(false);
                  if (onClose) onClose();
                }, 400);
              }}
              className="ml-auto text-white/70 hover:text-white"
            >
              <XCircle size={16} />
            </button>
          </div>
        
          
          <div className="flex items-center gap-3">
            {xp && (
              <div className="bg-black/20 px-2 py-1 rounded flex items-center gap-1">
                <Zap className="text-yellow-300" size={14} />
                <span className="text-yellow-100 text-xs font-bold">+{xp} XP</span>
              </div>
            )}
            
            {reward && (
              <div className="bg-black/20 px-2 py-1 rounded flex items-center gap-1">
                <Trophy className="text-amber-300" size={14} />
                <span className="text-amber-100 text-xs font-bold">{reward}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes slide-in {
          from {
            transform: translateX(110%) translateY(0);
            opacity: 0;
          }
          to {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes slide-out {
          from {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          to {
            transform: translateX(110%) translateY(0);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.4s ease-out forwards;
        }
        
        .animate-slide-out {
          animation: slide-out 0.4s ease-in forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}