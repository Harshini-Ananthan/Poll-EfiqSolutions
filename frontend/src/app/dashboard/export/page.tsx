"use client";

import React, { useState } from "react";
import { Download, Search, CheckCircle2, ChevronDown } from "lucide-react";

export default function ExportPage() {
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  
  const employees = [
    { id: "1", name: "Arun Kumar", branch: "Chennai HQ", dept: "HR", votes: 24 },
    { id: "2", name: "Deepa S", branch: "Chennai HQ", dept: "Tech", votes: 22 },
    { id: "3", name: "Ganesh R", branch: "Bangalore", dept: "Sales", votes: 18 },
    { id: "4", name: "Meera J", branch: "Bangalore", dept: "Marketing", votes: 20 },
  ];

  const toggleSelect = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold uppercase tracking-wide text-white">Export Data</h1>
        <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20">
          <Download size={20} /> Export Excel
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Filters Column */}
        <section className="space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Quick Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Branch</label>
                <div className="relative">
                  <select className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer">
                    <option>All Branches</option>
                    <option>Chennai HQ</option>
                    <option>Bangalore</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

               <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Department</label>
                <div className="relative">
                  <select className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer">
                    <option>All Departments</option>
                    <option>Tech</option>
                    <option>HR</option>
                    <option>Sales</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Date Range</label>
                <input type="date" className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm focus:outline-none text-gray-400" />
              </div>
            </div>
          </div>
        </section>

        {/* Employee Selection Column */}
        <section className="lg:col-span-2 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
             <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Seach Employees" 
                  className="w-full bg-[#242424] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <p className="text-sm font-bold text-blue-500">{selectedEmployees.length} selected</p>
          </div>

          <div className="space-y-3">
             {employees.map((emp) => {
               const isSelected = selectedEmployees.includes(emp.id);
               return (
                 <div 
                   key={emp.id} 
                   onClick={() => toggleSelect(emp.id)}
                   className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                     isSelected 
                       ? "bg-blue-600/5 border-blue-600/50" 
                       : "bg-[#242424] border-[#333] hover:border-[#444]"
                   }`}
                 >
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                       isSelected ? "bg-blue-600 border-blue-600 text-white" : "bg-[#1e1e1e] border-[#444] text-gray-500"
                     }`}>
                       {isSelected ? <CheckCircle2 size={20} /> : emp.name[0]}
                     </div>
                     <div>
                       <p className="font-bold text-sm">{emp.name}</p>
                       <p className="text-xs text-gray-500">{emp.branch} • {emp.dept}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-bold">{emp.votes}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Votes</p>
                   </div>
                 </div>
               );
             })}
          </div>
        </section>

      </div>
    </div>
  );
}
