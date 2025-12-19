"use client";

import React, { useState, useEffect } from "react";
import { Lock, Key, Award, Gift, Shield, Zap, CreditCard } from "lucide-react";
import {
  createOrder,
  getTwoActivePlans,
  purchasePlan,
} from "@/services/client/clientServices";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/Toast";

interface IPremiumPlanProps {
  type?: string;
}

const PurchasePremium: React.FC<IPremiumPlanProps> = ({ type }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [activePlans, setActivePlans] = useState<Record<string, any>>({});
  const [discountedPrices, setDiscountedPrices] = useState({});
  const [data, setData] = useState([]);

  const router = useRouter();
  const { showToast } = useToast();
  const themeColors = {
    primary: "#8B5CF6",
    secondary: "#6D28D9",
    accent: "#4C1D95",
    background: "#121827",
    cardBackground: "#1E293B",
    inputBackground: "#0F172A",
    text: "#E2E8F0",
    mutedText: "#94A3B8",
    border: "#334155",
  };

  useEffect(() => {
    const fetchPremiumPlans = async () => {
      try {
        const response = await getTwoActivePlans();
        console.log("MEMBERSHIPP", response);
        setData(response);
      } catch (error) {
        console.error(error);
        showToast({ type: "error", message: "Error fetching plans" });
      }
    };
    fetchPremiumPlans();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const plans: Record<string, any> = {};
      const intervals = new Set<string>();

      data
        .filter((plan) => plan.isActive)
        .forEach((plan) => {
          intervals.add(plan.type);

          const priceValue = parseFloat(plan.price.replace(/[^0-9.]/g, ""));
          const priceInPaise = Math.round(priceValue * 100);

          let savings = "";
          if (plan.discount && plan.discount.active) {
            const discountAmount = plan.discount.amount;
            if (plan.discount.type === "percentage") {
              savings = `Save ${discountAmount}%`;
            } else {
              savings = `Save ₹${discountAmount}`;
            }
          }

          plans[plan.type] = {
            ...plan,
            periodDisplay: plan.type,
            priceInPaise,
            savings: savings,
            period: plan.type,
          };
        });

      if (data.some((plan) => plan.type === "gold")) {
        const quarterlyPlan = data.find(
          (plan) => plan.type === "gold" && plan.isActive
        );
        if (quarterlyPlan) {
          let savings = "";
          if (quarterlyPlan.discount && quarterlyPlan.discount.active) {
            savings =
              quarterlyPlan.discount.type === "percentage"
                ? `Save ${quarterlyPlan.discount.amount}%`
                : `Save ₹${quarterlyPlan.discount.amount}`;
          }
          console.log(savings);
        }
      }

      setActivePlans(plans);

      if (type && plans[type]) {
        setSelectedPlan(type);
      } else {
        setSelectedPlan(Array.from(intervals)[0] || "monthly");
      }
    }
  }, [data, type]);

  useEffect(() => {
    const newDiscountedPrices = {};

    Object.keys(activePlans).forEach((planKey) => {
      const plan = activePlans[planKey];
      if (plan.discount.active) {
        const originalPrice = parseFloat(plan.price.replace(/[^\d.]/g, ""));
        let discountedAmount = 0;

        if (plan.discount.type === "percentage") {
          discountedAmount = originalPrice * (plan.discount.amount / 100);
        } else if (plan.discount.type === "fixed") {
          discountedAmount = plan.discount.amount;
        }

        const finalPrice = Math.max(0, originalPrice - discountedAmount);

        newDiscountedPrices[planKey] = {
          original: plan.price,
          discounted: `₹${finalPrice.toFixed(2)}`,
          savings: discountedAmount,
          savingsText:
            plan.discount.type === "percentage"
              ? `${plan.discount.amount}% OFF`
              : `₹${Number(discountedAmount).toFixed(2)} OFF`,
        };
      }
      console.log(444);
    });

    setDiscountedPrices(newDiscountedPrices);
  }, [activePlans]);

  const getSelectedPlanBenefits = () => {
    if (!selectedPlan || !activePlans[selectedPlan]) {
      return defaultBenefits;
    }

    const currentPlan = activePlans[selectedPlan];
    const features = currentPlan.features || [];

    return features.map((feature: string, index: number) => {
      const icons = [
        <Key
          key="key"
          className="w-5 h-5"
          style={{ color: themeColors.primary }}
        />,
        <Award
          key="award"
          className="w-5 h-5"
          style={{ color: themeColors.primary }}
        />,
        <Gift
          key="gift"
          className="w-5 h-5"
          style={{ color: themeColors.primary }}
        />,
        <Shield
          key="shield"
          className="w-5 h-5"
          style={{ color: themeColors.primary }}
        />,
        <Zap
          key="zap"
          className="w-5 h-5"
          style={{ color: themeColors.primary }}
        />,
      ];

      const parts = feature.split(":");
      const title = parts.length > 1 ? parts[0].trim() : feature;
      const description = parts.length > 1 ? parts[1].trim() : "";

      return {
        icon: icons[index % icons.length],
        title: title,
        description: description || feature,
      };
    });
  };

  const defaultBenefits = [
    {
      icon: <Key className="w-5 h-5" style={{ color: themeColors.primary }} />,
      title: "Exclusive Access",
      description: "Unlock premium content and features",
    },
    {
      icon: (
        <Award className="w-5 h-5" style={{ color: themeColors.primary }} />
      ),
      title: "Premium Badge",
      description: "Showcase your premium status",
    },
    {
      icon: <Gift className="w-5 h-5" style={{ color: themeColors.primary }} />,
      title: "Special Rewards",
      description: "Exclusive rewards and bonuses",
    },
    {
      icon: (
        <Shield className="w-5 h-5" style={{ color: themeColors.primary }} />
      ),
      title: "Priority Support",
      description: "Get faster, dedicated assistance",
    },
    {
      icon: <Zap className="w-5 h-5" style={{ color: themeColors.primary }} />,
      title: "Performance Boost",
      description: "10% extra performance benefits",
    },
  ];

  const availableTypes = Object.keys(activePlans);
  const benefits = getSelectedPlanBenefits();

  if (availableTypes.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: themeColors.background }}
      >
        <p className="text-xl" style={{ color: themeColors.text }}>
          Loading premium plans...
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded) {
      showToast({
        type: "error",
        message: "Failed to load payment gateway. Please try again later.",
      });
      return;
    }
    const planId = activePlans[selectedPlan]._id;
    const amount = activePlans[selectedPlan].discount.amount
      ? activePlans[selectedPlan].price -
      activePlans[selectedPlan].discount.amount
      : activePlans[selectedPlan].price;

    try {
      const orderRespose = await createOrder(amount);

      const options = {
        key: orderRespose.key,
        amount: orderRespose.amount,
        currency: orderRespose.currency,
        name: "Logic Hub",
        description: "Explore You Wisdome",
        order_id: orderRespose.orderId,
        handler: async (data) => {
          try {
            const planData = {
              planId: planId,
              amount: amount,
              razorpayOrderId: data.razorpay_order_id,
              razorpayPaymentId: data.razorpay_payment_id,
              razorpaySignature: data.razorpay_signature,
            };
            const membershipResponse = await purchasePlan(planData);
            showToast({
              type: "success",
              message: "Payment successful. Please Wait for the confirmation.",
            });
            router.push(`/premiumplans/success/${membershipResponse._id}`);
          } catch (error) {
            console.error("Payment verification failed:", error);
            showToast({
              type: "error",
              message: "Payment verification failed. Please contact support."
            });
          }
        },
        modal: {
          ondismiss: () => {
            showToast({
              type: "warning",
              message: "Payment cancelled. You can try again anytime.",
            });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      showToast({ type: "error", message: "Error Purchasing Premium" });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.text,
      }}
    >
      <div
        className="py-12"
        style={{
          background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.accent})`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Lock className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Upgrade to Premium
            </h1>
            <p className="text-lg text-violet-100 max-w-xl mx-auto">
              {selectedPlan && activePlans[selectedPlan]
                ? activePlans[selectedPlan].description
                : "Unlock exclusive features and enhance your experience"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-8">
        <div
          className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden"
          style={{
            backgroundColor: themeColors.cardBackground,
            borderColor: themeColors.border,
          }}
        >
          <div
            className="p-6 border-b"
            style={{
              borderColor: themeColors.border,
              backgroundColor: `${themeColors.primary}15`,
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2
                  className="text-xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  Your Premium Selection
                </h2>
                <div className="flex items-center mt-2">
                  <div
                    className="p-2 rounded-full mr-2"
                    style={{ backgroundColor: `${themeColors.primary}20` }}
                  >
                    <CreditCard
                      className="w-5 h-5"
                      style={{ color: themeColors.primary }}
                    />
                  </div>
                  <div>
                    <p className="font-medium">Payment via Razorpay</p>
                    <p
                      className="text-sm"
                      style={{ color: themeColors.mutedText }}
                    >
                      Secure, fast processing
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div
                  className="inline-block px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: `${themeColors.primary}20`,
                    borderLeft: `4px solid ${themeColors.primary}`,
                  }}
                >
                  <p className="text-sm font-medium">Selected plan</p>
                  {selectedPlan &&
                    activePlans[selectedPlan] &&
                    discountedPrices[selectedPlan] ? (
                    <>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: themeColors.primary }}
                      >
                        {discountedPrices[selectedPlan].discounted}
                      </p>
                      <p className="text-sm">
                        {activePlans[selectedPlan].period}
                      </p>
                      <p
                        className="text-sm line-through"
                        style={{ color: themeColors.mutedText }}
                      >
                        {discountedPrices[selectedPlan].original}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: themeColors.primary }}
                      >
                        {selectedPlan && activePlans[selectedPlan]
                          ? activePlans[selectedPlan].price
                          : "₹0"}
                      </p>
                      <p className="text-sm">
                        {" "}
                        {selectedPlan && activePlans[selectedPlan]
                          ? activePlans[selectedPlan].period
                          : "month"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:flex">
            <div
              className="md:w-1/2 p-8"
              style={{ backgroundColor: themeColors.cardBackground }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: themeColors.primary }}
              >
                Choose Your Plan
              </h2>

              {availableTypes.length > 0 && (
                <div
                  className="p-2 rounded-lg shadow-sm flex mb-8"
                  style={{ backgroundColor: themeColors.inputBackground }}
                >
                  {availableTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedPlan(type)}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${selectedPlan === type
                        ? "text-white"
                        : "hover:bg-gray-800"
                        }`}
                      style={{
                        backgroundColor:
                          selectedPlan === type
                            ? themeColors.primary
                            : "transparent",
                        color:
                          selectedPlan === type ? "white" : themeColors.text,
                      }}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              <div
                className="p-6 rounded-lg shadow-sm mb-8 text-center"
                style={{ backgroundColor: themeColors.inputBackground }}
              >
                {selectedPlan &&
                  activePlans[selectedPlan] &&
                  discountedPrices[selectedPlan] ? (
                  <>
                    <h3
                      className="text-3xl font-bold mb-1"
                      style={{ color: themeColors.primary }}
                    >
                      {discountedPrices[selectedPlan].discounted}
                    </h3>
                    <p
                      style={{ color: themeColors.mutedText }}
                      className="mb-1"
                    >
                      <span className="line-through">
                        {discountedPrices[selectedPlan].original}
                      </span>
                    </p>
                    <span className="inline-block bg-green-900 text-green-100 px-3 py-1 rounded-full text-sm font-medium">
                      {discountedPrices[selectedPlan].savingsText}
                    </span>
                  </>
                ) : (
                  <>
                    <h3
                      className="text-3xl font-bold mb-1"
                      style={{ color: themeColors.primary }}
                    >
                      {selectedPlan && activePlans[selectedPlan]
                        ? activePlans[selectedPlan].price
                        : "₹0"}
                    </h3>
                    <p
                      style={{ color: themeColors.mutedText }}
                      className="mb-2"
                    >
                      {" "}
                      {selectedPlan && activePlans[selectedPlan]
                        ? activePlans[selectedPlan].period
                        : "month"}
                    </p>
                  </>
                )}
              </div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: themeColors.primary }}
              >
                Premium Benefits
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className="p-2 rounded-full mr-3"
                      style={{ backgroundColor: `${themeColors.primary}20` }}
                    >
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{benefit.title}</h3>
                      <p
                        className="text-sm"
                        style={{ color: themeColors.mutedText }}
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="md:w-1/2 p-8 border-t md:border-t-0 md:border-l"
              style={{ borderColor: themeColors.border }}
            >
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: themeColors.primary }}
              >
                Payment Details
              </h2>

              <div
                className="mt-6 p-4 rounded-lg"
                style={{ backgroundColor: `${themeColors.primary}15` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Payment Method</h3>
                </div>
                <p className="text-sm" style={{ color: themeColors.mutedText }}>
                  Secure payment processing via Razorpay. Your transaction is
                  protected with industry-standard encryption.
                </p>
              </div>
              <div className="pt-4">
                <button
                  className="w-full text-white font-medium py-3 px-4 rounded-md transition duration-300 shadow-md flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.accent})`,
                  }}
                  disabled={!selectedPlan || !activePlans[selectedPlan]}
                  onClick={handleSubmit}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay with Razorpay
                </button>
                <div className="flex items-center justify-center mt-4">
                  <Lock
                    className="w-4 h-4 mr-2"
                    style={{ color: themeColors.mutedText }}
                  />
                  <p
                    className="text-center text-xs"
                    style={{ color: themeColors.mutedText }}
                  >
                    Secure payment powered by Razorpay
                  </p>
                </div>
              </div>

              <div
                className="mt-8 pt-6 border-t"
                style={{ borderColor: themeColors.border }}
              >
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span style={{ color: themeColors.mutedText }}>Plan:</span>
                  <span>
                    {selectedPlan && activePlans[selectedPlan]
                      ? activePlans[selectedPlan].name
                      : "No plan selected"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span style={{ color: themeColors.mutedText }}>
                    Duration:
                  </span>
                  <span>
                    {selectedPlan && activePlans[selectedPlan]
                      ? `1 ${activePlans[selectedPlan].period}`
                      : "-"}
                  </span>
                </div>

                {selectedPlan &&
                  activePlans[selectedPlan] &&
                  discountedPrices[selectedPlan] && (
                    <>
                      <div className="flex justify-between mb-2">
                        <span style={{ color: themeColors.mutedText }}>
                          Original Price:
                        </span>
                        <span className="line-through">
                          {discountedPrices[selectedPlan].original}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span style={{ color: themeColors.mutedText }}>
                          Discount:
                        </span>
                        <span className="text-green-400">
                          {discountedPrices[selectedPlan].savingsText}
                        </span>
                      </div>
                    </>
                  )}

                <div
                  className="flex justify-between font-bold mt-2 pt-2 border-t"
                  style={{ borderColor: themeColors.border }}
                >
                  <span>Total:</span>
                  <span style={{ color: themeColors.primary }}>
                    {selectedPlan && activePlans[selectedPlan]
                      ? discountedPrices[selectedPlan]
                        ? discountedPrices[selectedPlan].discounted
                        : activePlans[selectedPlan].price
                      : "₹0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex flex-wrap justify-center items-center gap-6 py-4">
            <div className="flex items-center">
              <Shield
                className="w-5 h-5 mr-2"
                style={{ color: themeColors.mutedText }}
              />
              <span
                className="text-sm"
                style={{ color: themeColors.mutedText }}
              >
                Secure Payment
              </span>
            </div>
            <div className="flex items-center">
              <Zap
                className="w-5 h-5 mr-2"
                style={{ color: themeColors.mutedText }}
              />
              <span
                className="text-sm"
                style={{ color: themeColors.mutedText }}
              >
                Instant Access
              </span>
            </div>
            <div className="flex items-center">
              <Lock
                className="w-5 h-5 mr-2"
                style={{ color: themeColors.mutedText }}
              />
              <span
                className="text-sm"
                style={{ color: themeColors.mutedText }}
              >
                Data Protection
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer
        className="py-6 mt-12"
        style={{ backgroundColor: themeColors.accent }}
      >
        <div className="container mx-auto px-4 text-center text-gray-300 text-sm">
          <p>&copy; 2025 All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default PurchasePremium;
