"use client";

import React, { useState } from "react";

export default function CompanyProfilePage() {
  const [formData, setFormData] = useState({
    companyName: "MealVote Catering Co.",
    shortName: "MealVote",
    adminEmail: "admin@mealvote.in",
    phone: "+91 98765 43210",
    address: "No. 12, Anna Salai, Chennai - 600 002, Tamil Nadu",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">Company profile</h1>
        <p className="text-gray-400 text-sm">Your organisation details shown on PDF reports and app.</p>
      </div>

      <div className="space-y-6">
        
        {/* LOGO & NAME CARD */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-6">Logo & name</h2>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-xl bg-[#D2654B] flex items-center justify-center text-white font-semibold text-xl shadow-inner shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
              MV
            </div>
            <div className="flex flex-col gap-2">
              <button className="border border-[#444] bg-[#2a2a2a] hover:bg-[#333] text-sm text-gray-200 px-4 py-2 rounded-md transition-colors w-fit font-medium shadow-sm">
                Upload logo
              </button>
              <span className="text-xs text-gray-500 font-medium tracking-wide">PNG, JPG · Max 2 MB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-medium">Company name</label>
              <input 
                type="text" 
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-medium">Short name (shown on app)</label>
              <input 
                type="text" 
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
              />
            </div>
          </div>
        </div>

        {/* CONTACT DETAILS CARD */}
        <div className="bg-[#262626]/50 border border-[#333333] rounded-xl p-6 shadow-sm">
          <h2 className="text-[15px] font-medium text-gray-200 mb-6">Contact details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-medium">Admin email</label>
              <input 
                type="email" 
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2 font-medium">Phone</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2 font-medium">Address (shown on PDF footer)</label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              className="w-full bg-[#242424] border border-[#333333] rounded-md px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555] resize-none"
            />
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
