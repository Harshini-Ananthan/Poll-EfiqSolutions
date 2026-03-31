"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Upload } from "lucide-react";

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.get("/organizations/profile");
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, createdAt, updatedAt, ...updateData } = profile;
      await api.patch("/organizations/profile", updateData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[400px]"><Loader2 className="animate-spin text-orange-500" /></div>;
  if (!profile) return <div className="text-red-500 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">Failed to load profile. Please check if the backend is running at port 8080.</div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Company profile</h1>
        <p className="text-gray-400 text-sm">Your organization details shown on PDF reports and app.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Logo & Name Section */}
        <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Logo & name</h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-500 text-2xl font-bold border border-orange-500/30">
              {profile.name?.substring(0, 2).toUpperCase() || "MV"}
            </div>
            <div className="space-y-1">
              <button 
                type="button"
                className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
              >
                <Upload size={14} /> Upload logo
              </button>
              <p className="text-[10px] text-gray-500">PNG, JPG · Max 2 MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Company name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Short name (shown on app)</label>
              <input 
                type="text" 
                value={profile.shortName || ""}
                onChange={(e) => setProfile({...profile, shortName: e.target.value})}
                placeholder="MealVote"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Contact Details Section */}
        <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Contact details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Admin email</label>
              <input 
                type="email" 
                value={profile.adminEmail || ""}
                onChange={(e) => setProfile({...profile, adminEmail: e.target.value})}
                placeholder="admin@mealvote.in"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone</label>
              <input 
                type="tel" 
                value={profile.phone || ""}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                placeholder="+91 98765 43210"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
          </div>
          <div className="space-y-1.5 pt-4">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Address (shown on PDF footer)</label>
            <textarea 
              rows={3}
              value={profile.address || ""}
              onChange={(e) => setProfile({...profile, address: e.target.value})}
              placeholder="No. 12, Anna Salai, Chennai..."
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
            />
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button"
            className="px-6 py-2.5 bg-transparent hover:bg-[#333] text-gray-300 text-sm font-bold rounded-lg transition-colors border border-[#333]"
          >
            Discard
          </button>
          <button 
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-lg transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
