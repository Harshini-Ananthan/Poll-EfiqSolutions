"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Download, CheckCircle2 } from "lucide-react";

export default function ExportDataPage() {
  const [departments] = useState(["All", "Engineering", "HR", "Finance", "Sales"]);
  const [activeDept, setActiveDept] = useState("All");

  const employees = [
    { id: 1, initials: "AK", name: "Arun Kumar", dept: "Engineering", color: "bg-purple-600", days: "20/20 days", status: "Done" },
    { id: 2, initials: "PS", name: "Priya Sharma", dept: "HR", color: "bg-orange-500", days: "18/20 days", status: "Done" },
    { id: 3, initials: "KR", name: "Karthik R", dept: "Finance", color: "bg-green-600", days: "20/20 days", status: "Done" },
    { id: 4, initials: "MD", name: "Meena Devi", dept: "Engineering", color: "bg-indigo-500", days: "17/20 days", status: "Done" },
    { id: 5, initials: "VM", name: "Vijay M", dept: "Finance", color: "bg-emerald-600", days: "20/20 days", status: "Done" },
    { id: 6, initials: "AB", name: "Anitha B", dept: "HR", color: "bg-orange-600", days: "19/20 days", status: "Done" },
    { id: 7, initials: "SP", name: "Suresh P", dept: "Sales", color: "bg-blue-600", days: "14/20 days", status: "Done" },
    { id: 8, initials: "DS", name: "Deepa S", dept: "Sales", color: "bg-cyan-600", days: "16/20 days", status: "Done" },
    { id: 9, initials: "RK", name: "Ramesh K", dept: "Engineering", color: "bg-yellow-600", days: "18/20 days", status: "Done" },
    { id: 10, initials: "LV", name: "Lakshmi V", dept: "HR", color: "bg-teal-600", days: "20/20 days", status: "Done" },
  ];

  return (
    <div className="flex h-screen bg-[#242424] text-white font-manrope selection:bg-blue-500/30">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-orbitron font-bold text-white tracking-wide uppercase">Export Data</h1>
        </header>

        {/* Form Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-5xl">
          
          {/* LEFT COLUMN: Export Settings */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#333333]/80 shadow-lg">
              <h2 className="font-bold text-sm mb-6">Export settings</h2>
              
              <div className="mb-6">
                <label className="block text-xs text-gray-400 mb-2 font-medium">Month</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-[#242424] border border-[#444] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#555] text-white cursor-pointer">
                    <option>March 2026</option>
                    <option>February 2026</option>
                    <option>January 2026</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-3 font-medium">Filter by department</label>
                <div className="flex flex-wrap gap-2.5">
                  {departments.map((dept) => (
                    <button 
                      key={dept}
                      onClick={() => setActiveDept(dept)}
                      className={`px-3.5 py-1 rounded-full text-xs font-medium transition-colors border
                        ${activeDept === dept 
                          ? 'bg-[#f97316] text-white border-[#f97316] shadow-sm shadow-orange-500/20' 
                          : 'bg-transparent text-gray-300 border-[#444] hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Checklist */}
          <div className="flex-1 min-w-0">
            <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#333333]/80 shadow-lg h-full flex flex-col">
              
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm">Select employees</h2>
                <span className="text-xs text-gray-500 font-medium tracking-wide">0 selected</span>
              </div>

              {/* Master Checkbox */}
              <div className="flex items-center justify-between border-b border-[#333] pb-4 mb-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-4 h-4 rounded-sm border-2 border-white bg-white group-hover:border-gray-200 transition-colors flex items-center justify-center">
                    {/* Intermediate state placeholder since it's "0 selected" in pure UI, checkbox is empty technically, but the image shows a white box, which likely means some state or just styles. Let's make it a checkbox overlay. */}
                  </div>
                  <span className="text-sm font-semibold text-white">Select all employees</span>
                </label>
                <span className="text-xs text-gray-400">10 employees</span>
              </div>

              {/* Scrollable Employee List */}
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[420px] custom-scrollbar mb-6">
                {employees.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-sm border-2 border-[#555] bg-transparent flex-shrink-0 cursor-pointer group-hover:border-[#777] transition-colors"></div>
                      
                      <div className={`w-8 h-8 rounded-full ${emp.color} flex items-center justify-center text-xs font-bold text-white shadow-inner flex-shrink-0`}>
                        {emp.initials}
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold text-sm leading-tight text-white mb-0.5">{emp.name}</div>
                        <div className="text-[11px] text-gray-400">{emp.dept}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 ml-4 shrink-0">
                      <span className="text-xs text-gray-300 w-16 text-right whitespace-nowrap">{emp.days}</span>
                      <span className="bg-[#c6f6d5] text-[#1c4532] border border-[#9ae6b4] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide w-12 text-center shadow-sm">
                        {emp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pt-2">
                
                {/* Success Banner */}
                <div className="bg-[#dcfce7] rounded-lg p-4 flex items-center gap-4 mb-4 border border-[#bbf7d0] shadow-sm">
                  <div className="bg-[#22c55e] rounded-full p-1 text-white shadow-sm shrink-0">
                    <CheckCircle2 size={16} strokeWidth={3} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#166534] mb-0.5">ZIP downloaded successfully!</div>
                    <div className="text-xs text-[#15803d]">MealVote_March2026.zip · 10 PDFs · ~1.2 MB</div>
                  </div>
                </div>

                {/* Download Button */}
                <button className="w-full flex items-center justify-center gap-2 border border-[#444] bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded-md py-3 text-sm font-semibold shadow-sm text-gray-200">
                  <Download size={16} />
                  Download ZIP
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Global CSS for scrollbar */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #2a2a2a;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}} />

      </main>
    </div>
  );
}
