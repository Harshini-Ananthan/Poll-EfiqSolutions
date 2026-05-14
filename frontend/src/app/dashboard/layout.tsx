"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex bg-[#242424] text-white font-manrope selection:bg-blue-500/30 overflow-hidden h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-10 scrollbar-hide">
        {children}
      </main>
    </div>
  );
}
