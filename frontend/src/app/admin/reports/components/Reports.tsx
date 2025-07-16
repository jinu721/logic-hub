"use client";

import React, { useEffect, useState } from "react";

import { getReports} from "@/services/client/clientServices";

import Headers from "./Headers";
import ReportToolbar from "./ReportToolbar";
import Spinner from "@/components/shared/CustomLoader";
import ReportList from "./ReportList";
import Pagination from "@/components/shared/Pagination";

type ReportStatus = "Pending" | "Reviewed" | "Resolved" | "Rejected";

type ReportType = "User" | "Room" | "Group" | string;

export type Report = {
  _id: string;
  reason: string;
  reportedType: ReportType;
  createdAt: string;
  status: ReportStatus;
  description?: string;
  reporter?: {
    _id: string;
    username?: string;
    email: string;
  };
};

export type GroupedReport = {
  reportedId: string;
  reportedType: ReportType;
  totalReports: number;
  userInfo:{
    username:string,
    email:string,
  }
  groupInfo:{
    name:string;
    groupType:string
  }
  reports: Report[];
};

type Filters = {
  reportedType: string;
  status: string;
};

const AdminReports: React.FC = () => {
  const [activeTab] = useState("reports");
  const [reports, setReports] = useState<GroupedReport[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({ reportedType: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const fetchReports = async (filters: Filters, page: number, limit: number) => {
    try {
      setIsLoading(true);
      const response = await getReports(filters, page, limit);
      console.log('Reports', response);
      setReports(response.reports);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(filters, currentPage, limit);
  }, [filters, currentPage]);




  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <div className="ml-20">
        <Headers activeTab={activeTab} reports={reports as any} />
        <div className="p-8">
          <ReportToolbar
            reports={reports as any}
            filters={filters}
            setFilters={setFilters}
          />

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Spinner />
            </div>
          ) : reports.length === 0 ? (
            <div className="h-85 flex flex-col items-center justify-center">
              <p className="text-gray-400 mb-6 max-w-md mx-auto">No Items Found</p>
            </div>
          ) : (
            <ReportList
              reports={reports}
            />
          )}

          {!isLoading && reports.length > 0 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={limit}
            />
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminReports;
