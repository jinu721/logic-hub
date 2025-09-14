"use client";

import { useRouter } from "next/navigation";

export default function NavigationButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => router.push("/auth/login")}
        className="bg-white cursor-pointer text-slate-900 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-200 transform hover:scale-105"
      >
        Start Practicing
      </button>
      <button
        onClick={() => router.push("/curriculum")}
        className="border cursor-pointer border-slate-700 text-slate-300 px-8 py-3 rounded-lg font-semibold hover:bg-slate-900/50 hover:border-slate-600 transition-all duration-200"
      >
        View Curriculum
      </button>
    </div>
  );
}
