import React, { useEffect, useState, useCallback } from "react";
import { getChallenges } from "@/services/client/clientServices";
import DomainListing from "./DomainListing";
import { UserIF } from "@/types/user.types";
import { ChallengeDomainIF } from "@/types/domain.types";

interface Filters {
  category?: string;
  difficulty?: string;
  [key: string]: any;
}

interface DomainsSectionProps {
  filters: Filters;
  user: UserIF;
}

const DomainsSection: React.FC<DomainsSectionProps> = ({ filters, user }) => {
  const [domains, setDomains] = useState<ChallengeDomainIF[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchDomains = useCallback(async (filterParams: Filters = {}, page: number = 1) => {
    setIsLoading(true);
    try {
      const data = await getChallenges({
        ...filterParams,
        page,
        limit: itemsPerPage,
      });
      console.log("Domains", data);
      setTotalItems(data.totalItems);
      setDomains(data.challenges);
      setError(null);
    } catch (error) {
      console.error("Error fetching domains:", error);
      setError("Failed to load domains. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchDomains(filters, 1);
  }, [filters, fetchDomains]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchDomains(filters, page);
    }
  };

  return (
    <div className="mb-12 mt-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-white">Available Domains</h2>
        </div>
      </div>
      
      <DomainListing
        domains={domains}
        isLoading={isLoading}
        error={error}
        user={user}
      />
      
      {totalPages > 1 && !isLoading && !error && (
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
                  className={`w-8 h-8 text-sm rounded-md transition-colors ${
                    currentPage === pageNum
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