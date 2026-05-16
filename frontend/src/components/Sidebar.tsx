"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { clearSession, getStoredUser } from "@/lib/auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      clearSession();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (!mounted) {
    return (
      <aside className="w-[260px] flex-shrink-0 bg-[#1e1e1e] flex flex-col justify-between border-r border-[#333333] h-full overflow-y-auto">
        <div>
          {/* Logo Section */}
          <div className="h-24 flex items-center border-b border-[#333333]/50">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <img
                  src="/logo-white.png"
                  alt="Efiq One Logo"
                  className="w-44 h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const user = getStoredUser();
  const navItems = user?.role === "SUPER_ADMIN" ? [
    { name: "Super Admin", href: "/superadmin" },
  ] : [
    { name: "Dashboard", href: "/dashboard" },
    { name: "New Poll", href: "/dashboard/new-poll" },
    { name: "Poll Data", href: "/dashboard/poll-data" },
    { name: "Export", href: "/dashboard/export" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-[260px] flex-shrink-0 bg-[#1e1e1e] flex flex-col justify-between border-r border-[#333333] h-full overflow-y-auto">
      <div>
        {/* Logo Section */}
        <div className="h-24 flex items-center border-b border-[#333333]/50">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <img
                src="/logo-white.png"
                alt="Efiq One Logo"
                className="w-44 h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.name === "Settings" && pathname.startsWith("/dashboard/settings"));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive
                    ? "bg-[#242424] text-white border border-blue-600/50 shadow-[0_0_15px_-3px_rgba(37,99,235,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
              >
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer */}
      <div className="p-4 border-t border-[#333333]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#333333] flex items-center justify-center border border-gray-600">
              <User size={18} className="text-gray-300" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold leading-tight truncate">{user?.name || "Admin"}</span>
              <span className="text-xs text-gray-400 leading-tight mt-0.5 truncate">{user?.role || "ADMIN"}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
