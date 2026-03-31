"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { Loader2, ShieldCheck, Lock } from "lucide-react";

export default function SecurityPage() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settings, setSettings] = useState({
    twoFactor: false,
    autoLogout: true,
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (formData.newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      await api.patch("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      alert("Password updated successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error("Failed to update password", err);
      alert(err.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ enabled, onClick }: { enabled: boolean; onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? "bg-orange-500" : "bg-[#333]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Security</h1>
        <p className="text-gray-400 text-sm">Manage your admin account security.</p>
      </div>

      <div className="space-y-10">
        {/* Change Password Section */}
        <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl p-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Change password</h3>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Current password</label>
              <input 
                type="password" 
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">New password</label>
                <input 
                  type="password" 
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  placeholder="Min 8 characters"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Confirm password</label>
                <input 
                  type="password" 
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Repeat new password"
                  className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#333] hover:bg-[#444] text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 border border-[#444]"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : "Update password"}
              </button>
            </div>
          </form>
        </section>

        {/* Session & Login Section */}
        <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl p-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Session & login</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-4 border-b border-[#333]/50">
              <div>
                <p className="text-sm font-medium text-white">Two-factor authentication</p>
                <p className="text-xs text-gray-500">OTP on every admin login</p>
              </div>
              <Toggle enabled={settings.twoFactor} onClick={() => setSettings({...settings, twoFactor: !settings.twoFactor})} />
            </div>
            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-white">Auto logout after 8 hrs</p>
                <p className="text-xs text-gray-500">Session expires if idle</p>
              </div>
              <Toggle enabled={settings.autoLogout} onClick={() => setSettings({...settings, autoLogout: !settings.autoLogout})} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
