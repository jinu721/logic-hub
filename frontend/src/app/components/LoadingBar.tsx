"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(false);
    setProgress(0);
  }, [pathname]);

  useEffect(() => {
    let progressInterval;
    
    if (loading) {
      setProgress(0);
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev; 
          
          const increment = prev < 20 ? 0.8 : prev < 80 ? 1.2 : 0.3;
          return Math.min(prev + increment, 95);
        });
      }, 50); 
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [loading]);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const links = mutation.target.querySelectorAll?.('a[href^="/"]') || [];
          links.forEach(link => {
            if (!link.dataset.listenerAdded) {
              link.dataset.listenerAdded = 'true';
              link.addEventListener('click', handleStart);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    const existingLinks = document.querySelectorAll('a[href^="/"]');
    existingLinks.forEach(link => {
      if (!link.dataset.listenerAdded) {
        link.dataset.listenerAdded = 'true';
        link.addEventListener('click', handleStart);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className={`fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-200/20 to-slate-300/20 z-[9999] transition-opacity duration-500 ${
        loading || progress > 0 ? 'opacity-100' : 'opacity-0'
      }`}>
        <div 
          className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 relative overflow-hidden transition-all duration-200 ease-out"
          style={{ 
            width: `${progress}%`,
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
          }}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.8s ease-in-out infinite'
            }}
          />
          
          <div 
            className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white/60 via-white/30 to-transparent"
            style={{
              filter: 'blur(1px)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        </div>
        
        <div 
          className="absolute top-1 left-0 h-2 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 blur-sm transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { 
            background-position: -200% 0;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% { 
            background-position: 200% 0;
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.6;
            transform: scaleX(1);
          }
          50% { 
            opacity: 1;
            transform: scaleX(1.1);
          }
        }
      `}</style>
    </>
  );
}