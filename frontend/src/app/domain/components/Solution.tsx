import { useEffect, useRef, useState } from "react";
import { ChevronDown, Code, Filter, Search } from "lucide-react";
import {
  addSolution,
  getSolutionsByChallengeId,
} from "@/services/client/clientServices";

import { useToast } from "@/context/Toast";
import SolutionForm from "./SolutionForm";
import SolutionCard from "./SolutionCard";
import SolutionDetail from "./SolutionDetail";
import { SolutionIF } from "@/types/solution.types";
import { ChallengeDomainIF } from "@/types/domain.types";
import { UserIF } from "@/types/user.types";
import { debounce } from "lodash";

type SolutionsSectionProps = {
  challenge: ChallengeDomainIF;
  user: UserIF;
};

const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  challenge,
  user,
}) => {
  const [selectedSolution, setSelectedSolution] = useState<SolutionIF | null>(
    null
  );
  const [showAddSolution, setShowAddSolution] = useState<boolean>(false);
  const [solutionsData, setSolutionsData] = useState<SolutionIF[]>([]);
  const [sortBy, setSortBy] = useState<"likes" | "newest" | "comments">(
    "likes"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 3;

  const containerRef = useRef<HTMLDivElement>(null);

  const { showToast } = useToast() as any;

  const fetchSolutions = async (
    challengeId: string,
    search = "",
    page = 1,
    limit = 10,
    sortBy = "likes"
  ) => {
    try {
      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const result = await getSolutionsByChallengeId(
        challengeId,
        search,
        page,
        limit,
        sortBy
      );

      if (page === 1) {
        setSolutionsData(result || []);
      } else {
        setSolutionsData((prev) => [...(prev || []), ...(result || [])]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchSolutions(challenge._id as string, search, page, limit, sortBy);
  }, [search, page, sortBy]);

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      if (container && isNearBottom(container)) {
        setPage((prev) => prev + 1);
      }
    };

    const throttledScroll = debounce(handleScroll, 200);

    container?.addEventListener("scroll", throttledScroll);
    return () => container?.removeEventListener("scroll", throttledScroll);
  }, []);

  const isNearBottom = (el: HTMLElement) => {
    return el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
  };

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSelect = (value: "likes" | "newest" | "comments") => {
    setSortBy(value);
    setOpen(false);
  };
  const handleAddSolution = async (newSolutionData: Partial<SolutionIF>) => {
    try {
      const result = await addSolution(newSolutionData);
      setSolutionsData([...solutionsData, result]);
      setShowAddSolution(false);
      showToast({ type: "success", message: "Solution Added" });
    } catch (err) {
      console.error(err);
      showToast({ type: "error", message: "Error Adding Solution" });
    }
  };

  const handleCancelSolution = () => {
    setShowAddSolution(false);
  };

  const sortedSolutions = [...(solutionsData || [])].sort((a, b) => {
    if (sortBy === "likes") {
      return b.likes.length - a.likes.length;
    } else if (sortBy === "newest") {
      return (
        new Date(b.createdAt || new Date()).getTime() -
        new Date(a.createdAt || new Date()).getTime()
      );
    } else if (sortBy === "comments") {
      return b.comments.length - a.comments.length;
    }
    return 0;
  });

  if (selectedSolution) {
    return (
      <SolutionDetail
        solution={selectedSolution}
        currentUserId={user.userId || user._id}
        user={user}
        challenge={challenge}
        onBack={() => setSelectedSolution(null)}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-850">
      <div className="p-4 flex items-center justify-between border-b border-gray-700 sticky top-0 bg-gray-850 z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
              placeholder="Search solutions..."
            />
          </div>

          <div className="relative">
            <div className="relative inline-block text-sm text-gray-300">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 w-full"
              >
                <Filter size={14} />
                <span>Sort:</span>
                <span className="font-medium">
                  {sortBy === "likes"
                    ? "Most Likes"
                    : sortBy === "newest"
                      ? "Newest"
                      : "Most Comments"}
                </span>
                <ChevronDown size={14} />
              </button>

              {open && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  <div
                    onClick={() => handleSelect("likes")}
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${sortBy === "likes" ? "bg-gray-700 font-medium" : ""
                      }`}
                  >
                    Most Likes
                  </div>
                  <div
                    onClick={() => handleSelect("newest")}
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${sortBy === "newest" ? "bg-gray-700 font-medium" : ""
                      }`}
                  >
                    Newest
                  </div>
                  <div
                    onClick={() => handleSelect("comments")}
                    className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${sortBy === "comments" ? "bg-gray-700 font-medium" : ""
                      }`}
                  >
                    Most Comments
                  </div>
                </div>
              )}
            </div>
            <div className="absolute mt-1 left-0 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden hidden">
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setSortBy("likes")}
              >
                Most Likes
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setSortBy("newest")}
              >
                Newest
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                onClick={() => setSortBy("comments")}
              >
                Most Comments
              </button>
            </div>
          </div>
        </div>

        <button
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center"
          onClick={() => setShowAddSolution(true)}
        >
          <Code size={16} className="mr-2" />
          Add Solution
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="text-center py-4 text-gray-400">Loading...</div>
          </div>
        ) : solutionsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-gray-800 rounded-full p-6 mb-6 shadow-inner">
              <Code size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-3">
              No solutions yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Be the first to submit a solution for this challenge and help
              others learn from your approach!
            </p>
            <button
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium"
              onClick={() => setShowAddSolution(true)}
            >
              Add Your Solution
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedSolutions.map((solution) => (
              <SolutionCard
                key={solution._id}
                solution={solution}
                onClick={() => setSelectedSolution(solution)}
              />
            ))}
          </div>
        )}
        {isFetchingMore && (
          <div className="text-center py-4 text-gray-400">Loading more...</div>
        )}
      </div>

      {showAddSolution && (
        <SolutionForm
          challenge={challenge}
          onCancel={handleCancelSolution}
          onSubmit={handleAddSolution}
        />
      )}
    </div>
  );
};

export default SolutionsSection;
