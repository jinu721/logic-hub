import React from 'react';

interface FloatingDot {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width: string;
  height: string;
  color: string;
  duration: string;
}

const dots: FloatingDot[] = [
  { top: '5rem', left: '2.5rem', width: '1.5rem', height: '1.5rem', color: 'bg-blue-500', duration: '4s' },
  { top: '10rem', right: '5rem', width: '2rem', height: '2rem', color: 'bg-purple-500', duration: '7s' },
  { bottom: '10rem', left: '25%', width: '1rem', height: '1rem', color: 'bg-green-500', duration: '5s' },
  ...Array(10).fill({
    bottom: '5rem',
    right: '33.3333%',
    width: '1.25rem',
    height: '1.25rem',
    color: 'bg-pink-500',
    duration: '6s',
  }),
];

const FloatingDots: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {dots.map((dot, index) => (
        <div
          key={index}
          className={`absolute rounded-full opacity-10 animate-pulse ${dot.color}`}
          style={{
            top: dot.top,
            bottom: dot.bottom,
            left: dot.left,
            right: dot.right,
            width: dot.width,
            height: dot.height,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingDots;
