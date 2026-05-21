"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Search, UserPlus, Edit2, Trash2, X } from "lucide-react";

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    countryCode: "+91",
    department: "",
    role: "employee"
  });

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await api.get("/superadmin/users");
      setUsers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch users", err);
      setError(err.message || "Failed to load users. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "mobileNo" ? value.replace(/\D/g, "").slice(0, 10) : value }));
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      mobileNo: user.mobileNo || "",
      countryCode: user.countryCode || "+91",
      department: user.department || "",
      role: user.role || "employee"
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (user: any) => {
    const confirmed = window.confirm(`Delete ${user.name || "this employee"}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await api.delete(`/superadmin/users/${user.id}`);
      setUsers((current) => current.filter((item) => item.id !== user.id));
    } catch (err: any) {
      alert("Failed to delete employee: " + (err.message || "Unknown error"));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      mobileNo: "",
      countryCode: "+91",
      department: "",
      role: "employee"
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Full name is required.");
      return;
    }
    if (!/^\d{10}$/.test(formData.mobileNo.trim())) {
      alert("Mobile no must be exactly 10 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: formData.name.trim(),
        mobileNo: formData.mobileNo.trim(),
      };
      if (editingUser) {
        await api.patch(`/superadmin/users/${editingUser.id}`, payload);
      } else {
        await api.post("/superadmin/users", payload);
      }
      closeModal();
      fetchUsers();
    } catch (err: any) {
      alert(`Failed to ${editingUser ? "update" : "add"} employee: ` + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const role = String(u.role || "").toUpperCase();
    if (role === "ADMIN" || role === "SUPER_ADMIN") return false;

    return (
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.department?.toLowerCase() || "").includes(search.toLowerCase())
    );
  });

  if (loading && users.length === 0) return <div className="flex items-center justify-center h-[400px]"><Loader2 className="animate-spin text-orange-500" /></div>;
  if (error && users.length === 0) return <div className="text-red-500 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>;

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
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
          >
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
                        {(u.name || "??").substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{u.name}</span>
                        <span className="text-[10px] text-gray-500">{u.email || "No email"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {u.countryCode ? `${u.countryCode} ` : ""}{u.mobileNo || "Not set"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.status === "Active" 
                        ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                        : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                    }`}>
                      {u.status || "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(u)}
                      className="p-2 hover:bg-[#333] text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-[#444]"
                      title="Edit employee"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                      title="Delete employee"
                    >
                      <Trash2 size={16} />
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#333] flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{editingUser ? "Edit Employee" : "Add New Employee"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name *</label>
                <input 
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address (Optional)</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mobile No *</label>
                <div className="flex gap-2">
                  <input 
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleInputChange}
                    className="w-20 bg-[#242424] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 text-center"
                    placeholder="+91"
                  />
                  <input 
                    name="mobileNo"
                    required
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Mobile no must be exactly 10 digits"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    className="flex-1 bg-[#242424] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department</label>
                <input 
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                  placeholder="IT, HR, Marketing..."
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingUser ? <Edit2 size={18} /> : <UserPlus size={18} />)}
                  {isSubmitting ? (editingUser ? "Updating..." : "Adding...") : (editingUser ? "Update Employee" : "Add Employee")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
