"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Download, Search, CheckCircle2, ChevronDown, Loader2, Users, FileText, Sheet } from "lucide-react";
import { api } from "@/lib/api";

const CONTACT_EMAIL = "efiqtools@gmail.com";
const FOOTER_DEV = "DEVELOPED BY EFIQ Solutions";
const FOOTER_CONTACT = `For any app development contact ${CONTACT_EMAIL}`;

interface Employee {
  id: string;
  name: string;
  mobileNo?: string;
  countryCode?: string;
  department?: string;
  branch?: string;
  role?: string;
  votes: number;
}

interface VoteDetail {
  date: string;
  question: string;
  selectedAnswer: string;
}

interface UserExportData {
  employee: Employee;
  votes: VoteDetail[];
}

export default function ExportPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [orgDisplayName, setOrgDisplayName] = useState("Organisation");
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get("/organizations/profile").then((data: any) => {
      const name = data?.shortName || data?.orgDisplayName || "Organisation";
      setOrgDisplayName(name);
    }).catch(() => {});
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      const data = await api.get(`/superadmin/users?${queryParams.toString()}`);
      setEmployees(
        Array.isArray(data)
          ? data.filter((e: Employee) => !["ADMIN", "SUPER_ADMIN"].includes((e.role || "").toUpperCase()))
          : []
      );
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEmployees(); }, [startDate, endDate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetFilters = () => {
    setSelectedBranch("All Branches");
    setSelectedDept("All Departments");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const departments = useMemo(() => {
    const s = new Set<string>();
    employees.forEach(e => { if (e.department) s.add(e.department); });
    return ["All Departments", ...Array.from(s)];
  }, [employees]);

  const branches = useMemo(() => {
    const s = new Set<string>();
    employees.forEach(e => { if (e.branch) s.add(e.branch); });
    return ["All Branches", ...Array.from(s)];
  }, [employees]);

  const filteredEmployees = useMemo(() => employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === "All Branches" || emp.branch === selectedBranch;
    const matchesDept = selectedDept === "All Departments" || emp.department === selectedDept;
    return matchesSearch && matchesBranch && matchesDept;
  }), [employees, searchQuery, selectedBranch, selectedDept]);

  const toggleSelect = (id: string) =>
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);

  const toggleSelectAll = () =>
    setSelectedEmployees(
      selectedEmployees.length === filteredEmployees.length ? [] : filteredEmployees.map(e => e.id)
    );

  const fetchExportData = async (): Promise<UserExportData[] | null> => {
    const selected = employees.filter(e => selectedEmployees.includes(e.id));
    if (selected.length === 0) { alert("Please select at least one employee to export."); return null; }

    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const query = params.toString();

    const results = await Promise.all(selected.map(async (emp) => {
      try {
        const votes: VoteDetail[] = await api.get(`/superadmin/users/${emp.id}/votes${query ? `?${query}` : ""}`);
        return { employee: emp, votes };
      } catch {
        return { employee: emp, votes: [] };
      }
    }));
    return results;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch { return iso; }
  };

  const buildFilename = (data: UserExportData[], ext: string) => {
    const refDate = startDate ? new Date(startDate) : new Date();
    const month = refDate.toLocaleString("en-US", { month: "long" });
    const year = refDate.getFullYear();
    if (data.length === 1) {
      const safeName = data[0].employee.name.trim().replace(/\s+/g, "_");
      return `${safeName}_${month}_Report.${ext}`;
    }
    return `PollReport_${month}_${year}.${ext}`;
  };

  const handleExportCSV = async () => {
    setShowExportMenu(false);
    setExporting(true);
    try {
      const data = await fetchExportData();
      if (!data) return;

      const rows: string[] = [];
      rows.push(`"${orgDisplayName}"`);
      rows.push("");

      const dateRange = startDate || endDate
        ? `Date Range: ${startDate || "All"} to ${endDate || "All"}`
        : "Date Range: All Dates";
      rows.push(`"${dateRange}"`);
      rows.push("");

      data.forEach(({ employee, votes }) => {
        const mobile = `${employee.countryCode || ""}${employee.mobileNo || ""}`.trim() || "N/A";
        rows.push(`"Name","${employee.name}"`);
        rows.push(`"Mobile","${mobile}"`);
        if (employee.branch) rows.push(`"Branch","${employee.branch}"`);
        if (employee.department) rows.push(`"Department","${employee.department}"`);
        rows.push("");
        rows.push(`"Date","Question","Selected Answer"`);

        if (votes.length === 0) {
          rows.push(`"—","No poll responses in this period","—"`);
        } else {
          votes.forEach(v => {
            rows.push([
              `"${formatDate(v.date)}"`,
              `"${v.question.replace(/"/g, '""')}"`,
              `"${v.selectedAnswer.replace(/"/g, '""')}"`,
            ].join(","));
          });
        }
        rows.push("");
        rows.push("---");
        rows.push("");
      });

      rows.push(`"${FOOTER_DEV}"`);
      rows.push(`"${FOOTER_CONTACT}"`);

      const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = buildFilename(data, "csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setShowExportMenu(false);
    setExporting(true);
    try {
      const data = await fetchExportData();
      if (!data) return;

      const { default: jsPDF } = await import("jspdf");
      const { autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
      const dateRange = startDate || endDate ? `${startDate || "All"} to ${endDate || "All"}` : "All Dates";

      // ── Header ──────────────────────────────────────────
      doc.setFillColor(21, 94, 117);
      doc.rect(0, 0, pageW, 38, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(orgDisplayName.toUpperCase(), pageW / 2, 16, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(207, 226, 232);
      doc.text(`Poll Report  |  ${dateRange}  |  Generated: ${today}`, pageW / 2, 27, { align: "center" });

      let cursorY = 46;

      data.forEach(({ employee, votes }, idx) => {
        // page break between users (not on first)
        if (idx > 0) {
          doc.addPage();
          cursorY = 20;
        }

        // ── User detail box ────────────────────────────
        const mobile = `${employee.countryCode || ""}${employee.mobileNo || ""}`.trim() || "N/A";

        doc.setFillColor(207, 226, 232);
        doc.roundedRect(14, cursorY, pageW - 28, 24, 2, 2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(21, 94, 117);
        doc.text(employee.name, 20, cursorY + 9);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(40, 116, 140);
        const detailParts = [
          `Mobile: ${mobile}`,
          employee.branch ? `Branch: ${employee.branch}` : null,
          employee.department ? `Dept: ${employee.department}` : null,
        ].filter(Boolean).join("   |   ");
        doc.text(detailParts, 20, cursorY + 18);

        cursorY += 30;

        // ── Poll responses table ────────────────────────
        const tableBody = votes.length > 0
          ? votes.map(v => [formatDate(v.date), v.question, v.selectedAnswer])
          : [["—", "No poll responses in this period", "—"]];

        autoTable(doc, {
          startY: cursorY,
          head: [["Date", "Question", "Selected Answer"]],
          body: tableBody,
          styles: { fontSize: 9, cellPadding: 4, font: "helvetica", textColor: [30, 30, 30], overflow: "linebreak" },
          headStyles: { fillColor: [21, 94, 117], textColor: [255, 255, 255], fontStyle: "bold" },
          columnStyles: {
            0: { cellWidth: 28, halign: "center" },
            1: { cellWidth: "auto" },
            2: { cellWidth: 45 },
          },
          alternateRowStyles: { fillColor: [248, 248, 248] },
          margin: { left: 14, right: 14 },
        });

        cursorY = (doc as any).lastAutoTable.finalY + 8;
      });

      // ── Footer ──────────────────────────────────────────
      doc.setFillColor(21, 94, 117);
      doc.rect(0, pageH - 16, pageW, 16, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(FOOTER_DEV, 14, pageH - 6);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(207, 226, 232);
      doc.text(FOOTER_CONTACT, pageW - 14, pageH - 6, { align: "right" });

      doc.save(buildFilename(data, "pdf"));
    } finally {
      setExporting(false);
    }
  };

  const canExport = selectedEmployees.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-wide text-white mb-2">Export Data</h1>
          <p className="text-gray-400">Download employee participation and poll responses</p>
        </div>

        <div className="relative" ref={exportMenuRef}>
          <button
            onClick={() => canExport && !exporting && setShowExportMenu(prev => !prev)}
            disabled={!canExport || exporting}
            className={`flex items-center gap-2 px-8 py-3 font-bold rounded-xl transition-all shadow-lg ${
              canExport && !exporting
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {exporting ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            {exporting ? "Exporting…" : "Export"}
            {!exporting && <ChevronDown size={16} className={`transition-transform ${showExportMenu ? "rotate-180" : ""}`} />}
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1e1e1e] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-3 w-full px-5 py-4 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
              >
                <Sheet size={16} className="text-green-400" />
                <div className="text-left">
                  <p className="font-semibold">Export as CSV</p>
                  <p className="text-xs text-gray-500">Spreadsheet format</p>
                </div>
              </button>
              <div className="border-t border-[#333]" />
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-3 w-full px-5 py-4 text-sm text-white hover:bg-[#2a2a2a] transition-colors"
              >
                <FileText size={16} className="text-red-400" />
                <div className="text-left">
                  <p className="font-semibold">Export as PDF</p>
                  <p className="text-xs text-gray-500">Formatted report</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters */}
        <section className="space-y-6">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ChevronDown size={16} className="text-blue-500" /> Quick Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Branch</label>
                <div className="relative">
                  <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer">
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Department</label>
                <div className="relative">
                  <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">From</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 text-gray-300" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">To</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-[#242424] border border-[#333] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-blue-500/50 text-gray-300" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#333]">
              <button onClick={resetFilters} className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors">
                Reset All Filters
              </button>
            </div>
          </div>
        </section>

        {/* Employee Selection */}
        <section className="lg:col-span-2 bg-[#1e1e1e] border border-[#333] rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input type="text" placeholder="Search Employees..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#242424] border border-[#333] rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleSelectAll} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
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
                <p className="text-gray-500 font-medium text-center px-6">No employees found matching your current filters.</p>
              </div>
            ) : filteredEmployees.map(emp => {
              const isSelected = selectedEmployees.includes(emp.id);
              return (
                <div key={emp.id} onClick={() => toggleSelect(emp.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected ? "bg-blue-600/10 border-blue-600/50 shadow-inner" : "bg-[#242424] border-[#333] hover:border-gray-600"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isSelected ? "bg-blue-600 border-blue-600 text-white scale-105" : "bg-[#1e1e1e] border-[#444] text-gray-500"
                    }`}>
                      {isSelected ? <CheckCircle2 size={24} /> : (emp.name?.[0]?.toUpperCase() ?? "?")}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">{emp.name}</p>
                      <p className="text-xs text-gray-500">
                        <span className="text-blue-400/80">{emp.branch || "General"}</span> • {emp.department || "No Department"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-bold ${emp.votes > 0 ? "text-blue-400" : "text-gray-600"}`}>{emp.votes || 0}</span>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Total Votes</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1e1e1e; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
}
