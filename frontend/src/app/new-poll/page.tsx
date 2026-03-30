"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Calendar, Clock, GripVertical, X } from "lucide-react";

export default function NewPollPage() {
  const [options, setOptions] = useState([
    { id: 1, text: "Veg meals", color: "bg-green-500" },
    { id: 2, text: "Non-veg meals", color: "bg-orange-500" },
    { id: 3, text: "Special thali", color: "bg-blue-500" },
  ]);

  return (
    <div className="flex h-screen bg-[#242424] text-white font-manrope selection:bg-blue-500/30">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-orbitron font-bold text-white">New Poll</h1>
        </header>

        {/* Form Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            
            {/* Poll Details Card */}
            <div className="bg-[#2a2a2a] rounded-xl p-6 shadow-lg border border-[#333333]/50">
              <h2 className="font-bold text-sm mb-5">Poll details</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Poll date</label>
                  <div className="flex items-center justify-between bg-[#242424] border border-[#333333] rounded-md px-3 py-2">
                    <input 
                      type="text" 
                      defaultValue="21-03-2026" 
                      className="bg-transparent text-sm w-full focus:outline-none"
                    />
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Cutoff time</label>
                  <div className="flex items-center justify-between bg-[#242424] border border-[#333333] rounded-md px-3 py-2">
                    <input 
                      type="text" 
                      defaultValue="10:30" 
                      className="bg-transparent text-sm w-full focus:outline-none"
                    />
                    <Clock size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Poll title</label>
                <div className="flex items-center bg-[#242424] border border-[#333333] rounded-md px-3 py-2">
                  <input 
                    type="text" 
                    defaultValue="Choose your lunch for tomorrow" 
                    className="bg-transparent text-sm w-full focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Food Options Card */}
            <div className="bg-[#2a2a2a] rounded-xl p-6 shadow-lg border border-[#333333]/50">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm">Food options</h2>
                <span className="text-xs text-gray-400">{options.length} options</span>
              </div>

              <div className="space-y-3 mb-5">
                {options.map((option) => (
                  <div key={option.id} className="bg-[#242424] border border-[#333333] rounded-md flex items-center p-2.5">
                    <div className="cursor-grab hover:bg-white/5 p-1 rounded">
                      <GripVertical size={14} className="text-gray-500" />
                    </div>
                    <div className="px-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                    </div>
                    <input 
                      type="text" 
                      value={option.text} 
                      readOnly
                      className="bg-transparent flex-1 focus:outline-none text-sm font-medium"
                    />
                    <button className="border border-[#444] rounded-full w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/50 transition-colors ml-2">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button className="border border-[#444] rounded-md px-4 py-2 text-sm font-medium hover:bg-white/5 transition-colors">
                + Add food option
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* Preview Card */}
            <div className="bg-[#2a2a2a] rounded-xl p-6 shadow-lg border border-[#333333]/50">
              <h2 className="font-bold text-sm mb-5">Preview</h2>
              
              <div className="bg-[#242424] rounded-xl p-6 border border-[#333333] max-w-sm mx-auto shadow-inner">
                <p className="text-[#f97316] text-[10px] font-bold tracking-wider uppercase mb-1.5">
                  Sat, 21 Mar
                </p>
                <h3 className="font-bold text-lg mb-5 leading-tight">
                  Choose your lunch for tomorrow
                </h3>
                
                <div className="space-y-2 mb-4">
                  {options.map((option) => (
                    <div key={`preview-${option.id}`} className="border border-[#333] bg-[#2a2a2a] rounded-md p-3 flex items-center gap-3 cursor-pointer hover:border-[#555] transition-colors">
                      <div className="w-4 h-4 rounded-full border border-[#555] flex items-center justify-center bg-[#1e1e1e]">
                        <div className={`w-2 h-2 rounded-full ${option.color}`}></div>
                      </div>
                      <span className="text-sm font-medium">{option.text}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-[#f97316] hover:bg-[#ea580c] transition-colors text-white rounded-md py-2.5 text-sm font-bold shadow-lg shadow-orange-500/20">
                  Confirm vote
                </button>
                
                <p className="text-center text-[10px] text-gray-500 mt-3 font-medium">
                  Cutoff: 10:30
                </p>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-[#2a2a2a] rounded-xl p-6 shadow-lg border border-[#333333]/50">
              <h2 className="font-bold text-sm mb-5">Settings</h2>
              
              <div className="space-y-5">
                
                {/* Setting Row 1 */}
                <div className="flex items-center justify-between pb-5 border-b border-[#333] last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-sm mb-1">Send push notification</h4>
                    <p className="text-[11px] text-gray-400">Alert all 400 employees when poll goes live</p>
                  </div>
                  <div>
                    {/* Active Toggle Switch */}
                    <div className="w-10 h-[22px] bg-[#f97316] rounded-full relative cursor-pointer flex items-center shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm transition-all"></div>
                    </div>
                  </div>
                </div>

                {/* Setting Row 2 */}
                <div className="flex items-center justify-between pb-5 border-b border-[#333] last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-sm mb-1">Allow vote edit</h4>
                    <p className="text-[11px] text-gray-400">Employees can change vote before cutoff</p>
                  </div>
                  <div>
                    {/* Active Toggle Switch */}
                    <div className="w-10 h-[22px] bg-[#f97316] rounded-full relative cursor-pointer flex items-center shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm transition-all"></div>
                    </div>
                  </div>
                </div>

                {/* Setting Row 3 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm mb-1">Send Reminder Before 30 mins</h4>
                    <p className="text-[11px] text-gray-400">Send the remainder notification last 30 mins</p>
                  </div>
                  <div>
                    {/* Active Toggle Switch */}
                    <div className="w-10 h-[22px] bg-[#f97316] rounded-full relative cursor-pointer flex items-center shadow-inner">
                      <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm transition-all"></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
