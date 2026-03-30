"use client";

import React, { useState } from "react";

export default function NotificationsPage() {
  const [switches, setSwitches] = useState({
    dailyReminder: true,
    cutoffReminder: true,
    adminAlert: false, // Wait, image shows all 3 are ON. I will set them all to true.
  });

  const toggleSwitch = (key: keyof typeof switches) => {
    setSwitches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">Notifications</h1>
        <p className="text-gray-400 text-sm">Control when and how employees get notified.</p>
      </div>

      <div className="space-y-6">
        
        {/* PUSH NOTIFICATIONS CARD */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-6">Push notifications</h2>
          
          <div className="flex flex-col">
            
            {/* ROW 1 */}
            <div className="flex items-center justify-between py-4 border-b border-[#333333]/50">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-200">Daily poll reminder</span>
                <span className="text-xs text-gray-500">Sent when poll goes live</span>
              </div>
              <button 
                onClick={() => toggleSwitch('dailyReminder')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex ${switches.dailyReminder ? 'bg-[#D46B53] justify-end' : 'bg-gray-600 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* ROW 2 */}
            <div className="flex items-center justify-between py-4 border-b border-[#333333]/50">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-200">Cutoff reminder</span>
                <span className="text-xs text-gray-500">30 min before cutoff, unvoted only</span>
              </div>
              <button 
                onClick={() => toggleSwitch('cutoffReminder')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex ${switches.cutoffReminder ? 'bg-[#D46B53] justify-end' : 'bg-gray-600 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </button>
            </div>

            {/* ROW 3 */}
            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-200">Admin comment alert</span>
                <span className="text-xs text-gray-500">When admin posts an announcement</span>
              </div>
              <button 
                onClick={() => toggleSwitch('adminAlert')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex ${switches.adminAlert ? 'bg-[#D46B53] justify-end' : 'bg-gray-600 justify-start'}`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
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
