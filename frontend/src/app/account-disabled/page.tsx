"use client";

import React from "react";
import Link from "next/link";
import { clearSession } from "@/lib/auth";

export default function AccountDisabledPage() {
  React.useEffect(() => {
    clearSession();
  }, []);

  return (
    <main className="min-h-screen bg-[#242424] text-white font-manrope flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-xl border border-[#333333] bg-[#2a2a2a] p-8 text-center shadow-xl">
        <h1 className="font-orbitron text-3xl font-bold uppercase tracking-wide mb-4">Account Disabled</h1>
        <p className="text-gray-300 leading-7 mb-8">
          Your organization access has been temporarily disabled. Please contact EfiqSolutions for further details.
        </p>
        <Link
          href="mailto:support@efiqsolutions.com"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Contact Support
        </Link>
      </section>
    </main>
  );
}
