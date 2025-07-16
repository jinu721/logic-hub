import { useState, useEffect } from "react";
import { Check, X, AlertTriangle, Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface PurchaseConfirmationModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: any) => void;
  userXP: number;
  isPremiumUser: boolean;
}

const PurchaseConfirmationModal = ({
  item,
  isOpen,
  onClose,
  onConfirm,
  userXP,
  isPremiumUser,
}: PurchaseConfirmationModalProps) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const canAfford = userXP >= item?.costXP;

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTransactionStatus(null);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setTransactionStatus("processing");

    setTimeout(() => {
      if (canAfford) {
        setTimeout(() => {
          setTransactionStatus("success");
          onConfirm(item);
          setTimeout(() => {
            handleClose();
          }, 1500);
        }, 1500);
      } else {
        setTransactionStatus("error");
      }
    }, 1000);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      setTransactionStatus(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4  backdrop-blur-2xl bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
      <div
        className={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md transition-all duration-300 ${
          isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Confirm Purchase</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {transactionStatus === null && (
            <>
              <div className="flex items-center mb-6">
                <div className="mr-4 flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-gray-700">
                  <img
                    src={item?.itemId?.image || "/api/placeholder/100/100"}
                    alt={item?.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">
                    {item?.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {item?.category
                      ? item.category.charAt(0).toUpperCase() +
                        item.category.slice(1)
                      : "Item"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-white">Cost</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">
                  {item?.costXP} XP
                </span>
              </div>

              {!canAfford && (
                <div className="mb-6 p-4 bg-red-900 bg-opacity-20 rounded-lg border border-red-800 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium">Insufficient XP</p>
                    <p className="text-sm text-red-300">
                      You need {(item?.costXP - userXP).toLocaleString()} more
                      XP to purchase this item.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Your balance</span>
                <span className="text-sm font-medium text-white">
                  {userXP.toLocaleString()} XP
                </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-gray-400">
                  Balance after purchase
                </span>
                <span
                  className={`text-sm font-medium ${
                    canAfford ? "text-white" : "text-red-400"
                  }`}
                >
                  {Math.max(0, userXP - (item?.costXP || 0)).toLocaleString()}{" "}
                  XP
                </span>
              </div>
            </>
          )}

          {transactionStatus === "processing" && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-purple-500 animate-spin mb-4"></div>
              <p className="text-gray-300 text-lg font-medium">
                Processing your purchase...
              </p>
              <p className="text-gray-400 text-sm">
                Please wait, this wont take long.
              </p>
            </div>
          )}

          {transactionStatus === "success" && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-lg font-medium mb-2">
                Purchase Successful!
              </p>
              <p className="text-gray-400 text-sm text-center">
                {item?.name} has been added to your inventory.
              </p>
            </div>
          )}

          {transactionStatus === "error" && (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <p className="text-red-400 text-lg font-medium mb-2">
                Purchase Failed
              </p>
              <p className="text-gray-400 text-sm text-center">
                You dont have enough XP to purchase this item.
              </p>
            </div>
          )}
        </div>
        <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
          {transactionStatus === null && (
            <>
              <button
                onClick={handleClose}
                className="px-4 py-2 cursor-pointer rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              {item.isExclusive && !isPremiumUser ? (
                <button
                  onClick={() => router.push("/premiumplans")}
                  className={`px-4 py-2 rounded-lg text-white cursor-pointer flex items-center bg-gradient-to-r from-yellow-600 to-yellow-900 hover:from-yellow-900 hover:to-yellow-600`}
                >
                  Buy Premium
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  className={`px-4 py-2 cursor-pointer rounded-lg text-white flex items-center ${
                    canAfford
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                      : "bg-gray-700 cursor-not-allowed"
                  }`}
                  disabled={!canAfford}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Purchase
                </button>
              )}
            </>
          )}

          {transactionStatus === "error" && (
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
