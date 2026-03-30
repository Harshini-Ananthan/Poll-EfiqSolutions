"use client";

import React from "react";

export default function BillingPage() {
  const usageData = [
    { label: "Polls created", value: "20 / unlimited" },
    { label: "PDFs exported", value: "148" },
    { label: "Push notifications sent", value: "8,320" },
  ];

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">Billing & plan</h1>
        <p className="text-gray-400 text-sm">Your current plan and usage.</p>
      </div>

      <div className="space-y-6">

        {/* CURRENT PLAN CARD */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[15px] font-semibold text-gray-200">Pro plan</h2>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-[#1c4532] text-[#4ade80] border border-[#22c55e]/30">
              Active
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-8">Billed monthly · Renews Apr 1, 2026</p>

          <div className="grid grid-cols-3 divide-x divide-[#333333]">
            <div className="pr-8">
              <p className="text-3xl font-bold font-orbitron text-gray-100 mb-1">400</p>
              <p className="text-xs text-gray-500">Employees</p>
            </div>
            <div className="px-8">
              <p className="text-3xl font-bold font-orbitron text-gray-100 mb-1">Unlimited</p>
              <p className="text-xs text-gray-500">Polls / month</p>
            </div>
            <div className="pl-8">
              <p className="text-3xl font-bold font-orbitron text-gray-100 mb-1">₹4,999</p>
              <p className="text-xs text-gray-500">Per month</p>
            </div>
          </div>
        </div>

        {/* USAGE THIS MONTH */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-5">Usage this month</h2>
          
          <div className="flex flex-col divide-y divide-[#333333]/50">
            {usageData.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="text-sm font-medium text-gray-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4 mt-2">
          <button className="px-5 py-2 rounded-md border border-[#333333] text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors shadow-sm">
            View invoices
          </button>
          <button className="px-5 py-2 rounded-md border border-[#444] bg-[#2a2a2a] hover:bg-[#333] text-gray-200 text-sm font-medium transition-colors shadow-sm">
            Upgrade plan
          </button>
        </div>

      </div>
    </div>
  );
}
