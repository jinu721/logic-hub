import { useState, useEffect } from 'react';
import { Check, Star, Sparkles, Gift, X } from 'lucide-react';

const PurchaseSuccessModal = ({ 
  item,
  isOpen,
  onClose,
  userXP
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 300);
      setTimeout(() => setShowConfetti(true), 800);
      setTimeout(() => setShowGlow(true), 1000);
    } else {
      setShowContent(false);
      setShowConfetti(false);
      setShowGlow(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => onClose(), 300);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'from-purple-400 via-pink-500 to-purple-600';
      case 'rare': return 'from-blue-400 via-cyan-500 to-blue-600';
      default: return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md transition-opacity duration-500" />
      
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400 opacity-70" />
            </div>
          ))}
        </div>
      )}

      <div className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-gray-700 shadow-2xl w-full max-w-md transition-all duration-500 transform ${
        showContent ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
      }`}>
        
        {showGlow && (
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-30 animate-pulse" />
        )}
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors rounded-full p-2 hover:bg-gray-700/50 backdrop-blur-sm"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative pt-8 pb-4 px-6 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
            <div className="relative h-20 w-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
              <Check className="h-10 w-10 text-white animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mt-4 mb-2">
            Purchase Successful!
          </h2>
          <p className="text-gray-300 text-sm">
            Your new item has been added to your inventory
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm">
            
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className={`absolute -inset-2 bg-gradient-to-r ${getRarityColor(item.rarity)} rounded-xl opacity-30 blur animate-pulse`} />
                <div className="relative h-24 w-24 rounded-xl overflow-hidden border-2 border-gray-600 shadow-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Gift className="h-6 w-6 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-sm px-3 py-1 rounded-full bg-gradient-to-r ${getRarityColor(item.rarity)} text-white font-medium`}>
                  {item.rarity?.charAt(0).toUpperCase() + item.rarity?.slice(1)}
                </span>
                <span className="text-sm text-gray-400 capitalize">{item.category}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg border border-yellow-800/30">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-yellow-200 font-medium">Cost Paid</span>
                </div>
                <span className="text-yellow-400 font-bold">{item.costXP.toLocaleString()} XP</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Remaining Balance</span>
                <span className="text-green-400 font-medium">
                  {(userXP - item.costXP).toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button 
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <div className="flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Continue Shopping
            </div>
          </button>
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 w-1 bg-white rounded-full opacity-40 animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessModal;