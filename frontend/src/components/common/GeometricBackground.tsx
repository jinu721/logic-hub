const GeometricBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute top-20 left-1/4 w-px h-32 bg-gradient-to-b from-slate-600 to-transparent opacity-30"></div>
    <div className="absolute top-40 right-1/3 w-px h-24 bg-gradient-to-b from-slate-500 to-transparent opacity-40"></div>
    <div className="absolute top-60 left-1/2 w-16 h-px bg-gradient-to-r from-slate-600 to-transparent opacity-30"></div>
    <div className="absolute bottom-40 right-1/4 w-12 h-px bg-gradient-to-l from-slate-500 to-transparent opacity-40"></div>
    
    <div className="absolute top-32 right-1/4 w-2 h-2 border border-slate-600 rotate-45 opacity-20"></div>
    <div className="absolute bottom-1/3 left-1/3 w-3 h-3 border border-slate-500 opacity-15"></div>
    <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-slate-400 rotate-45 opacity-30"></div>
  </div>
);

export default GeometricBackground;