"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { refreshCurrentUser } from "@/lib/auth";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function verifyAccess() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const user = await refreshCurrentUser();
        if (user.role !== "SUPER_ADMIN") router.push("/unauthorized");
      } catch (error: any) {
        if (error.message === "ACCOUNT_DISABLED") router.push("/account-disabled");
        else router.push("/login");
      }
    }

    verifyAccess();
  }, [router]);

  return (
    <div className="flex bg-[#242424] text-white font-manrope selection:bg-blue-500/30 overflow-hidden h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-10 scrollbar-hide">{children}</main>
    </div>
  );
}
