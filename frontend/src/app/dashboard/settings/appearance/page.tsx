"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

const BRAND_COLORS = [
  "#F97316", "#3B82F6", "#22C55E", "#8B5CF6",
  "#EC4899", "#10B981", "#F59E0B", "#111111",
];

export default function AppearancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandColor, setBrandColor] = useState("#F97316");
  const [darkMode, setDarkMode] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [original, setOriginal] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await api.get("/organizations/profile");
        const color = data.brandColor || "#F97316";
        const dark = data.darkMode || false;
        const compact = data.compactMode || false;
        setBrandColor(color);
        setDarkMode(dark);
        setCompactMode(compact);
        setOriginal({ brandColor: color, darkMode: dark, compactMode: compact });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleDiscard = () => {
    if (original) {
      setBrandColor(original.brandColor);
      setDarkMode(original.darkMode);
      setCompactMode(original.compactMode);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch("/organizations/profile", { brandColor, darkMode, compactMode });
      setOriginal({ brandColor, darkMode, compactMode });
      alert("Appearance updated successfully!");
    } catch (err) {
      console.error("Failed to save appearance", err);
      alert("Failed to save appearance settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[400px]"><Loader2 className="animate-spin text-orange-500" /></div>;

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Appearance</h1>
        <p className="text-gray-400 text-sm">Customise how the app looks for your team.</p>
      </div>

      {/* Brand colour */}
      <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-white mb-1">Brand colour</h3>
        <p className="text-xs text-gray-500 mb-5">Used across app headers, buttons and PDF reports.</p>
        <div className="flex gap-3 flex-wrap">
          {BRAND_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setBrandColor(color)}
              style={{ backgroundColor: color }}
              className={`w-9 h-9 rounded-full transition-all ${
                brandColor === color
                  ? "ring-2 ring-offset-2 ring-offset-[#242424] ring-white scale-110"
                  : "hover:scale-105"
              }`}
            />
          ))}
        </div>
      </section>

      {/* App theme */}
      <section className="bg-[#242424]/50 border border-[#333]/50 rounded-xl overflow-hidden mb-10">
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-sm font-semibold text-white">App theme</h3>
        </div>
        <div className="divide-y divide-[#333]/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm text-white">Dark mode (admin web)</p>
              <p className="text-xs text-gray-500">Switch dashboard to dark theme</p>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${darkMode ? "bg-orange-500" : "bg-[#444]"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${darkMode ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm text-white">Compact mode</p>
              <p className="text-xs text-gray-500">Tighter spacing in tables and lists</p>
            </div>
            <button
              type="button"
              onClick={() => setCompactMode((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${compactMode ? "bg-orange-500" : "bg-[#444]"}`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${compactMode ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={handleDiscard}
          className="px-6 py-2.5 bg-transparent hover:bg-[#333] text-gray-300 text-sm font-bold rounded-lg transition-colors border border-[#333]"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-white text-black hover:bg-gray-200 text-sm font-bold rounded-lg transition-all flex items-center gap-2 disabled:opacity-60"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : "Save changes"}
        </button>
      </div>
    </div>
  );
}
