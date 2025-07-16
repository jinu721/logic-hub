import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex items-center bg-gray-900/70 backdrop-blur-sm rounded-lg overflow-hidden border border-indigo-900/30 shadow-lg shadow-indigo-900/5">

        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900/70 hover:bg-indigo-600/70 disabled:opacity-50 disabled:hover:bg-transparent flex items-center transition-colors duration-300"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          disabled
          className="w-10 h-10 mx-2 flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded"
        >
          {currentPage}
        </button>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-900/70 hover:bg-indigo-600/70 disabled:opacity-50 disabled:hover:bg-transparent flex items-center transition-colors duration-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
