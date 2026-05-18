"use client";

import { useState, useEffect } from "react";
import { Search, Clock, CheckCircle2, Eye, X, Download, Copy, Share2, Check, MessageCircle } from "lucide-react";
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

  // Share State
  const [sharePoll, setSharePoll] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const getDeepLink = (pollId: string) => `pollapp://poll/${pollId}`;

  const handleCopyLink = (pollId: string) => {
    navigator.clipboard.writeText(getDeepLink(pollId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = (poll: any) => {
    const link = getDeepLink(poll.id);
    const message = `🗳️ *${poll.question}*\n\nPlease vote on today's poll. Open the EfiqOne app to cast your vote:\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

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

  const handleExportCSV = () => {
    if (!pollDetails) return;

    const companyName = pollDetails.companyName || "Unknown Poll";
    const question = pollDetails.question || "";
    const groupName = pollDetails.votes?.find((v: any) => v.user?.department)?.user?.department || 
                      pollDetails.customers?.find((c: any) => c.department)?.department || 
                      "General";

    let csvContent = `Poll,"${companyName.replace(/"/g, '""')}"\n`;
    csvContent += `Question,"${question.replace(/"/g, '""')}"\n`;
    csvContent += `Group,${groupName}\n`;
    csvContent += `\n`;

    // 1. Options count
    csvContent += `Options Summary,Votes Count\n`;
    
    const allOptions = [...(pollDetails.options || [])];
    if (pollDetails.votes?.some((v: any) => v.optionId === 'other')) {
      if (!allOptions.find(o => o.id === 'other')) {
        allOptions.push({ id: 'other', label: 'Others', text: 'Others' });
      }
    }

    allOptions.forEach((opt: any) => {
      const optVotes = pollDetails.votes?.filter((v: any) => v.optionId === opt.id) || [];
      csvContent += `"${(opt.label || opt.text).replace(/"/g, '""')}",${optVotes.length}\n`;
    });
    csvContent += `\n`;

    // Helper for CSV user formatted fields
    const getFormattedName = (user: any) => {
      if (!user) return "Unknown";
      return (user.name || 'Unknown').toUpperCase();
    };

    // Detailed Voting Lists
    csvContent += `S.No,Voter Name,Phone Number,Department,Branch,Role,Time,Comment\n\n`;

    // 2. Responded lists for options
    allOptions.forEach((opt: any) => {
      const optVotes = pollDetails.votes?.filter((v: any) => v.optionId === opt.id) || [];
      csvContent += `Responded for ${(opt.label || opt.text).replace(/"/g, '""')} (${optVotes.length})\n`;
      
      if (optVotes.length > 0) {
        optVotes.forEach((v: any, index: number) => {
          const u = v.user || { userId: v.userId, name: v.userName };
          const phoneStr = u.mobileNo ? `${u.countryCode || "+91"} ${u.mobileNo}` : "-";
          csvContent += `${index + 1},`;
          csvContent += `"${getFormattedName(u).replace(/"/g, '""')}",`;
          csvContent += `"${phoneStr}",`;
          csvContent += `"${(u.department || '').replace(/"/g, '""')}",`;
          csvContent += `"${(u.branch || '').replace(/"/g, '""')}",`;
          csvContent += `"${(u.role || '').replace(/"/g, '""')}",`;
          csvContent += `"${new Date(v.createdAt).toLocaleString()}",`;
          csvContent += `"${(v.comment || '').replace(/"/g, '""')}"\n`;
        });
      } else {
        csvContent += `-,(None),-,-\n`;
      }
      csvContent += `\n`;
    });

    // 3. Not Responded list
    const votedUserIds = new Set(pollDetails.votes?.map((v: any) => v.userId) || []);
    const nonVotedCustomers = (pollDetails.customers || []).filter((c: any) => !votedUserIds.has(c.userId) && !votedUserIds.has(c.id));

    csvContent += `Not responded (${nonVotedCustomers.length})\n`;
    
    if (nonVotedCustomers.length > 0) {
      nonVotedCustomers.forEach((c: any, index: number) => {
        const phoneStr = c.mobileNo ? `${c.countryCode || "+91"} ${c.mobileNo}` : "-";
        csvContent += `${index + 1},`;
        csvContent += `"${getFormattedName(c).replace(/"/g, '""')}",`;
        csvContent += `"${phoneStr}",`;
        csvContent += `"${(c.department || '').replace(/"/g, '""')}",`;
        csvContent += `"${(c.branch || '').replace(/"/g, '""')}",`;
        csvContent += `"${(c.role || '').replace(/"/g, '""')}",,\n`; // Empty columns for Time and Comment
      });
    } else {
      csvContent += `-,(None),-,-\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `poll_analytics_${question.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyInfo = () => {
    if (!pollDetails) return;

    const companyName = pollDetails.companyName || "Unknown Poll";
    const question = pollDetails.question || "";
    const groupName = pollDetails.votes?.find((v: any) => v.user?.department)?.user?.department || 
                      pollDetails.customers?.find((c: any) => c.department)?.department || 
                      "General";

    const formatUserLine = (user: any) => {
      if (!user) return "Unknown";
      const name = (user.name || 'Unknown').toUpperCase();
      if (user.mobileNo) {
        const cc = user.countryCode || "+91";
        return `${name} (${cc} ${user.mobileNo})`;
      }
      return name;
    };

    let text = `Poll: ${companyName}\n`;
    text += `Question: ${question}\n`;
    text += `Group: ${groupName}\n`;
    text += `-----------------------------------\n`;

    // 1. Hyphen count votes for the options
    const allOptions = [...(pollDetails.options || [])];
    if (pollDetails.votes?.some((v: any) => v.optionId === 'other')) {
      if (!allOptions.find(o => o.id === 'other')) {
        allOptions.push({ id: 'other', label: 'Others', text: 'Others' });
      }
    }

    allOptions.forEach((opt: any) => {
      const optVotes = pollDetails.votes?.filter((v: any) => v.optionId === opt.id) || [];
      text += `${opt.label || opt.text} - ${optVotes.length}\n`;
    });
    text += `-----------------------------------\n\n`;

    // 2. Responded lists for options
    allOptions.forEach((opt: any) => {
      const optVotes = pollDetails.votes?.filter((v: any) => v.optionId === opt.id) || [];
      text += `Responded for ${opt.label || opt.text} (${optVotes.length})\n`;
      if (optVotes.length > 0) {
        optVotes.forEach((v: any, index: number) => {
          const commentStr = (opt.id === 'other' && v.comment) ? ` - ${v.comment}` : '';
          text += `${index + 1}. ${formatUserLine(v.user || { userId: v.userId, name: v.userName })}${commentStr}\n`;
        });
      } else {
        text += `(None)\n`;
      }
      text += `\n`;
    });

    // 3. Not Responded list
    const votedUserIds = new Set(pollDetails.votes?.map((v: any) => v.userId) || []);
    const nonVotedCustomers = (pollDetails.customers || []).filter((c: any) => !votedUserIds.has(c.userId) && !votedUserIds.has(c.id));

    text += `Not responded (${nonVotedCustomers.length})\n`;
    if (nonVotedCustomers.length > 0) {
      nonVotedCustomers.forEach((c: any, index: number) => {
        text += `${index + 1}. ${formatUserLine(c)}\n`;
      });
    } else {
      text += `(None)\n`;
    }

    navigator.clipboard.writeText(text);
    alert("Poll analytics copied to clipboard successfully!");
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
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setSharePoll(poll); setCopied(false); }}
                        className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                        title="Share poll link"
                      >
                        <Share2 size={18} />
                      </button>
                      <button
                        onClick={() => handleViewDetails(poll)}
                        className="p-2 text-white hover:text-blue-500 transition-colors"
                      >
                        <Eye size={20} />
                      </button>
                    </div>
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

      {/* ── Share Poll Modal ── */}
      {sharePoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#222]">
              <div>
                <h2 className="text-lg font-bold text-white">Share Poll</h2>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{sharePoll.question}</p>
              </div>
              <button onClick={() => setSharePoll(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Deep link display */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">App Deep Link</p>
                <div className="flex items-center gap-2 bg-[#111] border border-[#333] rounded-xl px-4 py-3">
                  <code className="flex-1 text-sm text-green-400 font-mono truncate">
                    {getDeepLink(sharePoll.id)}
                  </code>
                  <button
                    onClick={() => handleCopyLink(sharePoll.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] rounded-lg text-xs font-bold text-white transition-colors"
                  >
                    {copied ? <><Check size={13} className="text-green-400" /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Users need the <span className="text-white font-semibold">EfiqOne app installed</span> on their phone. Tapping this link opens the app and takes them directly to this poll.
              </p>

              {/* WhatsApp share */}
              <button
                onClick={() => handleWhatsAppShare(sharePoll)}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#25D366] hover:bg-[#1fb855] text-white font-bold text-sm rounded-xl transition-colors shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle size={18} />
                Share via WhatsApp
              </button>

              <button
                onClick={() => setSharePoll(null)}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                      {(() => {
                        const allOptions = [...(pollDetails.options || [])];
                        if (pollDetails.votes?.some((v: any) => v.optionId === 'other')) {
                          if (!allOptions.find(o => o.id === 'other')) {
                            allOptions.push({ id: 'other', label: 'Others', text: 'Others' });
                          }
                        }
                        return allOptions.map((opt: any) => {
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
                        });
                      })()}
                    </div>
                  </div>

                  {pollDetails.votes?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Recent Votes</h3>
                      <div className="bg-[#2a2a2a] rounded-xl border border-[#333]">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-[#1e1e1e]">
                            <tr>
                              <th className="px-4 py-3 text-gray-400 font-medium border-b border-[#333]">Username</th>
                              <th className="px-4 py-3 text-gray-400 font-medium border-b border-[#333]">Option Selected</th>
                              <th className="px-4 py-3 text-gray-400 font-medium border-b border-[#333]">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#333]">
                            {pollDetails.votes.map((vote: any) => {
                              const option = pollDetails.options?.find((o: any) => o.id === vote.optionId);
                              return (
                                <tr key={vote.id} className="hover:bg-white/[0.01] transition-colors">
                                  <td className="px-4 py-3 text-gray-300 text-xs font-medium relative group cursor-pointer">
                                    <span className="hover:text-blue-400 transition-colors underline decoration-dotted underline-offset-4">
                                      {vote.userName || vote.userId}
                                    </span>
                                    {vote.user && (
                                      <div className="absolute left-10 bottom-full mb-2 hidden group-hover:flex flex-col z-50 w-80 bg-[#1e1e1e]/98 border border-[#3c3c3c] rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all duration-200 pointer-events-none">
                                        <div className="flex items-center gap-3 border-b border-[#333] pb-3 mb-3">
                                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-inner">
                                            {vote.user.name.substring(0, 2)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{vote.user.name}</p>
                                            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">{vote.user.role || 'User'}</p>
                                          </div>
                                          <div className="flex items-center">
                                            <span className={`w-2.5 h-2.5 rounded-full ${vote.user.isEnabled ? 'bg-green-500' : 'bg-red-500'} shadow-md`} />
                                            <span className="text-[10px] text-gray-400 font-bold ml-1.5 uppercase tracking-wide">
                                              {vote.user.isEnabled ? 'Active' : 'Disabled'}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2 text-[11px]">
                                          <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-gray-500 font-bold uppercase tracking-wider">User ID</span>
                                            <span className="text-gray-300 font-mono select-all truncate">{vote.user.userId}</span>
                                          </div>
                                          <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-gray-500 font-bold uppercase tracking-wider">Email</span>
                                            <span className="text-gray-300 truncate">{vote.user.email || '-'}</span>
                                          </div>
                                          <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-gray-500 font-bold uppercase tracking-wider">Phone</span>
                                            <span className="text-gray-300">
                                              {vote.user.mobileNo ? `${vote.user.countryCode || '+91'} ${vote.user.mobileNo}` : '-'}
                                            </span>
                                          </div>
                                          <div className="grid grid-cols-[80px_1fr] gap-2">
                                            <span className="text-gray-500 font-bold uppercase tracking-wider">Dept</span>
                                            <span className="text-gray-300 truncate">{vote.user.department || '-'}</span>
                                          </div>
                                          {vote.user.branch && (
                                            <div className="grid grid-cols-[80px_1fr] gap-2">
                                              <span className="text-gray-500 font-bold uppercase tracking-wider">Branch</span>
                                              <span className="text-gray-300 truncate">{vote.user.branch}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-white font-medium">{vote.optionText || option?.label || 'Unknown'}</td>
                                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(vote.createdAt).toLocaleString()}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Actions Panel */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#333] mt-6">
                    <button 
                      onClick={handleExportCSV}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                    >
                      <Download size={18} /> Export Analytics (CSV)
                    </button>
                    <button 
                      onClick={handleCopyInfo}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 hover:bg-white/5 text-white font-bold text-sm transition-all active:scale-[0.98]"
                    >
                      <Copy size={18} /> Copy Info (Text Format)
                    </button>
                  </div>
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
