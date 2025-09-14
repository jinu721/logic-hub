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
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChallengeDomainIF } from "@/types/domain.types";

type Props = {
  domain: ChallengeDomainIF;
};

const levelStyles = {
  novice: {
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    accent: "text-emerald-400",
  },
  adept: {
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accent: "text-blue-400",
  },
  master: {
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    accent: "text-purple-400",
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

const DomainCard: React.FC<Props> = ({ domain }: Props) => {
  const router = useRouter();
  const style = levelStyles[domain.level] || levelStyles.novice;
  const isExpired = domain.endTime && new Date(domain.endTime) < new Date();

  const getCardStatus = () => {
    if (domain.userStatus === "completed")
      return "border-emerald-500/30 bg-emerald-500/5";
    if (domain.userStatus === "failed-timeout" || domain.userStatus === "failed-output")
      return "border-red-500/30 bg-red-500/5";
    if (isExpired) 
      return "border-[var(--logichub-border)] bg-[var(--logichub-secondary-bg)]/30 opacity-60";
    return "border-[var(--logichub-border)] bg-[var(--logichub-card-bg)] hover:border-[var(--logichub-ring)]/50";
  };

  const getButtonConfig = () => {
    if (isExpired) {
      return {
        text: "Expired",
        className: "bg-[var(--logichub-secondary-bg)] text-[var(--logichub-muted-text)] cursor-not-allowed border border-[var(--logichub-border)]",
        disabled: true
      };
    }
    
    if (domain.userStatus === "completed") {
      return {
        text: "Review",
        className: "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30",
        disabled: false
      };
    }

    if (domain.userStatus === "failed-timeout" || domain.userStatus === "failed-output") {
      return {
        text: "Retry",
        className: "bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30",
        disabled: false
      };
    }

    return {
      text: "Start",
      className: "bg-[var(--logichub-accent)] text-[var(--logichub-accent-text)] hover:bg-[var(--logichub-btn-hover)] font-medium",
      disabled: false
    };
  };

  const buttonConfig = getButtonConfig();

  const handleClick = () => {
    if (!buttonConfig.disabled) {
      router.push(`/domain/${domain._id}`);
    }
  };

  return (
    <div
      className={`
        relative group rounded-lg border transition-all duration-200
        ${getCardStatus()}
        ${!isExpired ? "hover:-translate-y-0.5 cursor-pointer" : "cursor-not-allowed"}
      `}
      onClick={handleClick}
    >
      {/* Status Badge */}
      {domain.userStatus === "completed" && (
        <div className="absolute -top-1 -right-1 z-10 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          ✓
        </div>
      )}
      {(domain.userStatus === "failed-timeout" || domain.userStatus === "failed-output") && (
        <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          ✗
        </div>
      )}

      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded ${
              domain.userStatus === "completed" ? "bg-emerald-500/20 text-emerald-400" :
              domain.userStatus === "failed-timeout" || domain.userStatus === "failed-output" ? "bg-red-500/20 text-red-400" :
              "bg-[var(--logichub-secondary-bg)] text-[var(--logichub-secondary-text)]"
            }`}>
              {getDomainIcon(domain.type)}
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${style.badge}`}>
                {domain.level.charAt(0).toUpperCase() + domain.level.slice(1)}
              </span>
              {domain.isPremium && (
                <Crown className="h-3 w-3 text-amber-400" />
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-[var(--logichub-muted-text)]">
            <Clock className="h-3 w-3" />
            <span>{domain.timeLimit}m</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[var(--logichub-primary-text)] text-sm mb-2 line-clamp-1">
          {domain.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[var(--logichub-muted-text)] line-clamp-2 mb-3 leading-relaxed">
          {domain.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {domain.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-[var(--logichub-secondary-bg)] text-[var(--logichub-secondary-text)] px-2 py-0.5 rounded border border-[var(--logichub-border)]"
            >
              {tag}
            </span>
          ))}
          {domain.tags.length > 3 && (
            <span className="text-xs bg-[var(--logichub-secondary-bg)] text-[var(--logichub-muted-text)] px-2 py-0.5 rounded border border-[var(--logichub-border)]">
              +{domain.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 text-xs text-[var(--logichub-muted-text)]">
          <div className="flex items-center space-x-3">
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
            <span className="text-[var(--logichub-secondary-text)]">{domain.successRate || 0}%</span>
            <div className="w-8 bg-[var(--logichub-secondary-bg)] rounded-full h-1 border border-[var(--logichub-border)]">
              <div
                className={`h-full rounded-full ${
                  domain.successRate && domain.successRate > 70 ? "bg-emerald-500" :
                  domain.successRate && domain.successRate > 40 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${Math.min(domain.successRate || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`
            w-full py-2 px-3 rounded text-xs font-medium 
            flex items-center justify-center space-x-1.5 
            transition-all duration-200
            ${buttonConfig.className}
          `}
          disabled={buttonConfig.disabled}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <Play className="h-3 w-3" />
          <span>{buttonConfig.text}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(DomainCard);