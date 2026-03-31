"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2, Bell } from "lucide-react";

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await api.get("/organizations/profile");
        setSettings(data);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/organizations/profile", {
        dailyPollReminder: settings.dailyPollReminder,
        cutoffReminder: settings.cutoffReminder,
        adminCommentAlert: settings.adminCommentAlert,
      });
      alert("Notification settings updated!");
    } catch (err) {
      console.error("Failed to update settings", err);
      alert("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (field: string) => {
    setSettings({ ...settings, [field]: !settings[field] });
  };

  if (loading) return <div className="flex items-center justify-center h-[400px]"><Loader2 className="animate-spin text-orange-500" /></div>;
  if (!settings) return <div className="text-red-500 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">Failed to load settings. Please check if the backend is running at port 8080.</div>;

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
        <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-gray-400 text-sm">Control when and how employees get notified.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl p-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Push notifications</h3>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between py-4 border-b border-[#333]/50">
              <div>
                <p className="text-sm font-medium text-white">Daily poll reminder</p>
                <p className="text-xs text-gray-500">Sent when poll goes live</p>
              </div>
              <Toggle enabled={settings.dailyPollReminder} onClick={() => toggle("dailyPollReminder")} />
            </div>

            <div className="flex items-center justify-between py-4 border-b border-[#333]/50">
              <div>
                <p className="text-sm font-medium text-white">Cutoff reminder</p>
                <p className="text-xs text-gray-500">30 min before cutoff, unvoted only</p>
              </div>
              <Toggle enabled={settings.cutoffReminder} onClick={() => toggle("cutoffReminder")} />
            </div>

            <div className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-white">Admin comment alert</p>
                <p className="text-xs text-gray-500">When admin posts an announcement</p>
              </div>
              <Toggle enabled={settings.adminCommentAlert} onClick={() => toggle("adminCommentAlert")} />
            </div>
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
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-lg transition-all flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
