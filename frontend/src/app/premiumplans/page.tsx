
export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getMyProfile } from "@/services/server/serverServices";
import PurchasePremium from "./components/PurchasePremium";

export const metadata: Metadata = {
  title: "LogicHub | Purchase Premium",
  description: "Purchase A Premium Plan",
}

const getData = async () => {
  try {
    const currentUser = await getMyProfile();
    return {
      currentUser: currentUser.user,
    };
  } catch (err) {
    console.log(err);
    return { membershipPlans: [], currentUser: undefined };
  }
};

export default async function PremiumPurchase({
  params,
}: {
  params: { type: string };
}) {
  const { currentUser } = await getData();
  if (currentUser?.membership?.isActive) {
    redirect("/home");
  }
  return <PurchasePremium type={params.type} />;
}
