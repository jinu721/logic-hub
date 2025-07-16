import { ChallengeDomainIF } from "@/types/domain.types";
import DomainCard from "./DomainCard";
import { UserIF } from "@/types/user.types";


type Props = {
  user:UserIF
  domains: ChallengeDomainIF[];
  isLoading: boolean;
  error: string | null;
};

const DomainListing = ({ domains, isLoading, error}: Props) => {
  if (isLoading) {
    return (
      <div className="h-64 w-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 text-red-400 p-4 rounded-xl border border-red-700/30">
        {error}
      </div>
    );
  }

  if(domains.length === 0) return <div className="bg-gray-900/20 text-gray-400 p-4 text-center rounded-xl border border-gray-700/30">No domains found</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
      {domains
        .filter((domain: ChallengeDomainIF) => domain?.isActive)
        .map((domain: ChallengeDomainIF) => (
          <DomainCard
            key={domain._id}
            domain={domain}
            // user={user}
          />
        ))}
    </div>
  );
};


export default DomainListing;