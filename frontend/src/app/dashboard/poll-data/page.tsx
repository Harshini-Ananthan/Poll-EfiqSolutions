"use client";

import React, { useState, useEffect } from "react";
import { Search, Clock, CheckCircle2, Eye, X } from "lucide-react";
import { api } from "@/lib/api";

export default function PollDataPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedPoll, setSelectedPoll] = useState<any>(null);
  const [pollDetails, setPollDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

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

  const filteredPolls = polls.filter(poll => 
    poll.question?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredPolls.length / itemsPerPage);
  const displayedPolls = filteredPolls.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleViewDetails = async (poll: any) => {
    setSelectedPoll(poll);
    setDetailsLoading(true);
    try {
      const data = await api.get(`/polls/${poll.id}`);
      setPollDetails(data);
    } catch (error) {
      console.error("Failed to fetch poll details", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleToggleStatus = async (poll: any) => {
    try {
      await api.patch(`/polls/${poll.id}/status`, { isActive: !poll.isActive });
      setPolls(polls.map(p => p.id === poll.id ? { ...p, isActive: !p.isActive } : p));
    } catch (error) {
      console.error("Failed to toggle status", error);
    }
  };

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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-[#1e1e1e] border border-[#444] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>
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
              ) : displayedPolls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-500 italic">
                    No polls found. Create your first one to see history.
                  </td>
                </tr>
              ) : displayedPolls.map((poll) => (
                <tr key={poll.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-white mb-1">{poll.question}</p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(poll.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleStatus(poll)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                          poll.isActive ? 'bg-green-500' : 'bg-[#333]'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            poll.isActive ? 'translate-x-[18px]' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                        poll.isActive ? "text-green-400" : "text-gray-500"
                      }`}>
                        {poll.isActive ? (
                          <><Clock size={14} className="animate-pulse" /> Live</>
                        ) : (
                          <><CheckCircle2 size={14} /> Closed</>
                        )}
                      </span>
                    </div>
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
                    <button 
                      onClick={() => handleViewDetails(poll)}
                      className="p-2 text-white hover:text-blue-500 transition-colors">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#1e1e1e]/30 flex items-center justify-between">
          <p className="text-sm text-gray-500 italic">
            Showing {filteredPolls.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPolls.length)} of {filteredPolls.length} polls
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-lg text-sm transition-all ${currentPage === 1 ? 'bg-[#1e1e1e] border-[#333] text-gray-400 cursor-not-allowed' : 'bg-blue-600/10 border-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white'}`}
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className={`px-4 py-2 border rounded-lg text-sm transition-all ${currentPage >= totalPages ? 'bg-[#1e1e1e] border-[#333] text-gray-400 cursor-not-allowed' : 'bg-blue-600/10 border-blue-600/20 text-blue-500 hover:bg-blue-600 hover:text-white'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Poll Details Modal */}
      {selectedPoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#222]">
              <h2 className="text-xl font-bold text-white">Poll Voting Data</h2>
              <button 
                onClick={() => { setSelectedPoll(null); setPollDetails(null); }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-1">Question</p>
                <p className="text-lg font-medium text-white">{selectedPoll.question}</p>
              </div>

              {detailsLoading ? (
                <div className="py-12 text-center text-gray-500 animate-pulse">Loading voting data...</div>
              ) : pollDetails ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Options & Results</h3>
                    <div className="space-y-3">
                      {pollDetails.options?.map((opt: any) => {
                        const voteCount = pollDetails.votes?.filter((v: any) => v.optionId === opt.id).length || 0;
                        const totalVotes = pollDetails.votes?.length || 1;
                        const percentage = Math.round((voteCount / totalVotes) * 100) || 0;

                        return (
                          <div key={opt.id} className="bg-[#2a2a2a] p-4 rounded-xl border border-[#333]">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-white">{opt.label}</span>
                              <span className="text-blue-400 font-bold">{voteCount} votes ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-[#1e1e1e] rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {pollDetails.votes?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Votes</h3>
                      <div className="bg-[#2a2a2a] rounded-xl border border-[#333] overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#1e1e1e]">
                            <tr>
                              <th className="px-4 py-3 text-gray-400 font-medium border-b border-[#333]">User ID</th>
                              <th className="px-4 py-3 text-gray-400 font-medium border-b border-[#333]">Option Selected</th>
                              <th className="px-4 py-3 text-gray-400 font-medium border-b border-[#333]">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#333]">
                            {pollDetails.votes.map((vote: any) => {
                              const option = pollDetails.options?.find((o: any) => o.id === vote.optionId);
                              return (
                                <tr key={vote.id}>
                                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">{vote.userId}</td>
                                  <td className="px-4 py-3 text-white font-medium">{option?.label || 'Unknown'}</td>
                                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(vote.createdAt).toLocaleString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">Could not load details.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
