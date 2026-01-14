import { Users, Lock, Globe, Tag, Clock, Plus } from "lucide-react";

interface Group {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    groupType: "public-open" | "public-approval";
    category?: string;
    tags?: string[];
    members: any[];
    createdBy: any;
    createdAt: Date;
}

interface GroupCardProps {
    group: Group;
    onClick: () => void;
}

export default function GroupCard({ group, onClick }: GroupCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group hover:shadow-xl hover:shadow-indigo-900/20"
        >
            <div className="flex items-start gap-4">
                {/* Group Avatar */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {group.image ? (
                        <img
                            src={group.image}
                            alt={group.name}
                            className="w-full h-full rounded-xl object-cover"
                        />
                    ) : (
                        <Users className="w-8 h-8 text-white" />
                    )}
                </div>

                {/* Group Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors truncate mb-1">
                        {group.name}
                    </h3>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {group.description || "No description available"}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>{group.members?.length || 0} members</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {group.groupType === "public-open" ? (
                                <>
                                    <Globe className="w-3.5 h-3.5 text-green-400" />
                                    <span className="text-green-400">Open</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-3.5 h-3.5 text-yellow-400" />
                                    <span className="text-yellow-400">Approval</span>
                                </>
                            )}
                        </div>
                        {group.category && (
                            <div className="flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5" />
                                <span>{group.category}</span>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    {group.tags && group.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {group.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-gray-800/50 text-indigo-300 rounded-lg text-[10px] font-medium border border-indigo-500/20"
                                >
                                    {tag}
                                </span>
                            ))}
                            {group.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-800/50 text-gray-400 rounded-lg text-[10px]">
                                    +{group.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
