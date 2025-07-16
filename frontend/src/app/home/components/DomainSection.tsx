import React, { useEffect, useState, useCallback } from "react";
import { getChallenges } from "@/services/client/clientServices"; 
import DomainListing from "./DomainListing"
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

  const fetchDomains = useCallback(async (filterParams: Filters = {}) => {
    setIsLoading(true);
    try {
      const data = await getChallenges(filterParams);
      setDomains(data.challenges);
      setError(null);
    } catch (error) {
      console.error("Error fetching domains:", error);
      setError("Failed to load domains. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDomains(filters);
  }, [filters, fetchDomains]);

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
    </div>
  );
};

export default DomainsSection;
