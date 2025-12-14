import React, { useState, useEffect } from "react";
import DomainListing from "./DomainListing";
import { UserIF } from "@/types/user.types";
import { ChallengeDomainIF } from "@/types/domain.types";

interface DomainsSectionProps {
  challenges: ChallengeDomainIF[];
  user: UserIF;
}

const DomainsSection: React.FC<DomainsSectionProps> = ({ challenges, user }) => {
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedDomains, setDisplayedDomains] = useState<ChallengeDomainIF[]>([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [challenges]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedDomains(challenges.slice(startIndex, endIndex));
  }, [currentPage, challenges, itemsPerPage]);

  const totalPages = Math.ceil(challenges.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mb-12 mt-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Available Domains ({challenges.length})</h2>
        </div>
      </div>

      <DomainListing
        domains={displayedDomains}
        isLoading={false}
        error={null}
        user={user}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 text-sm rounded-md transition-colors ${currentPage === pageNum
                      ? 'bg-gradient-to-r from-purple-600 to-purple-900 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsSection;