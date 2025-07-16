import { debounce } from "lodash";
import { Search, Grid, List, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Props = {
  activeTab: string;
  challenges: any[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  viewMode: string;
  setViewMode: (mode: "grid" | "list") => void;
  setChallengeToEdit: (challenge: any) => void;
  setShowChallengeModal: (show: boolean) => void;
};

export default function ChallengeToolbar({
  activeTab,
  challenges,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  setChallengeToEdit,
  setShowChallengeModal,
}: Props) {
  const [localInput, setLocalInput] = useState(searchTerm);
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(localInput);
    return () => debouncedSearch.cancel();
  }, [localInput]);
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          <span className="ml-3 text-sm bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">
            {challenges.length} items
          </span>
        </h2>
        <p className="text-gray-400 mt-1">Manage all {activeTab}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search..."
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            className="bg-gray-800/80 border border-gray-700/50 rounded-full px-5 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 group-hover:shadow-md group-hover:shadow-indigo-500/20"
          />
          <button className="absolute right-4 top-2.5">
            <Search size={18} className="text-indigo-400" />
          </button>
        </div>

        <div className="flex items-center bg-gray-900 rounded-lg border border-indigo-900/30 overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid" ? "bg-indigo-600" : "hover:bg-gray-800"
            }`}
          >
            <Grid size={16} className="text-white" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list" ? "bg-indigo-600" : "hover:bg-gray-800"
            }`}
          >
            <List size={16} className="text-white" />
          </button>
        </div>

        <button
          onClick={() => {
            setChallengeToEdit(null);
            setShowChallengeModal(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg flex items-center cursor-pointer transition-all duration-300 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} className="mr-2" />
          Add New Challenge
        </button>
      </div>
    </div>
  );
}
