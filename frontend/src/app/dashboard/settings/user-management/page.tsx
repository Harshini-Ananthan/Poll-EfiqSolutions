"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Search, UserPlus, MoreVertical, Edit2 } from "lucide-react";

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await api.get("/superadmin/users");
        setUsers(data);
      } catch (err: any) {
        console.error("Failed to fetch users", err);
        setError(err.message || "Failed to load users. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    (u.department?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-[400px]"><Loader2 className="animate-spin text-orange-500" /></div>;
  if (error) return <div className="text-red-500 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">User management</h1>
        <p className="text-gray-400 text-sm">Add, edit or deactivate employee accounts.</p>
      </div>

      <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#333]/50 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or department..."
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
            />
          </div>
          <button className="px-4 py-2.5 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap">
            <UserPlus size={18} /> Add employee
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#333]/50 bg-[#1e1e1e]/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mobile no</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]/30">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic text-sm">
                    No employees found matching "{search}"
                  </td>
                </tr>
              ) : filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 text-xs font-bold ring-1 ring-blue-500/20">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{u.name}</span>
                        <span className="text-[10px] text-gray-500">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {u.mobileNo || "Not set"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.status === "Active" 
                        ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                        : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#333] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-[#444]">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
