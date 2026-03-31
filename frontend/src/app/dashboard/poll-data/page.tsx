"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function PollDataPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPolls() {
      try {
        const data = await api.get("/polls");
        setPolls(data);
      } catch (err) {
        console.error("Failed to fetch polls", err);
      } finally {
        setLoading(false);
      }
    }
    getPolls();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Poll Data History</h1>
      </header>

      <div className="bg-[#2a2a2a] rounded-xl border border-[#333]/50 shadow-lg overflow-hidden">
        {/* Filters & Search */}
        <div className="p-6 border-b border-[#333] flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search polls..." 
              className="w-full bg-[#1e1e1e] border border-[#444] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#1e1e1e] border border-[#444] rounded-xl text-sm font-bold hover:bg-white/5 transition-all text-gray-300">
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e1e1e]/50 text-gray-400 text-xs uppercase tracking-widest font-bold">
                <th className="px-8 py-5 border-b border-[#333]">Poll Detail</th>
                <th className="px-8 py-5 border-b border-[#333]">Status</th>
                <th className="px-8 py-5 border-b border-[#333]">Date & Time</th>
                <th className="px-8 py-5 border-b border-[#333]">Total Votes</th>
                <th className="px-8 py-5 border-b border-[#333] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 animate-pulse font-bold tracking-widest">
                    Fetching Poll History...
                  </td>
                </tr>
              ) : polls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 italic">
                    No polls found. Create your first one to see history.
                  </td>
                </tr>
              ) : polls.map((poll) => (
                <tr key={poll.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-white mb-1">{poll.question}</p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(poll.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    {poll.isActive ? (
                      <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold uppercase tracking-wider">
                        <Clock size={14} className="animate-pulse" /> Live
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 size={14} /> Closed
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-gray-300">
                      {new Date(poll.scheduledAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(poll.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xl font-bold text-white">{poll._count?.votes || 0}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Participation</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 bg-blue-600/10 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <ArrowUpRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#1e1e1e]/30 flex items-center justify-between">
          <p className="text-sm text-gray-500 italic">Showing 1 to 4 of 24 polls</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-sm text-gray-400 cursor-not-allowed">Source</button>
            <button className="px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-lg text-sm text-blue-500 hover:bg-blue-600 hover:text-white transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
