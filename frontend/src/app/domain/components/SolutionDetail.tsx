import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Clock,
  Edit,
  Heart,
  MessageCircle,
  Send,
  Trash,
  Trash2,
  User,
} from "lucide-react";
import CodeBlock from "./CodeBlock";
import { useToast } from "@/context/Toast";
import DeleteConfirmationModal from "@/components/shared/Delete";
import SolutionForm from "./SolutionForm";
import {
  addComment,
  deleteComment,
  deleteSolution,
  likeToggle,
  updateSolution,
} from "@/services/client/clientServices";
import { ChallengeDomainIF } from "@/types/domain.types";
import { SolutionIF } from "@/types/solution.types";




interface SolutionDetailProps {
  solution: SolutionIF;
  onBack: () => void;
  currentUserId: string;
  user: any;
  challenge: ChallengeDomainIF;
}

const SolutionDetail: React.FC<SolutionDetailProps> = ({
  solution,
  onBack,
  currentUserId,
  challenge,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [activeImplementationIdx, setActiveImplementationIdx] = useState(0);
  const [likeCount, setLikeCount] = useState(solution.likes.length || 0);
  const [showSolutionEditModal, setShowSolutionEditModal] = useState(false);
  const [showSolutionDeleteModal, setShowSolutionDeleteModal] = useState(false);
  const [showCommentDeleteModal, setShowCommentDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState("");
  const { showToast } = useToast() as any;

  useEffect(() => {
    setIsLiked(solution.likes.includes(currentUserId));
  }, [solution, currentUserId]);

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      await likeToggle(solution._id || "");
    } catch (err: any) {
      console.error(err);
      showToast({ type: "error", message: "Error liking Solution" });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const result = await addComment(solution._id || "", newComment);
      solution.comments.push(result.data);
      setNewComment("");
    } catch (err: any) {
      console.error(err);
      showToast({ type: "error", message: err.message || "Error adding comment" });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await deleteSolution(solution._id || "");
      showToast({ type: "success", message: "Solution Deleted Successfully" });
      setShowSolutionDeleteModal(false);
    } catch (err: any) {
      console.error(err);
      showToast({ type: "error", message: err.message || "Error deleting solution" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSolution = async (updateData: Partial<SolutionIF>) => {
    if (!updateData.title || !updateData.content) return
    try {
      await updateSolution(solution._id || "", updateData);
      solution.title = updateData.title;
      solution.content = updateData.content;
      showToast({ type: "success", message: "Solution updated successfully" });
      setShowSolutionEditModal(false);
    } catch (err: any) {
      console.error(err);
      showToast({ type: "error", message: err.message || "Error updating solution" });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setSelectedCommentId(commentId);
    setShowCommentDeleteModal(true);
  };

  const handleDeleteCommentConfirm = async () => {
    try {
      setIsLoading(true);
      await deleteComment(solution._id || "", selectedCommentId);
      solution.comments = solution.comments.filter(
        (comment) => comment._id !== selectedCommentId
      );
      showToast({ type: "success", message: "Comment Deleted Successfully" });
      setShowCommentDeleteModal(false);
    } catch (err: any) {
      console.error(err);
      showToast({ type: "error", message: "Error deleting comment" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gray-850">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-3 bg-gray-700 hover:bg-gray-600 p-2 rounded"
            >
              <ChevronDown className="transform rotate-90" size={16} />
            </button>
            <h2 className="text-lg font-medium text-white">{solution.title}</h2>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setShowSolutionEditModal(true)}
              className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1.5 rounded flex items-center text-gray-200"
            >
              <Edit size={14} className="mr-1" />
              Edit
            </button>
            <button
              onClick={() => setShowSolutionDeleteModal(true)}
              className="bg-red-700 hover:bg-red-600 text-sm px-3 py-1.5 rounded flex items-center text-gray-200"
            >
              <Trash size={14} className="mr-1" />
              Delete
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <div className="text-gray-200 font-medium">
                  {solution.user.username || "Anonymous"}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  <span>{new Date(solution.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="text-gray-300 leading-relaxed">{solution.content}</div>

            {solution.implementations && solution.implementations.length > 0 && (
              <div className="my-6 space-y-4">
                <div className="flex border-b border-gray-700 overflow-x-auto no-scrollbar">
                  {solution.implementations.map((impl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImplementationIdx(idx)}
                      className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeImplementationIdx === idx
                        ? "text-indigo-400 border-indigo-500"
                        : "text-gray-500 border-transparent hover:text-gray-300"
                        }`}
                    >
                      {impl.language.charAt(0).toUpperCase() + impl.language.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="relative group">
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-950 px-2 py-1 rounded border border-gray-800">
                      {solution.implementations[activeImplementationIdx].language}
                    </span>
                  </div>
                  <CodeBlock
                    code={solution.implementations[activeImplementationIdx].codeSnippet}
                    language={solution.implementations[activeImplementationIdx].language}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-4 py-4 border-t border-b border-gray-700">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isLiked
                  ? "text-pink-400 bg-opacity-10"
                  : "text-gray-400 hover:text-pink-400"
                  }`}
                onClick={handleLike}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                <span>{likeCount} likes</span>
              </button>

              <div className="flex items-center space-x-2 px-4 py-2 text-gray-400">
                <MessageCircle size={18} />
                <span>{solution.comments.length} comments</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-gray-200 font-medium">Comments</h3>

              {solution.comments.length > 0 ? (
                <div className="space-y-4">
                  {solution.comments.map((comment) => (
                    <div key={comment._id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <User size={14} />
                          </div>
                          <div>
                            <div className="text-gray-300 text-sm">
                              {comment.user.username || "Anonymous"}
                            </div>
                            <div className="text-xs text-gray-500">
                              Level : {comment.user.stats.level}
                            </div>
                          </div>
                        </div>
                        <button
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-6">
                  No comments yet. Be the first to comment!
                </div>
              )}

              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2"
                  onClick={handleAddComment}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSolutionDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showSolutionDeleteModal}
          isLoading={isLoading}
          onClose={() => setShowSolutionDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
      {showCommentDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showCommentDeleteModal}
          isLoading={isLoading}
          onClose={() => setShowCommentDeleteModal(false)}
          onConfirm={handleDeleteCommentConfirm}
        />
      )}
      {showSolutionEditModal && (
        <SolutionForm
          challenge={challenge}
          initialSolution={solution}
          onSubmit={handleEditSolution}
          onCancel={() => setShowSolutionEditModal(false)}
        />
      )}
    </>
  );
};

export default SolutionDetail;
