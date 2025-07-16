"use client";

import { useEffect, useState } from "react";
import PlanModal from "./PlanModal";
import {
  createPlan,
  getAllHistory,
  getPlans,
  updatePlan,
} from "@/services/client/clientServices";
import { AxiosError } from "axios";
import { useToast } from "@/context/Toast";
import Headers from "./Headers";
import MembershipToolbar from "./MembershipToolbar";
import MembershipGrid from "./MembershipGrid";
import MembershipList from "./MembershipList";
import MembershipHistory from "./MembershipHistory";
import { MembershipPlanIF } from "@/types/membership.types";
import { PurchaseIF } from "@/types/purchase.types";
import Spinner from "@/components/shared/CustomLoader";
import Pagination from "@/components/shared/Pagination";

type Props = {
  availableFeatures: string[];
};

const SubscriptionPlans: React.FC<Props> = ({availableFeatures}) => {
  const [activeTab, setActiveTab] = useState<"plans" | "history">("plans");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [planToEdit, setPlanToEdit] = useState<MembershipPlanIF | null>(null);
  const [plans, setPlans] = useState<MembershipPlanIF[]>([]);
  const [history, setHistory] = useState<PurchaseIF[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [viewPlan, setViewPlan] = useState<Partial<MembershipPlanIF>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { showToast } = useToast() as any;

  const fetchPlans = async (
    searchTerm: string,
    page: number,
    limit: number
  ) => {
    try {
      setIsLoading(true);
      const response = await getPlans(searchTerm, page, limit);
      console.log("Membership Plans", response);
      const data = response.data.membershipPlans;
      setTotalItems(response.data.totalItems);
      setPlans(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async (page: number, limit: number) => {
    try {
      setIsLoading(true);
      const response = await getAllHistory(page, limit);
      console.log("Membership History", response);
      const data = response.purchases.purchases;
      setTotalItems(response.purchases.totalItems);
      setHistory(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "plans") {
      fetchPlans(searchTerm, currentPage, limit);
    } else if (activeTab === "history") {
      fetchHistory(currentPage, limit);
    }
  }, [searchTerm, activeTab, currentPage]);

  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusStyles = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/70 text-green-100";
      case "expired":
        return "bg-amber-500/70 text-amber-100";
      case "cancelled":
        return "bg-red-500/70 text-red-100";
      case "refunded":
        return "bg-purple-500/70 text-purple-100";
      default:
        return "bg-gray-500/70 text-gray-100";
    }
  };

  const handleViewPlan = (plan: MembershipPlanIF) => {
    setViewPlan(plan);
    setShowPlanModal(true);
  };

  const handleToggleActive = async (planId: string, planStatus: boolean) => {
    try {
      setIsLoading(true);
      await updatePlan(planId, { isActive: !planStatus });
      setPlans((prevPlans) =>
        prevPlans.map((plan) =>
          plan._id === planId ? { ...plan, isActive: !plan.isActive } : plan
        )
      );
    } catch (error) {
      console.error(`Error updating plan status:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSaved = async (
    newPlan: MembershipPlanIF,
    isEdit: boolean
  ) => {
    try {
      if (isEdit && planToEdit) {
        await updatePlan(planToEdit._id as string, newPlan);
        setPlans(plans.map((p) => (p._id === newPlan._id ? newPlan : p)));
      } else {
        await createPlan(newPlan);
        setPlans([newPlan, ...plans]);
      }
      setShowPlanModal(false);
      setPlanToEdit(null);
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof AxiosError && err.response?.data?.message) {
        showToast({
          type: "error",
          message: err.response.data.message,
          duration: 3000,
        });
      } else {
        showToast({
          type: "error",
          message: `Error ${isEdit ? "Updating" : "Creating"} MembershipPlanIF`,
          duration: 3000,
        });
      }
    }
  };

  const handleCloseModal = () => {
    setShowPlanModal(false);
    setPlanToEdit(null);
  };

  return (
    <>
      <div className="bg-gray-950 text-white min-h-screen">
        <div className="ml-20">
          <Headers
            activeTab={activeTab}
            history={history}
            plans={plans}
            setActiveTab={setActiveTab}
          />

          <div className="p-8">
            <MembershipToolbar
              activeTab={activeTab}
              plans={plans}
              history={history}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setShowPlanModal={setShowPlanModal}
              setPlanToEdit={setPlanToEdit}
            />

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Spinner />
              </div>
            ) : activeTab === "plans" ? (
              plans.length === 0 ? (
                <div className="empty-state h-85 flex flex-col items-center justify-center">
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    No Items Found
                  </p>
                </div>
              ) : viewMode === "grid" ? (
                <MembershipGrid
                  plans={plans}
                  handleViewPlan={handleViewPlan}
                  setPlanToEdit={setPlanToEdit}
                  setShowPlanModal={setShowPlanModal}
                  handleToggleActive={handleToggleActive}
                />
              ) : (
                <MembershipList
                  plans={plans}
                  handleViewPlan={handleViewPlan}
                  setPlanToEdit={setPlanToEdit}
                  setShowPlanModal={setShowPlanModal}
                  handleToggleActive={handleToggleActive}
                />
              )
            ) : history.length === 0 ? (
              <div className="empty-state h-85 flex flex-col items-center justify-center">
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  No History Found
                </p>
              </div>
            ) : (
              <MembershipHistory
                history={history}
                getStatusStyles={getStatusStyles}
                formatDate={formatDate}
              />
            )}

            {!isLoading && (
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalItems={totalItems}
                  itemsPerPage={limit}
                />
              )}
          </div>
        </div>

        {showPlanModal && (
          <PlanModal
            plan={planToEdit || (viewPlan as MembershipPlanIF)}
            onClose={handleCloseModal}
            onSave={handlePlanSaved}
            availableFeatures={availableFeatures}
            isViewOnly={!planToEdit && (viewPlan._id as any)}
          />
        )}
      </div>

      {showPlanModal && (
        <PlanModal
          plan={planToEdit || (viewPlan as MembershipPlanIF)}
          onClose={handleCloseModal}
          onSave={handlePlanSaved}
          availableFeatures={availableFeatures}
          isViewOnly={!planToEdit && !!viewPlan._id}
        />
      )}
    </>
  );
};

export default SubscriptionPlans;
