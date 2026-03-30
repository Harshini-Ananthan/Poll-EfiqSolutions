import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { SettingsSidebar } from "@/components/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#242424] text-white font-manrope selection:bg-blue-500/30">
      {/* GLOBAL MAIN SIDEBAR */}
      <Sidebar />
      
      {/* SUB SIDEBAR FOR SETTINGS */}
      <SettingsSidebar />

      {/* SETTINGS MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
