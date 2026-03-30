"use client";

import React, { useState } from "react";

export default function AppearancePage() {
  const [selectedColor, setSelectedColor] = useState("#D46B53");
  
  const colors = [
    { value: "#D46B53", label: "Orange" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#22c55e", label: "Green" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ec4899", label: "Pink" },
    { value: "#14b8a6", label: "Teal" },
    { value: "#eab308", label: "Yellow" },
    { value: "#1f2937", label: "Dark Gray" },
  ];

  const [theme, setTheme] = useState({
    darkMode: true,
    compactMode: false,
  });

  const toggleThemeSwitch = (key: keyof typeof theme) => {
    setTheme(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">Appearance</h1>
        <p className="text-gray-400 text-sm">Customise how the app looks for your team.</p>
      </div>

      <div className="space-y-6">
        
        {/* BRAND COLOUR CARD */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-1">Brand colour</h2>
          <p className="text-xs text-gray-500 mb-6">Used across app headers, buttons and PDF reports.</p>
          
          <div className="flex flex-wrap gap-4">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-all ${
                  selectedColor === c.value
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#242424] scale-110"
                    : "hover:scale-110"
                }`}
                title={c.label}
              >
              </button>
            ))}
          </div>
        </div>

        {/* APP THEME CARD */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-6">App theme</h2>
          
          <div className="flex flex-col">
            
            {/* ROW 1 */}
            <div className="flex items-center justify-between py-4 border-b border-[#333333]/50">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-200">Dark mode (admin web)</span>
                <span className="text-xs text-gray-500">Switch dashboard to dark theme</span>
              </div>
              <button 
                onClick={() => toggleThemeSwitch('darkMode')}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex ${theme.darkMode ? 'bg-[#555] justify-end' : 'bg-gray-600 justify-start'}`}
              >
                {/* Image shows normal white thumb for switches when on */}
                <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* ROW 2 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-200">Compact mode</span>
                <span className="text-xs text-gray-500">Tighter spacing in tables and lists</span>
              </div>
              <button 
                onClick={() => toggleThemeSwitch('compactMode')}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex ${theme.compactMode ? 'bg-[#555] justify-end' : 'bg-transparent border border-[#555] justify-start items-center'}`}
              > {/* Switch looks off in image for compact mode but wait - Image shows white switch. Yes, let me adjust the toggle switch design to perfectly match the screenshot. Currently it uses an orange ON state for notifications, but in appearance it looks greyish/greenish. Actually, let's just make it standard dark theme toggle `bg-[#D46B53]` or `bg-[#555]`? Let's stick with `#D46B53` or grey. In image 2, the dark mode switch is greyish, wait, let's use standard. I'll use standard active color but the image shows neutral active color. */}
                <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end items-center gap-4 mt-8">
          <button className="px-5 py-2 rounded-md border border-[#333333] text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors shadow-sm">
            Discard
          </button>
          <button className="px-5 py-2 rounded-md border border-[#444] bg-[#2a2a2a] hover:bg-[#333] text-gray-200 text-sm font-medium transition-colors shadow-sm">
            Save changes
          </button>
        </div>

      </div>
    </div>
  );
}
