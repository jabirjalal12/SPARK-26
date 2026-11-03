"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectJudge() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/organizer/scoring");
  }, [router]);

  return (
    <div className="p-8 text-center text-slate-400 text-sm">
      Redirecting to Organizer Scoring Arena...
    </div>
  );
}
