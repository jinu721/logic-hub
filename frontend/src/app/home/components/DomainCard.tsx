import React from "react";
import {
  Code,
  KeySquare,
  Database,
  CheckCircle,
  PenTool,
  MoveVertical,
  Puzzle,
  Crown,
  Clock,
  Users,
  Zap,
  Lock,
  X,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChallengeDomainIF } from "@/types/domain.types";
type Props = {
  domain: ChallengeDomainIF;
};

const levelStyles = {
  novice: {
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    hover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  adept: {
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    hover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
  },
  master: {
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    hover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
};

const getDomainIcon = (type: string) => {
  const iconProps = { className: "h-4 w-4" };
  switch (type) {
    case "code":
      return <Code {...iconProps} />;
    case "cipher":
      return <KeySquare {...iconProps} />;
    case "sql":
      return <Database {...iconProps} />;
    case "mcq":
      return <CheckCircle {...iconProps} />;
    case "output-predict":
      return <PenTool {...iconProps} />;
    case "drag-drop":
      return <MoveVertical {...iconProps} />;
    default:
      return <Puzzle {...iconProps} />;
  }
};

const DomainCard: React.FC<Props> = ({ domain }:Props) => {
  const router = useRouter();

  const style = levelStyles[domain.level] || levelStyles.novice;

  const isExpired = domain.endTime && new Date(domain.endTime) < new Date();
//   const isNotStarted = domain.startTime && new Date(domain.startTime) > new Date();

  const getStatusColor = () => {
    if (domain.userStatus === "completed")
      return "border-emerald-500/50 bg-emerald-500/5";
    if (
      domain.userStatus === "failed-timeout" ||
      domain.userStatus === "failed-output"
    )
      return "border-rose-500/50 bg-rose-500/5";
    if (isExpired) return "border-gray-700 bg-gray-900/50 opacity-60";
    return `border-gray-700 ${style.hover} bg-gray-900/50`;
  };

  return (
    <div
      key={domain._id}
      className={`relative group bg-gray-950/80 backdrop-blur-sm rounded-xl border transition-all duration-300 hover:shadow-lg ${getStatusColor()} ${
        !isExpired
          ? "hover:-translate-y-0.5 cursor-pointer"
          : "cursor-not-allowed"
      } flex flex-col h-full`}
    >
      {domain.userStatus === "completed" && (
        <div className="absolute -top-2 -right-2 z-10 bg-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          ✓
        </div>
      )}
      {(domain.userStatus === "failed-timeout" ||
        domain.userStatus === "failed-output") && (
        <div className="absolute -top-2 -right-2 z-10 bg-rose-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          ✗
        </div>
      )}

      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div
              className={`p-1.5 rounded-lg ${
                domain.userStatus === "completed"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : domain.userStatus === "failed-timeout" ||
                    domain.userStatus === "failed-output"
                  ? "bg-rose-500/20 text-rose-400"
                  : isExpired
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {getDomainIcon(domain.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style.badge}`}
                >
                  {domain.level.charAt(0).toUpperCase() + domain.level.slice(1)}
                </span>
                {domain.isPremium && (
                  <Crown className="h-3 w-3 text-amber-400" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{domain.timeLimit}m</span>
          </div>
        </div>

        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 leading-tight">
          {domain.title}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {domain.description}
        </p>

        <div className="flex flex-wrap gap-1 h-6 mb-3">
          {domain.tags.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {domain.tags.length > 2 && (
            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
              +{domain.tags.length - 2}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center space-x-3 text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{domain.completedUsers || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>{domain.xpRewards} XP</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">{domain.successRate || 0}%</span>
            <div className="w-8 bg-gray-800 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${
                  domain.successRate && domain.successRate > 70
                    ? "bg-emerald-500"
                    : domain.successRate && domain.successRate > 40
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${domain.successRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex-grow mb-3">
          {domain.userStatus === "completed" && (
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1.5" />
              <span>Completed successfully!</span>
            </div>
          )}
          {domain.userStatus === "failed-timeout" && (
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center">
              <Clock className="h-3 w-3 mr-1.5" />
              <span>Timeout - Try again!</span>
            </div>
          )}
          {domain.userStatus === "failed-output" && (
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-400 flex items-center">
              <X className="h-3 w-3 mr-1.5" />
              <span>Failed - Try again!</span>
            </div>
          )}
        </div>

        <button
          className={`w-full cursor-pointer py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-all duration-200 ${
            isExpired
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : domain.userStatus === "completed"
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : domain.userStatus === "failed-timeout" ||
                domain.userStatus === "failed-output"
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : domain.isPremium
              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
          onClick={() => {
            if (!isExpired) router.push(`/domain/${domain._id}`);
          }}
        >
          {isExpired ? (
            <>
              <Lock className="h-3 w-3" />
              <span>Expired</span>
            </>
          ) : domain.userStatus === "completed" ? (
            <>
              <CheckCircle className="h-3 w-3" />
              <span>Revisit</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              <span>Start</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default React.memo(DomainCard);
