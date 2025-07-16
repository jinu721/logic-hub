import React from 'react';

type Props = {
  activeTab: 'avatars' | 'banners' | 'badges';
  setActiveTab: React.Dispatch<React.SetStateAction<'avatars' | 'banners' | 'badges'>>;
  items: any[];
};

const Headers: React.FC<Props> = ({ activeTab,setActiveTab, items }) => {

  return (
    <>
      <div className="pt-10 mx-8 mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Inventory
        </h1>
      </div>

      <div className="mx-8 mb-6">
        <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-1 border border-indigo-900/30 inline-flex">
          <button
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'avatars'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                : 'hover:bg-gray-800/50 text-gray-400 hover:text-indigo-300'
            }`}
            onClick={() => setActiveTab("avatars")}
          >
            <span className="font-medium">Avatars</span>
            {activeTab === 'avatars' && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 text-xs font-bold rounded-full">
                {items.length}
              </span>
            )}
          </button>

          <button
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'banners'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                : 'hover:bg-gray-800/50 text-gray-400 hover:text-indigo-300'
            }`}
            onClick={() => setActiveTab("banners")}
          >
            <span className="font-medium">Banners</span>
            {activeTab === 'banners' && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 text-xs font-bold rounded-full">
                {items.length}
              </span>
            )}
          </button>

          <button
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20'
                : 'hover:bg-gray-800/50 text-gray-400 hover:text-indigo-300'
            }`}
            onClick={() => setActiveTab("badges")}
          >
            <span className="font-medium">Badges</span>
            {activeTab === 'badges' && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 text-xs font-bold rounded-full">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Headers;
