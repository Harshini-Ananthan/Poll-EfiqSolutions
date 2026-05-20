"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Download, Search, CheckCircle2, ChevronDown, Loader2, Users } from "lucide-react";
import { api } from "@/lib/api";

interface Employee {
  id: string;
  name: string;
  department?: string;
  branch?: string;
  role?: string;
  votes: number;
}

export default function ExportPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      
      const data = await api.get(`/superadmin/users?${queryParams.toString()}`);
      setEmployees(
        Array.isArray(data)
          ? data.filter((employee: Employee) => !["ADMIN", "SUPER_ADMIN"].includes((employee.role || "").toUpperCase()))
          : []
      );
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [startDate, endDate]);

  const resetFilters = () => {
    setSelectedBranch("All Branches");
    setSelectedDept("All Departments");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const departments = useMemo(() => {
    const depts = new Set<string>();
    employees.forEach(emp => {
      if (emp.department) depts.add(emp.department);
    });
    return ["All Departments", ...Array.from(depts)];
  }, [employees]);

  const branches = useMemo(() => {
    const brs = new Set<string>();
    employees.forEach(emp => {
      if (emp.branch) brs.add(emp.branch);
    });
    return ["All Branches", ...Array.from(brs)];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = selectedBranch === "All Branches" || emp.branch === selectedBranch;
      const matchesDept = selectedDept === "All Departments" || emp.department === selectedDept;
      return matchesSearch && matchesBranch && matchesDept;
    });
  }, [employees, searchQuery, selectedBranch, selectedDept]);

  const toggleSelect = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    const dataToExport = employees.filter(e => selectedEmployees.includes(e.id));
    if (dataToExport.length === 0) {
      alert("Please select at least one employee to export.");
      return;
    }

    const headers = ["Name", "Branch", "Department", "Total Votes"];
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(e => [
        `"${e.name}"`,
        `"${e.branch || "General"}"`,
        `"${e.department || "N/A"}"`,
        e.votes || 0
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `employee_poll_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-wide text-white mb-2">Export Data</h1>
          <p className="text-gray-400">Download employee participation and vote statistics</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={selectedEmployees.length === 0}
          className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all shadow-lg ${
            selectedEmployees.length > 0 
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20" 
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Download size={20} /> Export Excel (CSV)
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Filters Column */}
        <section className="space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ChevronDown size={16} className="text-blue-500" /> Quick Filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Branch</label>
                <div className="relative">
                  <select 
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                  >
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

               <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Department</label>
                <div className="relative">
                  <select 
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">From</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 text-gray-300" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">To</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 text-gray-300" 
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#333]">
              <button 
                onClick={resetFilters}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </section>

        {/* Employee Selection Column */}
        <section className="lg:col-span-2 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
             <div className="relative flex-1 w-full sm:max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search Employees..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#242424] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleSelectAll}
                  className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                >
                  {selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0 ? "Deselect All" : "Select All"}
                </button>
                <p className="text-sm font-bold text-blue-500 px-3 py-1 bg-blue-500/10 rounded-full">
                  {selectedEmployees.length} selected
                </p>
              </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
             {loading ? (
               <div className="flex flex-col items-center justify-center py-20 gap-4">
                 <Loader2 className="animate-spin text-blue-600" size={40} />
                 <p className="text-gray-500 font-medium">Fetching employees...</p>
               </div>
             ) : filteredEmployees.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-20 bg-[#242424]/50 rounded-xl border border-dashed border-[#333]">
                 <Users className="text-gray-600 mb-4" size={48} />
                 <p className="text-gray-500 font-medium text-center px-6">
                   No employees found matching your current filters.
                 </p>
               </div>
             ) : (
               filteredEmployees.map((emp) => {
                 const isSelected = selectedEmployees.includes(emp.id);
                 return (
                   <div 
                     key={emp.id} 
                     onClick={() => toggleSelect(emp.id)}
                     className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                       isSelected 
                         ? "bg-blue-600/10 border-blue-600/50 shadow-inner" 
                         : "bg-[#242424] border-[#333] hover:border-gray-600"
                     }`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                         isSelected 
                          ? "bg-blue-600 border-blue-600 text-white scale-105" 
                          : "bg-[#1e1e1e] border-[#444] text-gray-500 hover:border-blue-500/50"
                       }`}>
                         {isSelected ? <CheckCircle2 size={24} /> : (emp.name ? emp.name[0].toUpperCase() : "?")}
                       </div>
                       <div>
                         <p className="font-bold text-white text-base">{emp.name}</p>
                         <p className="text-xs text-gray-500">
                           <span className="text-blue-400/80">{emp.branch || "General"}</span> • {emp.department || "No Department"}
                         </p>
                       </div>
                     </div>
                     <div className="text-right flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-bold ${emp.votes > 0 ? "text-blue-400" : "text-gray-600"}`}>
                            {emp.votes || 0}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Total Votes</p>
                     </div>
                   </div>
                 );
               })
             )}
          </div>
        </section>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e1e1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}
