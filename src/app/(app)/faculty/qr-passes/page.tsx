"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToTicket() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/faculty/ticket");
  }, [router]);

  return (
    <div className="p-8 text-center text-slate-400 text-sm">
      Redirecting to Official School Ticket...
    </div>
  );
}
