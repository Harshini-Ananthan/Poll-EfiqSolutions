"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function PollDataPage() {
  const polls = [
    { id: 1, date: "Mar 20", title: "Choose your lunch", options: "Veg · Non-veg · Special thali", votes: 312, status: "active" },
    { id: 2, date: "Mar 19", title: "Choose your lunch", options: "Veg · Non-veg · Special thali", votes: 298, status: "closed" },
    { id: 3, date: "Mar 18", title: "Choose your lunch", options: "Veg · Non-veg · Special thali", votes: 305, status: "closed" },
    { id: 4, date: "Mar 17", title: "Festival special menu", options: "Biryani · Veg biryani · Meals", votes: 320, status: "closed" },
    { id: 5, date: "Mar 14", title: "Choose your lunch", options: "Veg · Non-veg", votes: 290, status: "closed" },
    { id: 6, date: "Mar 13", title: "Choose your lunch", options: "Veg · Non-veg · Special thali", votes: 310, status: "closed" },
  ];

  return (
    <div className="flex h-screen bg-[#242424] text-white font-manrope selection:bg-blue-500/30">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-orbitron font-bold text-white tracking-wide">POLL Data</h1>
        </header>

        {/* Content Container */}
        <div className="max-w-5xl">
          
          {/* Poll History Card */}
          <div className="bg-[#2a2a2a] rounded-xl border border-[#333333]/80 shadow-lg overflow-hidden mb-8">
            <div className="grid grid-cols-[1fr_80px]">
              
              {/* Card Title Row */}
              <div className="p-6 flex justify-between items-center">
                <h2 className="font-bold text-sm">Poll history</h2>
                <Link href="/new-poll" className="border border-[#444] rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-white/5 transition-colors flex items-center justify-center">
                  + New poll
                </Link>
              </div>
              <div className="border-l border-[#333333]/80"></div>

              {/* Data Rows */}
              {polls.map((poll) => (
                <React.Fragment key={poll.id}>
                  
                  {/* Row Main Info */}
                  <div className="border-t border-[#333333]/80 px-6 py-4 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
                    {/* Date Pill */}
                    <span className="bg-[#1e1e1e] rounded-full px-4 py-1.5 text-xs text-gray-400 font-bold whitespace-nowrap min-w-[70px] text-center shadow-inner">
                      {poll.date}
                    </span>
                    
                    {/* Descriptions */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm mb-1 truncate text-white">{poll.title}</div>
                      <div className="text-xs text-gray-400 truncate">{poll.options}</div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center gap-6 whitespace-nowrap shrink-0">
                      <span className="text-xs text-gray-400 font-medium">
                        {poll.votes} votes
                      </span>
                      
                      <div className={`px-3 py-0.5 rounded-full text-[10px] font-bold lowercase min-w-[60px] text-center
                        ${poll.status === 'active' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                          : 'text-gray-400 border border-[#444] bg-[#242424]'
                        }`}
                      >
                        {poll.status}
                      </div>
                    </div>
                  </div>

                  {/* Row Action */}
                  <div className="border-t border-l border-[#333333]/80 flex items-center justify-center p-4 group-hover:bg-white/[0.02] transition-colors">
                    <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </React.Fragment>
              ))}

            </div>
          </div>

          {/* Footer Action */}
          <div className="text-center">
            <button className="text-sm font-bold text-white hover:underline transition-all">
              View all Poll data
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
