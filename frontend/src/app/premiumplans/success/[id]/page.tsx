import { Metadata } from "next";
import { getPlanHistory } from "@/services/client/clientServices";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  return {
    title: `CodeMaze | Purchase Premium - ${params.type}`,
    description: "Purchase A Premium Plan",
  };
}

type Params = {
    params:{
        id:string
    }
}

const getData = async (id:string) => {
  try {
    const membershipPlans = await getPlanHistory(id);
    return membershipPlans;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export default async function PremiumPurchase({ params:{id} }: Params ) {
  const planHistory = await getData(id);
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="w-full bg-purple-600 py-6 px-4 text-center">
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="text-gray-200">Thank you for your purchase</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-2">Payment Completed!</h2>
            <p className="text-gray-400 text-center">Your premium subscription has been activated</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Transaction ID</span>
              <span className="text-white">{planHistory?.purchase?._id}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Date</span>
              <span className="text-white">{String(new Date().toDateString())}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Amount</span>
              <span className="text-purple-400 font-semibold">{planHistory?.purchase?.amount} per {planHistory?.purchase?.planId?.interval}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Payment Method</span>
              <span className="text-white">Razorpay</span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Link
            href={'/home'} 
              className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md w-full font-medium transition duration-200"
            >
              Go Home
            </Link>
            {/* <button 
              className="bg-transparent border border-purple-600 text-purple-400 py-3 px-4 rounded-md w-full font-medium hover:bg-purple-900 hover:bg-opacity-30 transition duration-200"
            >
              Download Receipt
            </button> */}
          </div>
        </div>
      </div>

      <div className="py-4 px-6 text-center text-gray-500 text-sm">
        <p>Need help? Contact our support team</p>
      </div>
    </div>
  )
}