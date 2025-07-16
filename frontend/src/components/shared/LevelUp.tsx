import { useState, useEffect } from 'react';

export const LevelUpPopup = ({ newLevel, xpGained, rewards = [], onClose }) => {
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationStage(1), 600);
    const timer2 = setTimeout(() => setAnimationStage(2), 1200);
    const timer3 = setTimeout(() => setAnimationStage(3), 1800);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-2xl bg-opacity-70">
      <div className={`relative bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-8 max-w-md w-full text-center transform transition-all duration-500 ${animationStage > 0 ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`absolute w-2 h-2 rounded-full bg-yellow-300 opacity-80 transform transition-all duration-1000 ${animationStage > 1 ? 'animate-ping' : 'opacity-0'}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
                animationDuration: `${1000 + Math.random() * 2000}ms`
              }}
            />
          ))}
        </div>
        
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${animationStage > 0 ? 'scale-100 opacity-50' : 'scale-0 opacity-0'}`}>
          <div className="w-64 h-64 bg-gradient-to-r from-yellow-400 to-yellow-200 rounded-full blur-xl" />
        </div>
        
        <div className={`relative mb-6 transform transition-all duration-700 ${animationStage > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-6xl font-bold text-yellow-300 mb-2">LEVEL UP!</h2>
          <div className="text-white text-xl">You reached level <span className="text-3xl font-bold text-yellow-300">{newLevel}</span></div>
        </div>
        
        <div className={`relative mb-8 transition-all duration-700 delay-300 ${animationStage > 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 mb-4">
            <p className="text-blue-200 text-lg">Experience gained</p>
            <p className="text-3xl font-bold text-white">+{xpGained} XP</p>
          </div>
        </div>
        
        {rewards.length > 0 && (
          <div className={`relative transition-all duration-700 delay-500 ${animationStage > 2 ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-xl font-semibold text-white mb-3">Rewards Unlocked</h3>
            <div className="grid grid-cols-2 gap-3">
              {rewards.map((reward, index) => (
                <div key={index} className="bg-purple-800 bg-opacity-60 rounded-lg p-3 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                    {reward.icon || '🎁'}
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium">{reward.name}</p>
                    <p className="text-purple-200 text-sm">{reward.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          onClick={onClose}
          className={`mt-8 px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-lg font-bold text-gray-900 rounded-lg hover:from-yellow-400 hover:to-yellow-300 transform transition-all duration-700 ${animationStage > 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};