"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#242424] text-white font-manrope flex items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-xl border border-[#333333] bg-[#2a2a2a] p-8 text-center shadow-xl">
        <h1 className="font-orbitron text-3xl font-bold uppercase tracking-wide mb-4">Unauthorized</h1>
        <p className="text-gray-300 leading-7 mb-8">
          You do not have permission to access this area.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-lg border border-white/80 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
        >
          Back to Login
        </Link>
      </section>
    </main>
  );
}
