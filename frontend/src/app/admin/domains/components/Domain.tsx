"use client";

import React, { JSX, useEffect, useState } from "react";
import { Code, Database, Bug, Lock } from "lucide-react";
import ChallengeModal from "./ChallengeModal";
import {
  createChallenge,
  deleteChallenge,
  getAllChallenges,
  updateChallenge,
} from "@/services/client/clientServices";
import socket from "@/utils/socket.helper";
import DeleteConfirmationModal from "@/components/shared/Delete";
import { useToast } from "@/context/Toast";
import Headers from "./Headers";
import ChallengeToolbar from "./ChallengeToolbar";
import ChallengeGrid from "./ChallengeGrid";
import ChallengeList from "./ChallengeList";
import { ChallengeDomainIF } from "@/types/domain.types";
import Pagination from "@/components/shared/Pagination";
import Spinner from "@/components/shared/CustomLoader";

const ChallengeManagement: React.FC = () => {
  const [activeTab] = useState<string>("challenges");
  const [showChallengeModal, setShowChallengeModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [challengeToEdit, setChallengeToEdit] =
    useState<ChallengeDomainIF | null>(null);
  const [challenges, setChallenges] = useState<ChallengeDomainIF[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const { showToast } = useToast() as any;

  const difficultyColors: Record<string, string> = {
    novice: "bg-green-500/70 text-green-100",
    adept: "bg-yellow-500/70 text-yellow-50",
    master: "bg-red-500/70 text-red-50",
  };

  const typeIcons: Record<string, JSX.Element> = {
    code: <Code size={18} />,
    cipher: <Lock size={18} />,
    debug: <Bug size={18} />,
    database: <Database size={18} />,
  };

  const fetchDomains = async (
    searchTerm: string,
    page: number,
    limit: number
  ) => {
    try {
      setIsLoading(true);
      const response = await getAllChallenges(searchTerm, page, limit);
      const data = response.challenges;
      setTotalItems(response.totalItems);
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains(searchTerm, currentPage, limit);
  }, [searchTerm, currentPage]);

  const handleEditChallenge = (challenge: ChallengeDomainIF) => {
    setChallengeToEdit(challenge);
    setShowChallengeModal(true);
  };

  const handleDeleteChallenge = async (challengeId: string) => {
    setSelectedDomainId(challengeId);
    setDeleteModalOpen(true);
  };

  const handleConformModal = async () => {
    try {
      setIsLoading(true);
      if (selectedDomainId) {
        await deleteChallenge(selectedDomainId);
        setChallenges(
          challenges.filter((challenge) => challenge._id !== selectedDomainId)
        );
      }
      setIsLoading(false);
      setDeleteModalOpen(false);
    } catch {
      setIsLoading(false);
    }
  };

  const handleChallengeSaved = async (
    newChallenge: ChallengeDomainIF,
    challengeId?: string
  ) => {
    try {
      if (challengeId) {
        await updateChallenge(challengeId, newChallenge);
        setChallenges(
          challenges.map((challenge) =>
            challenge._id === challengeId ? newChallenge : challenge
          )
        );
      } else {
        const result = await createChallenge(newChallenge);
        setChallenges([newChallenge, ...challenges]);
        console.log("Result:- ", result);
        socket.emit("admin_add_domain", result);
      }
    } catch {
      showToast({ type: "error", message: "Failed to save challenge" });
    }
    setShowChallengeModal(false);
    setChallengeToEdit(null);
  };

  const handleCloseModal = () => {
    setShowChallengeModal(false);
    setChallengeToEdit(null);
  };

  return (
    <>
      <div className="bg-gray-950 text-white min-h-screen">
        <div className="ml-20">
          <Headers activeTab={activeTab} challenges={challenges} />

          <div className="p-8">
            <ChallengeToolbar
              activeTab={activeTab}
              challenges={challenges}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setChallengeToEdit={setChallengeToEdit}
              setShowChallengeModal={setShowChallengeModal}
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : challenges.length === 0 ? (
              <div className="empty-state h-85 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  No Domains Found
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <ChallengeGrid
                challenges={challenges}
                handleEditChallenge={handleEditChallenge}
                handleDeleteChallenge={handleDeleteChallenge}
                typeIcons={typeIcons}
                difficultyColors={difficultyColors}
              />
            ) : (
              <ChallengeList
                challenges={challenges}
                typeIcons={typeIcons}
                difficultyColors={difficultyColors}
                handleEditChallenge={handleEditChallenge}
                handleDeleteChallenge={handleDeleteChallenge}
              />
            )}
            {!isLoading && challenges.length > 0 && (
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalItems}
                itemsPerPage={limit}
              />
            )}
          </div>
        </div>

        {showChallengeModal && (
          <ChallengeModal
            challenge={challengeToEdit}
            onSave={handleChallengeSaved}
            onClose={handleCloseModal}
          />
        )}
      </div>
      {deleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConformModal}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ChallengeManagement;
