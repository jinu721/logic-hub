export const getRankCrown = (rank:number) => {
  if (rank === 1) {
    return (
      <div className="absolute bottom-4 right-6 z-20 transform hover:scale-110 transition-all duration-500 group/rank">
        <div className="absolute inset-0 bg-yellow-500 rounded-full blur opacity-60 scale-110 group-hover/rank:opacity-80 group-hover/rank:scale-125 transition-all duration-500"></div>
        <div className="relative w-7 h-7 sm:w-7 sm:h-7">
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-b-lg shadow-lg"></div>
          <div className="absolute bottom-1/2 left-0 w-1/5 h-1/2 bg-gradient-to-t from-yellow-500 to-yellow-300 transform skew-x-12"></div>
          <div className="absolute bottom-1/2 left-1/5 w-1/5 h-3/4 bg-gradient-to-t from-yellow-500 to-yellow-300 transform -skew-x-6"></div>
          <div className="absolute bottom-1/2 left-2/5 w-1/5 h-full bg-gradient-to-t from-yellow-500 to-yellow-300"></div>
          <div className="absolute bottom-1/2 left-3/5 w-1/5 h-3/4 bg-gradient-to-t from-yellow-500 to-yellow-300 transform skew-x-6"></div>
          <div className="absolute bottom-1/2 left-4/5 w-1/5 h-1/2 bg-gradient-to-t from-yellow-500 to-yellow-300 transform -skew-x-12"></div>
          <div className="absolute bottom-1/2 left-1/5 w-1/5 h-1/6 bg-red-500 rounded-full transform translate-y-1"></div>
          <div className="absolute bottom-1/2 left-3/5 w-1/5 h-1/6 bg-blue-500 rounded-full transform translate-y-1"></div>
          <div className="absolute bottom-1/3 left-2/5 w-1/5 h-1/6 bg-green-500 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-white bg-black/40 rounded-full w-6 h-6 flex items-center justify-center">
              {rank}
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-yellow-400/30 animate-ping-slow"></div>
      </div>
    );
  } else if (rank === 2) {
    return (
      <div className="absolute bottom-4 right-6 z-20 transform hover:scale-110 transition-all duration-500 group/rank">
        <div className="absolute inset-0 bg-blue-300 rounded-full blur opacity-50 scale-110 group-hover/rank:opacity-80 group-hover/rank:scale-125 transition-all duration-500"></div>
        <div className="relative w-7 h-7 sm:w-7 sm:h-7">
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-br from-blue-200 to-gray-400 rounded-lg shadow-lg"></div>
          <div className="absolute bottom-1/4 left-0 right-0 mx-auto w-3/4 h-3/4 bg-gradient-to-t from-blue-300 to-gray-100" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-white bg-black/40 rounded-full w-6 h-6 flex items-center justify-center">
              {rank}
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-blue-400/30 animate-ping-slow"></div>
      </div>
    );
  } else if (rank === 3) {
    return (
      <div className="absolute bottom-4 right-6 z-20 transform hover:scale-110 transition-all duration-500 group/rank">
        <div className="absolute inset-0 bg-amber-600 rounded-full blur opacity-50 scale-110 group-hover/rank:opacity-80 group-hover/rank:scale-125 transition-all duration-500"></div>
        <div className="relative w-7 h-7 sm:w-7 sm:h-7">
          <div className="absolute bottom-0 w-full h-full rounded-full overflow-hidden">
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-amber-700 to-amber-500" style={{clipPath: 'polygon(0% 50%, 30% 30%, 50% 20%, 70% 30%, 100% 50%, 70% 70%, 50% 80%, 30% 70%, 0% 50%)'}}></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-700 to-amber-500" style={{clipPath: 'polygon(0% 50%, 30% 30%, 50% 20%, 70% 30%, 100% 50%, 70% 70%, 50% 80%, 30% 70%, 0% 50%)'}}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-white bg-black/40 rounded-full w-6 h-6 flex items-center justify-center">
              {rank}
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-amber-600/30 animate-ping-slow"></div>
      </div>
    );
  } else if (rank === 4) {
    return (
      <div className="absolute bottom-4 right-6 z-20 transform hover:scale-110 transition-all duration-500 group/rank">
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-50 scale-110 group-hover/rank:opacity-80 group-hover/rank:scale-125 transition-all duration-500"></div>
        <div className="relative w-7 h-7 sm:w-7 sm:h-7">
          <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg"></div>
          <div className="absolute bottom-1/3 left-1/6 w-1/6 h-1/3 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg"></div>
          <div className="absolute bottom-1/3 left-3/6 w-1/6 h-2/3 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg"></div>
          <div className="absolute bottom-1/3 left-5/6 w-1/6 h-1/3 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg transform -translate-x-full"></div>
          <div className="absolute bottom-2/3 left-1/6 w-1/6 h-1/6 bg-teal-300 rounded-full"></div>
          <div className="absolute bottom-full left-3/6 w-1/6 h-1/6 bg-teal-300 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute bottom-2/3 left-5/6 w-1/6 h-1/6 bg-teal-300 rounded-full transform -translate-x-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-white bg-black/40 rounded-full w-6 h-6 flex items-center justify-center">
              {rank}
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-emerald-400/30 animate-ping-slow"></div>
      </div>
    );
  } else if (rank === 5) {
    return (
      <div className="absolute bottom-4 right-6 z-20 transform hover:scale-110 transition-all duration-500 group/rank">
        <div className="absolute inset-0 bg-purple-500 rounded-full blur opacity-50 scale-110 group-hover/rank:opacity-80 group-hover/rank:scale-125 transition-all duration-500"></div>
        <div className="relative w-7 h-7 sm:w-7 sm:h-7">
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-lg shadow-lg"></div>
          <div className="absolute bottom-1/2 left-0 w-full h-1/2">
            <div className="absolute bottom-0 left-1/10 w-1/5 h-3/4 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-3/10 w-1/5 h-full bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-5/10 w-1/5 h-2/3 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-7/10 w-1/5 h-full bg-gradient-to-t from-purple-500 to-indigo-400 rounded-t-lg"></div>
          </div>
          <div className="absolute bottom-3/4 left-1/10 w-1/5 h-1/8 bg-indigo-300 rounded-full"></div>
          <div className="absolute bottom-full left-3/10 w-1/5 h-1/8 bg-indigo-300 rounded-full transform -translate-y-1/4"></div>
          <div className="absolute bottom-2/3 left-5/10 w-1/5 h-1/8 bg-indigo-300 rounded-full"></div>
          <div className="absolute bottom-full left-7/10 w-1/5 h-1/8 bg-indigo-300 rounded-full transform -translate-y-1/4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-white bg-black/40 rounded-full w-6 h-6 flex items-center justify-center">
              {rank}
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-purple-400/30 animate-ping-slow"></div>
      </div>
    );
  } else {
    return (
      <div className="absolute bottom-4 right-6 z-20 transform hover:scale-110 transition-all duration-500 group/rank">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur opacity-50 scale-110 group-hover/rank:opacity-80 group-hover/rank:scale-125 transition-all duration-500"></div>
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full w-8 h-8 sm:w-10 sm:h-10 
          flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover/rank:shadow-indigo-500/50
          group-hover/rank:from-indigo-500 group-hover/rank:to-purple-600 transition-all duration-500">
          <div className="absolute inset-1 rounded-full bg-gray-900/80 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-200">
              {rank}
            </span>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-indigo-400/30 animate-ping-slow"></div>
      </div>
    );
  }
};