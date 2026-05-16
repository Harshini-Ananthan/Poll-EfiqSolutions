"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      try {
        const data = await api.get("/superadmin/dashboard-stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-gray-500 font-orbitron animate-pulse uppercase tracking-widest text-xs">Fetching Dashboard Stats...</div>;
  if (!stats) return <div className="text-red-500 p-6 bg-red-500/10 border border-red-500/20 rounded-xl m-10">Failed to load dashboard data. Please check if the mock API is functional.</div>;

  const participationRate = stats.totalCustomers > 0 
    ? Math.round((stats.votedToday / stats.totalCustomers) * 100) 
    : 0;

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-orbitron font-bold uppercase tracking-wide text-white leading-none">Dashboard</h1>
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
          <p className="text-4xl font-bold font-orbitron mb-1">{stats.totalCustomers?.toLocaleString()}</p>
          <p className="text-gray-400 text-xs text-nowrap">Active this month</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Voted today</p>
          <p className="text-4xl font-bold font-orbitron mb-1">{stats.votedToday}</p>
          <p className="text-green-500/90 text-xs">{participationRate}% participation</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Not voted today</p>
          <p className="text-4xl font-bold font-orbitron mb-1">{stats.notVotedToday}</p>
          <p className="text-red-500/90 text-xs">pending</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">Month meals served</p>
          <p className="text-4xl font-bold font-orbitron mb-1">{stats.monthMealsServed?.toLocaleString()}</p>
          <p className="text-gray-400 text-xs">Total votes recorded</p>
        </div>
      </div>

      {/* Live Poll Panel */}
      {stats.latestPoll ? (
        <section className="bg-[#2a2a2a] rounded-xl p-6 mb-10 shadow-lg border border-[#333333]/50 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-lg font-bold font-orbitron">
              <span>{stats.latestPoll.question}</span>
              <span className="text-orange-500 text-sm font-manrope font-semibold mt-1">
                {new Date(stats.latestPoll.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="px-3 py-0.5 rounded-full border border-green-400/50 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest">
              Live
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            {stats.latestPoll.options.map((opt: any, i: number) => (
              <div key={i} className="bg-[#242424] rounded-lg p-6 flex flex-col items-center justify-center border border-[#333333]/50">
                <span className={`text-4xl font-orbitron font-bold mb-2 ${
                  opt.type === 'Veg' ? 'text-green-500' : 
                  opt.type === 'Non-veg' ? 'text-orange-500' : 'text-blue-500'
                }`}>{opt.count}</span>
                <span className="text-gray-400 text-sm font-medium">{opt.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 border-b border-[#333333]">
            <button className="text-orange-500 pb-2 border-b-2 border-orange-500 font-semibold text-sm hover:text-orange-400 transition-colors">
              Dashboard
            </button>
            <button className="text-gray-400 pb-2 font-semibold text-sm flex items-center gap-1.5 hover:text-gray-300 transition-colors">
              Comments 
              <span className="bg-orange-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white pb-px">0</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="bg-[#2a2a2a] rounded-xl p-10 mb-10 text-center border border-dashed border-[#444] text-gray-500 italic">
          No live polls available at the moment.
        </section>
      )}

      {/* Customer Today Votes */}
      <section>
        <h2 className="text-xl font-orbitron font-bold mb-6">Customer Today Votes</h2>
        
        <div className="bg-[#2a2a2a] rounded-xl p-6 shadow-lg border border-[#333333]/50 min-h-[400px] flex flex-col">
          
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Search Customer" 
              className="bg-[#242424] border border-[#444] rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none w-64 placeholder-gray-500 focus:border-orange-500/50 transition-colors"
            />
            <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">Veg</button>
            <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">Non Veg</button>
            <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">Non Voted</button>
            <button className="border border-white/80 px-6 py-2 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">Commented</button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-4 py-4 border-b border-[#333] text-sm font-bold uppercase tracking-widest text-[#555]">
            <div>#</div>
            <div>Name</div>
            <div>Status</div>
            <div>Option</div>
            <div>Location</div>
            <div>Voted time</div>
            <div>Comment</div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
            {stats.todayVotes && stats.todayVotes.length > 0 ? (
              stats.todayVotes.map((vote: any, index: number) => (
                <div key={vote.id} className="grid grid-cols-[50px_1.5fr_1fr_1fr_1fr_1fr_1.5fr] gap-4 py-4 border-b border-[#333]/30 text-sm items-center hover:bg-white/5 transition-colors">
                  <div className="text-gray-500 font-mono">{index + 1}</div>
                  <div className="font-bold text-white">{vote.name}</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
                      {vote.status}
                    </span>
                  </div>
                  <div className="text-gray-300 font-medium">{vote.option}</div>
                  <div className="text-gray-400">{vote.location}</div>
                  <div className="text-gray-400 font-mono">{vote.votedTime}</div>
                  <div className="text-gray-500 text-xs italic truncate">{vote.comment}</div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-gray-500 italic text-sm py-20">
                 No votes recorded yet for today's session
              </div>
            )}
          </div>

          {/* View All */}
          <div className="mt-auto pt-6 border-t border-[#333] text-center">
            <button className="text-sm font-bold text-white hover:underline transition-all">
              View all Poll data
            </button>
          </div>
          
        </div>
      </section>
      {/* Custom Scrollbar Styling */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a2a2a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
}

