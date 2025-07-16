import React from 'react';
import { Grid, List, Plus } from 'lucide-react';

type LevelsToolbarProps = {
  levels: any[];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  setLevelToEdit: (level: any | null) => void;
  setShowLevelModal: (show: boolean) => void;
};

const LevelsToolbar: React.FC<LevelsToolbarProps> = ({
  levels,
  viewMode,
  setViewMode,
  setLevelToEdit,
  setShowLevelModal,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Levels
          <span className="ml-3 text-sm bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">
            {levels.length} items
          </span>
        </h2>
        <p className="text-gray-400 mt-1">Manage progression levels and rewards</p>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center bg-gray-900 rounded-lg border border-indigo-900/30 overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}
          >
            <Grid size={16} className="text-white" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600' : 'hover:bg-gray-800'}`}
          >
            <List size={16} className="text-white" />
          </button>
        </div>

        <button
          onClick={() => {
            setLevelToEdit(null);
            setShowLevelModal(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center transition-all duration-300 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} className="mr-2" />
          Add New Level
        </button>
      </div>
    </div>
  );
};

export default LevelsToolbar;
