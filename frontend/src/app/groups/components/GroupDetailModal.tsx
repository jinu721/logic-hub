import { X, Users, Globe, Lock, Tag, Clock, Plus, Check } from "lucide-react";
import { useState } from "react";

interface Group {
    _id: string;
    name: string;
    description?: string;
    image?: string;
    groupType: "public-open" | "public-approval";
    category?: string;
    tags?: string[];
    members: any[];
    admins: any[];
    createdBy: any;
    createdAt: Date;
}

interface GroupDetailModalProps {
    group: Group | null;
    onClose: () => void;
    onJoin: (groupId: string) => void;
    isJoined?: boolean;
    isPending?: boolean;
}

export default function GroupDetailModal({
    group,
    onClose,
    onJoin,
    isJoined = false,
    isPending = false,
}: GroupDetailModalProps) {
    if (!group) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-gray-900 border border-gray-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 p-6 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
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
                        <div>
                            <h2 className="text-2xl font-bold text-white">{group.name}</h2>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <Users className="w-4 h-4" />
                                    <span>{(group.members?.length || 0) + (group.admins?.length || 0)} members</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm">
                                    {group.groupType === "public-open" ? (
                                        <>
                                            <Globe className="w-4 h-4 text-green-400" />
                                            <span className="text-green-400">Open Group</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 text-yellow-400" />
                                            <span className="text-yellow-400">Approval Required</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">About</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {group.description || "No description available for this group."}
                        </p>
                    </div>

                    {/* Category */}
                    {group.category && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">Category</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg text-sm text-gray-300">
                                <Tag className="w-4 h-4" />
                                {group.category}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {group.tags && group.tags.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {group.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-gray-800/50 text-indigo-300 rounded-lg text-sm font-medium border border-indigo-500/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Created Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 mb-2">Created</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(group.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    </div>

                    {/* Members Preview */}
                    {(group.members?.length > 0 || group.admins?.length > 0) && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 mb-3">Members</h3>
                            <div className="flex -space-x-2">
                                {[...group.admins, ...group.members]
                                    .filter(Boolean)
                                    .slice(0, 8)
                                    .map((member, i) => (
                                        <div
                                            key={member.userId || i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-medium border-2 border-gray-900 text-white"
                                            title={member.username}
                                        >
                                            {member.username?.charAt(0).toUpperCase() || "?"}
                                        </div>
                                    ))}
                                {(group.admins?.length || 0) + (group.members?.length || 0) > 8 && (
                                    <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-900 flex items-center justify-center text-xs text-gray-300">
                                        +{(group.admins?.length || 0) + (group.members?.length || 0) - 8}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 p-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-all"
                        >
                            Close
                        </button>
                        {isJoined ? (
                            <div className="flex-1 px-6 py-3 bg-green-900/30 text-green-300 rounded-xl font-medium flex items-center justify-center gap-2 border border-green-700/50">
                                <Check className="w-5 h-5" />
                                Joined
                            </div>
                        ) : isPending ? (
                            <div className="flex-1 px-6 py-3 bg-yellow-900/30 text-yellow-300 rounded-xl font-medium flex items-center justify-center gap-2 border border-yellow-700/50">
                                <Clock className="w-5 h-5" />
                                Pending
                            </div>
                        ) : (
                            <button
                                onClick={() => onJoin(group._id)}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Join Group
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
