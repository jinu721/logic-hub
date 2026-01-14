"use client";

import { useState, useEffect } from 'react';
import { Gift, X, Sparkles, Star, ChevronRight, Heart } from 'lucide-react';

const GiftReceivedModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Start the entrance animation sequence
    setIsVisible(true);

    // Animation sequence timing
    const stage1 = setTimeout(() => setAnimationStage(1), 300);
    const stage2 = setTimeout(() => setAnimationStage(2), 1000);
    const stage3 = setTimeout(() => setAnimationStage(3), 1500);

    // Custom animation keyframes
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes particle-float {
        0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 0.5; }
        100% { transform: translate(var(--tx), var(--ty)) rotate(var(--tr)); opacity: 0; }
      }
      
      .animate-particle {
        --tx: ${Math.random() * 100 - 50}px;
        --ty: ${Math.random() * 100 - 50}px;
        --tr: ${Math.random() * 360}deg;
        animation: particle-float 3s ease-out forwards;
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setAnimationStage(0);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Overlay with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal container */}
      <div className={`relative w-96 transform ${isVisible ? 'scale-100' : 'scale-90'} transition-all duration-500`}>
        {/* Animated particles in background */}
        <div className="absolute -inset-10 flex items-center justify-center overflow-hidden pointer-events-none">
          {animationStage > 0 && [...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-70
                ${animationStage > 1 ? 'animate-particle' : ''}`}
              style={{
                top: `${50 + Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1)}%`,
                left: `${50 + Math.random() * 30 * (Math.random() > 0.5 ? 1 : -1)}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              } as React.CSSProperties}
            ></div>
          ))}
        </div>

        {/* Main modal card */}
        <div className="bg-gray-900 border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
          {/* Top glow */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-purple-600/20 to-transparent"></div>

          {/* Modal header */}
          <div className="relative px-6 pt-6 pb-4 flex justify-between items-center border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded-lg bg-purple-900/50 border border-purple-500/50 
                ${animationStage > 1 ? 'animate-pulse' : ''}`}>
                <Gift size={20} className="text-purple-300" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Gift Received!
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
            >
              <X size={16} />
            </button>
          </div>

          {/* Gift animation container */}
          <div className="relative py-8 flex flex-col items-center justify-center">
            {/* Animated gift icon */}
            <div className={`relative mb-4 
              transform ${animationStage > 0 ? 'scale-100' : 'scale-0'} 
              transition-all duration-700 ease-out`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-40 
                ${animationStage > 1 ? 'animate-pulse' : ''}`}></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-full shadow-lg">
                <div className={`transform ${animationStage > 1 ? 'animate-bounce' : ''}`} style={{ animationDuration: '3s' }}>
                  <Sparkles size={48} className="text-purple-100" />
                </div>
              </div>

              {animationStage > 1 && [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-5 h-5 text-yellow-300 animate-ping"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  } as React.CSSProperties}
                >
                  <Star size={12} fill="currentColor" />
                </div>
              ))}
            </div>

            <h2 className={`text-xl font-bold text-white mb-2 ${animationStage > 1 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
              Premium Theme Pack
            </h2>

            <p className={`text-center text-gray-300 mb-4 px-8 ${animationStage > 2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-200`}>
              Youve unlocked exclusive access to our premium theme collection! Customize your workspace with stunning visuals.
            </p>

            <div className={`flex justify-center gap-3 mb-4 ${animationStage > 2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-300`}>
              <div className="flex items-center space-x-1 bg-gray-800 px-3 py-1 rounded-full">
                <Star size={14} className="text-yellow-400" />
                <span className="text-xs text-gray-300">Legendary item</span>
              </div>
              <div className="flex items-center space-x-1 bg-gray-800 px-3 py-1 rounded-full">
                <Heart size={14} className="text-pink-400" />
                <span className="text-xs text-gray-300">Limited edition</span>
              </div>
            </div>
          </div>

          {/* Actions footer */}
          <div className={`p-4 bg-gray-800/50 border-t border-gray-800 flex justify-between 
            ${animationStage > 2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 delay-400`}>
            <button
              className="text-sm px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              onClick={handleClose}
            >
              Later
            </button>
            <button
              className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all flex items-center gap-1 shadow-lg shadow-purple-500/20"
            >
              <span>Use Now</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftReceivedModal;
