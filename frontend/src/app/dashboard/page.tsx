"use client";

import React from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#242424] text-white font-manrope selection:bg-blue-500/30">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-orbitron font-bold uppercase tracking-wide text-white">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-between px-4 py-1.5 border border-white text-sm font-medium rounded-full bg-transparent hover:bg-white/5 transition-all w-40">
              20 March 2026
              <ChevronDown size={14} className="ml-2 opacity-70" />
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 border border-white text-sm font-medium rounded-full bg-transparent hover:bg-white/5 transition-all">
              Create poll
              <Plus size={14} />
            </button>
            <button className="flex items-center px-4 py-1.5 border border-white text-sm font-medium rounded-full bg-transparent hover:bg-white/5 transition-all">
              Export Excel
            </button>
          </div>
        </header>

        {/* Top Metrics */}
        <div className="grid grid-cols-4 gap-8 mb-10 border-b border-[#333333] pb-8">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Total Customers</p>
            <p className="text-4xl font-bold font-orbitron mb-1">400</p>
            <p className="text-gray-400 text-xs text-nowrap">Active this month</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Voted today</p>
            <p className="text-4xl font-bold font-orbitron mb-1">312</p>
            <p className="text-green-500/90 text-xs">78% participation</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Not voted today</p>
            <p className="text-4xl font-bold font-orbitron mb-1">88</p>
            <p className="text-red-500/90 text-xs">22% pending</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Month meals served</p>
            <p className="text-4xl font-bold font-orbitron mb-1">5,840</p>
            <p className="text-gray-400 text-xs">20 working days</p>
          </div>
        </div>

        {/* Live Poll Panel */}
        <section className="bg-[#2a2a2a] rounded-xl p-6 mb-10 shadow-lg border border-[#333333]/50 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-lg font-bold font-orbitron">
              <span>Today's poll — Mar 20</span>
              <span className="text-orange-500 text-sm font-manrope font-semibold mt-1">Morning 9.30</span>
            </div>
            <div className="px-3 py-0.5 rounded-full border border-green-400/50 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest">
              Live
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-[#242424] rounded-lg p-6 flex flex-col items-center justify-center border border-[#333333]/50">
              <span className="text-4xl font-orbitron font-bold text-green-500 mb-2">172</span>
              <span className="text-gray-400 text-sm font-medium">Veg meals</span>
            </div>
            <div className="bg-[#242424] rounded-lg p-6 flex flex-col items-center justify-center border border-[#333333]/50">
              <span className="text-4xl font-orbitron font-bold text-orange-500 mb-2">112</span>
              <span className="text-gray-400 text-sm font-medium">Non-veg</span>
            </div>
            <div className="bg-[#242424] rounded-lg p-6 flex flex-col items-center justify-center border border-[#333333]/50">
              <span className="text-4xl font-orbitron font-bold text-blue-500 mb-2">28</span>
              <span className="text-gray-400 text-sm font-medium">Special thali</span>
            </div>
          </div>

          <div className="flex items-center gap-6 border-b border-[#333333]">
            <button className="text-orange-500 pb-2 border-b-2 border-orange-500 font-semibold text-sm">
              Dashboard
            </button>
            <button className="text-gray-400 pb-2 font-semibold text-sm flex items-center gap-1.5 hover:text-gray-300">
              Comments 
              <span className="bg-orange-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white pb-px">4</span>
            </button>
          </div>
        </section>

        {/* Customer Votes Table */}
        <section>
          <h2 className="text-xl font-orbitron font-bold mb-6">Customer Today Votes</h2>
          
          <div className="bg-[#2a2a2a] rounded-xl p-6 shadow-lg border border-[#333333]/50 min-h-[400px] flex flex-col">
            
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <input 
                type="text" 
                placeholder="Search Customer" 
                className="bg-[#242424] border border-[#444] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none w-64 placeholder-gray-500"
              />
              <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5">Veg</button>
              <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5">Non Veg</button>
              <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5">Non Voted</button>
              <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5">Commented</button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-4 py-4 border-b border-[#333] text-sm font-bold">
              <div>#</div>
              <div>Name</div>
              <div>Status</div>
              <div>Option</div>
              <div>Location</div>
              <div>Voted time</div>
              <div>Comment</div>
            </div>

            {/* Empty State / Rows would go here */}
            <div className="flex-1 flex items-center justify-center opacity-0">
               {/* Spacer since image has empty rows */}
            </div>

            {/* Footer View All */}
            <div className="mt-auto pt-6 border-t border-[#333] text-center">
              <button className="text-sm font-bold text-white hover:underline">
                View all Poll data
              </button>
            </div>
            
          </div>
        </section>

      </main>
    </div>
  );
}
