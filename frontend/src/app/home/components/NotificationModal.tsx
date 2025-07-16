"use client";

import { useState, useEffect } from 'react';
import { Bell, X, Trophy, Clock, Tag, Brain, ChevronRight, Shield } from 'lucide-react';


const getLevelColor = (level) => {
  switch(level) {
    case 'novice': return 'bg-teal-500';
    case 'adept': return 'bg-purple-500';
    case 'master': return 'bg-pink-500';
    default: return 'bg-gray-500';
  }
};

const getTypeIcon = (type) => {
  switch(type) {
    case 'code': return <div className="text-cyan-400"><Brain size={16} /></div>;
    case 'cipher': return <div className="text-teal-400"><Shield size={16} /></div>;
    default: return <div className="text-gray-400"><Trophy size={16} /></div>;
  }
};

const ChallengeNotificationModal = ({ challenge, onClose, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  const handleNavigateClick = () => {
    setIsVisible(false);
    
    setTimeout(() => {
      if (onNavigate) onNavigate(challenge?.data._id);
    }, 300);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div 
      className={`fixed top-24 right-4 w-80 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="relative">
        <div className={`absolute -top-3 -left-3 rounded-full p-2 bg-indigo-600 border-4 border-gray-900 ${
          isPulsing ? 'animate-pulse' : ''
        }`}>
          <Bell size={16} className="text-white" />
        </div>
        
        <div 
          onClick={handleNavigateClick}
          className="bg-gray-800 border border-indigo-500/30 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:border-indigo-500 transition-all duration-200 transform hover:scale-102 hover:shadow-indigo-500/20"
        >
          <div className="flex justify-between items-center p-3 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${getLevelColor(challenge?.data?.data?.level)}`}>
                {challenge?.data?.data?.level}
              </div>
              <span className="text-gray-400 text-sm">New Challenge</span>
            </div>
            <button 
              onClick={handleCloseClick}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex items-start mb-3">
              <div className="mr-3 mt-1">{getTypeIcon(challenge?.data.type)}</div>
              <h3 className="text-lg font-bold text-white">{challenge?.data.title}</h3>
            </div>
            
            <p className="text-sm text-gray-300 mb-3 line-clamp-2">
              {challenge?.data.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {challenge?.data?.tags?.map((tag, index) => (
                <div key={index} className="flex items-center bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                  <Tag size={12} className="mr-1" /> {tag}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-gray-400 text-xs mb-3">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{challenge?.data.timeLimit} min</span>
              </div>
              <div className="flex items-center">
                <Trophy size={14} className="mr-1" />
                <span>{challenge?.data.xpRewards} XP</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                className="flex items-center text-xs bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded transition-colors"
              >
                <span>Start Challenge</span>
                <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeNotificationModal;
