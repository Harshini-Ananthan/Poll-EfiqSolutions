"use client";

import React, { useState } from "react";

export default function SecurityPage() {
  const [switches, setSwitches] = useState({
    twoFactor: false,
    autoLogout: true,
  });

  const toggleSwitch = (key: keyof typeof switches) => {
    setSwitches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">Security</h1>
        <p className="text-gray-400 text-sm">Manage your admin account security.</p>
      </div>

      <div className="space-y-6">
        
        {/* CHANGE PASSWORD */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-6">Change password</h2>
          
          <div className="mb-6 w-full">
            <label className="block text-xs text-gray-400 mb-2 font-medium">Current password</label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-medium">New password</label>
              <input 
                type="password"
                placeholder="Min 8 characters"
                className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-medium">Confirm password</label>
              <input 
                type="password"
                placeholder="Repeat new password"
                className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button className="px-5 py-2 rounded-md border border-[#444] bg-[#2a2a2a] hover:bg-[#333] text-gray-200 text-sm font-medium transition-colors shadow-sm">
              Update password
            </button>
          </div>
        </div>

        {/* SESSION & LOGIN */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-6">Session & login</h2>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-4 border-b border-[#333333]/50">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-200">Two-factor authentication</span>
                <span className="text-xs text-gray-500">OTP on every admin login</span>
              </div>
              <button 
                onClick={() => toggleSwitch('twoFactor')}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex ${switches.twoFactor ? 'bg-[#D46B53] justify-end' : 'bg-gray-600 justify-start items-center'}`}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow-sm shrink-0"></div>
              </button>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-200">Auto logout after 8 hrs</span>
                <span className="text-xs text-gray-500">Session expires if idle</span>
              </div>
              <button 
                onClick={() => toggleSwitch('autoLogout')}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex ${switches.autoLogout ? 'bg-[#D46B53] justify-end' : 'bg-gray-600 justify-start items-center'}`}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow-sm shrink-0"></div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
