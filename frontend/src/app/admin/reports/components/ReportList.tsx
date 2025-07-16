import React, { useState } from "react";
import {
  AlertTriangle,
  User,
  Calendar,
  Shield,
  Users,
  Layers,
  Mail,
} from "lucide-react";
import { GroupedReport, Report } from "./Reports";
import ReportModal from "./ReportModal";

const ReportList: React.FC<{ reports: GroupedReport[] }> = ({ reports }) => {
  const [selectedReporters, setSelectedReporters] = useState<Report[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");

  const openReportersModal = (reporters: Report[], entityId: string) => {
    setSelectedReporters(reporters);
    setSelectedEntityId(entityId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReporters([]);
    setSelectedEntityId("");
  };



  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "user":
        return <User className="w-4 h-4" />;
      case "post":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };


  return (
    <>
      <div className="min-h-screen">
        <div className="grid gap-6">
          {reports.map((report) => (
            <div
              key={report.reportedId}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    {getTypeIcon(report.reportedType)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Reported {report.reportedType}
                    </h2>
                    <p className="text-slate-300 text-sm">
                      ID: {report.reportedId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {report.totalReports}
                    </div>
                    <div className="text-sm text-slate-300">Total Reports</div>
                  </div>
                  <button
                    onClick={() =>
                      openReportersModal(
                        report.reports,
                        report.reportedId
                      )
                    }
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Users className="w-4 h-4" />
                    View Reporters
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-black/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {report.reportedType}
                        </p>
                        <p className="text-xs text-slate-400">
                          Violated {report.reportedType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        {getTypeIcon(report.reportedType)}
                        <span className="font-medium">
                          {report.reportedType === "Group"
                            ? "Group Name"
                            : "User Name"}
                        </span>
                      </div>
                      <p className="text-white bg-black/20 rounded-lg p-2">
                        {report.reportedType === "Group" ? report.groupInfo.name : report.userInfo.username}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-300">
                        {
                          report.reportedType === "Group" ? <Layers className="w-4 h-4" /> : <Mail className="w-4 h-4" />
                        }
                        <span className="font-medium">{report.reportedType === "Group" ? "Group Type" : "Email"}</span>
                      </div>
                      <p className="text-white bg-black/20 rounded-lg p-2">
                        {report.reportedType === "Group" ? report.groupInfo.groupType : report.userInfo.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Reports Found
            </h3>
            <p className="text-slate-300">All content is clean and safe!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ReportModal
          selectedReporters={selectedReporters}
          selectedEntityId={selectedEntityId}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default ReportList;
