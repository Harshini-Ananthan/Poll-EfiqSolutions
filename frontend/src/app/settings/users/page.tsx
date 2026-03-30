"use client";

import React, { useState } from "react";

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const employees = [
    { id: 1, initials: "AK", name: "Arun Kumar", mobile: "", status: "Active", color: "bg-blue-600" },
    { id: 2, initials: "PS", name: "Priya Sharma", mobile: "", status: "Active", color: "bg-orange-500" },
    { id: 3, initials: "KR", name: "Karthik R", mobile: "", status: "Active", color: "bg-green-600" },
    { id: 4, initials: "MD", name: "Meena Devi", mobile: "", status: "Inactive", color: "bg-[#333333]" },
    { id: 5, initials: "SA", name: "Super Admin", mobile: "", status: "Active", color: "bg-emerald-600" },
    { id: 6, initials: "VM", name: "Vijay M", mobile: "", status: "Active", color: "bg-teal-600" },
    { id: 7, initials: "AB", name: "Anitha B", mobile: "", status: "Active", color: "bg-red-500" },
    { id: 8, initials: "SP", name: "Suresh P", mobile: "", status: "Inactive", color: "bg-[#333333]" },
    { id: 9, initials: "DS", name: "Deepa S", mobile: "", status: "Active", color: "bg-cyan-600" },
    { id: 10, initials: "RK", name: "Ramesh K", mobile: "", status: "Active", color: "bg-yellow-600" },
  ];

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">User management</h1>
        <p className="text-gray-400 text-sm">Add, edit or deactivate employee accounts.</p>
      </div>

      <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-medium text-gray-200">All employees ({employees.length})</h2>
          <button className="flex items-center gap-1.5 border border-[#444] rounded-md px-3 py-1.5 text-xs font-semibold text-gray-200 bg-[#2a2a2a] hover:bg-[#333] transition-colors shadow-sm">
            <span>+</span> Add employee
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6 w-full max-w-sm">
          <input 
            type="text"
            placeholder="Search name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
          />
        </div>

        {/* TABLE WRAPPER */}
        <div className="w-full text-left text-sm">
          {/* HEADER ROW */}
          <div className="grid grid-cols-[2fr_1fr_1.5fr] text-xs font-semibold text-gray-400 border-b border-[#333] pb-3 mb-2 px-2">
            <div>Name</div>
            <div>Mobile no</div>
            <div className="text-right pr-4">Status</div>
          </div>

          {/* LIST */}
          <div className="flex flex-col">
            {employees.map((emp) => (
              <div key={emp.id} className="grid grid-cols-[2fr_1fr_1.5fr] py-3 items-center border-b border-[#333333]/50 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-md">
                
                {/* NAME C0L */}
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white uppercase shadow-sm ${emp.color}`}>
                    {emp.initials}
                  </div>
                  <span className="font-medium text-gray-200">{emp.name}</span>
                </div>

                {/* MOBILE COL */}
                <div className="text-gray-500 text-sm">
                  {emp.mobile}
                </div>

                {/* STATUS & ACTIONS COL */}
                <div className="flex items-center justify-end gap-6 text-right pr-2">
                  <div 
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm border ${
                      emp.status === "Active" 
                        ? "bg-[#1c4532] text-[#4ade80] border-[#22c55e]/30" 
                        : "bg-[#2a2a2a] text-gray-400 border-[#444]"
                    }`}
                  >
                    {emp.status}
                  </div>
                  <button className="border border-[#444] bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded-md px-4 py-1.5 text-xs text-gray-300 font-medium">
                    Edit
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
