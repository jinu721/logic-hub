import React from "react";
import { Filter,  } from "lucide-react";
import { GroupedReport } from "@/types/report.types";

type Props = {
  reports: GroupedReport[];
  filters: {
    reportedType: string;
    status: string;
  };
  setFilters: (filters: { reportedType: string; status: string }) => void;
};

const ReportToolbar: React.FC<Props> = ({
  reports,
  filters,
  setFilters,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Grouped Reports
          <span className="ml-3 text-sm bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">
            {reports.length} groups
          </span>
        </h2>
        <p className="text-gray-400 mt-1">
          Manage reports grouped by reported user/content
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center space-x-3">
          <div className="relative group">
            <select
              className="bg-gray-900 border border-indigo-900/30 rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
              value={filters.reportedType}
              onChange={(e) => setFilters({ ...filters, reportedType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="User">Users</option>
              <option value="Room">Rooms</option>
              <option value="Group">Groups</option>
            </select>
            <Filter
              size={14}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative group">
            <select
              className="bg-gray-900 border border-indigo-900/30 rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition-all"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Filter
              size={14}
              className="absolute right-3 top-3 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportToolbar;
