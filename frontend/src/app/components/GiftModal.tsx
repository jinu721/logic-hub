import React, { useState, useEffect } from "react";
import { Sparkles, X, Star } from "lucide-react";

interface GiftData {
  name: string;
  description: string;
  image: string;
  rarity: keyof typeof rarityConfig;
  type: "banner" | "badge" | string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GiftData;
}

const rarityConfig = {
  Common: {
    gradient: "from-gray-400 to-gray-600",
    glow: "shadow-gray-400/20",
    particles: "text-gray-300",
    border: "border-gray-400/30",
    bg: "bg-gray-900/80",
  },
  Uncommon: {
    gradient: "from-green-400 to-green-600",
    glow: "shadow-green-400/30",
    particles: "text-green-300",
    border: "border-green-400/30",
    bg: "bg-green-900/20",
  },
  Rare: {
    gradient: "from-blue-400 to-blue-600",
    glow: "shadow-blue-400/40",
    particles: "text-blue-300",
    border: "border-blue-400/30",
    bg: "bg-blue-900/20",
  },
  Epic: {
    gradient: "from-purple-400 to-purple-600",
    glow: "shadow-purple-400/50",
    particles: "text-purple-300",
    border: "border-purple-400/30",
    bg: "bg-purple-900/20",
  },
  Legendary: {
    gradient: "from-yellow-400 via-orange-400 to-red-500",
    glow: "shadow-yellow-400/60",
    particles: "text-yellow-300",
    border: "border-yellow-400/40",
    bg: "bg-gradient-to-br from-yellow-900/20 to-red-900/20",
  },
};

const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, data }) => {
  const [phase, setPhase] = useState<"closed" | "opening" | "revealing" | "revealed">("closed");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentGift, setCurrentGift] = useState<GiftData | null>(null);

  useEffect(() => {
    if (phase === "revealing" || phase === "revealed") {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
      }));
      setParticles(newParticles);
    }
  }, [phase]);

  const openGift = () => {
    setCurrentGift(data);
    setPhase("opening");
    setTimeout(() => setPhase("revealing"), 1800);
    setTimeout(() => setPhase("revealed"), 2300);
  };

  const closeModal = () => {
    onClose();
    setTimeout(() => {
      setPhase("closed");
      setCurrentGift(null);
      setParticles([]);
    }, 300);
  };

  const config = currentGift ? rarityConfig[currentGift.rarity] : rarityConfig.Common;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className={`relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-500 ${
              isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
            } ${config.bg}`}
          >
            {(phase === "revealing" || phase === "revealed") &&
              particles.map((particle) => (
                <div
                  key={particle.id}
                  className={`absolute w-1 h-1 ${config.particles} rounded-full animate-ping pointer-events-none`}
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    animationDelay: `${particle.delay}s`,
                    animationDuration: `${particle.duration}s`,
                  }}
                />
              ))}

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              {phase === "closed" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                      Mystery Gift
                    </h2>
                    <p className="text-gray-400">What treasures await inside?</p>
                  </div>

                  <div className="relative mx-auto w-32 h-32 group cursor-pointer" onClick={openGift}>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-2xl group-hover:shadow-red-500/30 transition-all duration-300 group-hover:scale-105">
                      <div className="absolute inset-2 bg-gradient-to-br from-red-400 to-red-600 rounded-xl"></div>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 opacity-90 rounded-full"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-90 rounded-full"></div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg">
                      <div className="absolute inset-1 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full"></div>
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-300 animate-pulse" />
                    <Sparkles
                      className="absolute -bottom-2 -left-2 w-4 h-4 text-blue-300 animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </div>

                  <button
                    onClick={openGift}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                  >
                    Open Gift
                  </button>
                </div>
              )}

              {phase === "opening" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white animate-pulse">Opening...</h2>
                </div>
              )}

              {phase === "revealing" && currentGift && (
                <div className="space-y-6">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent animate-pulse`}>
                    {currentGift.rarity}!
                  </div>
                  <div className="relative mx-auto w-40 h-40">
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} rounded-full animate-pulse ${config.glow} shadow-2xl`} />
                    <div className={`absolute inset-2 bg-slate-900/50 rounded-full border-2 ${config.border} backdrop-blur-sm`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl animate-bounce" style={{ animationDuration: "0.8s" }}></div>
                    </div>
                  </div>
                </div>
              )}

              {phase === "revealed" && currentGift && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${config.gradient} rounded-full text-white text-sm font-semibold mb-3`}>
                      <Star className="w-4 h-4" />
                      {currentGift.rarity}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{currentGift.name}</h2>
                    <p className="text-gray-400">{currentGift.description}</p>
                  </div>

                  <div className={`relative mx-auto ${
                    currentGift.type === "banner"
                      ? "w-64 h-20"
                      : currentGift.type === "badge"
                      ? "w-32 h-32"
                      : "w-36 h-36"
                  }`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} ${
                      currentGift.type === "banner" ? "rounded-2xl" : "rounded-3xl"
                    } ${config.glow} shadow-2xl`} />
                    <div className={`absolute inset-2 bg-slate-900/30 ${
                      currentGift.type === "banner" ? "rounded-xl" : "rounded-2xl"
                    } border ${config.border} backdrop-blur-sm flex items-center justify-center`}>
                      <img
                        className={`${
                          currentGift.type === "banner"
                            ? "w-full h-12 object-cover"
                            : currentGift.type === "badge"
                            ? "w-20 h-20 object-cover"
                            : "w-24 h-24 object-cover"
                        }`}
                        src={currentGift.image}
                        alt={currentGift.name}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftModal;
