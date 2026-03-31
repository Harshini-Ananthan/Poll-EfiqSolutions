"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, 
  Bell, 
  Palette, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  AlertTriangle 
} from "lucide-react";

const SETTINGS_NAV = [
  { 
    group: "GENERAL", 
    items: [
      { name: "Company profile", href: "/dashboard/settings/company-profile", icon: Building2 },
    ]
  },
  { 
    group: "PREFERENCES", 
    items: [
      { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
      { name: "Appearance", href: "/dashboard/settings/appearance", icon: Palette },
    ]
  },
  { 
    group: "USERS", 
    items: [
      { name: "User management", href: "/dashboard/settings/user-management", icon: Users },
    ]
  },
  { 
    group: "ACCOUNT", 
    items: [
      { name: "Security", href: "/dashboard/settings/security", icon: ShieldCheck },
      { name: "Billing & plan", href: "/dashboard/settings/billing", icon: CreditCard },
      { name: "Danger zone", href: "/dashboard/settings/danger-zone", icon: AlertTriangle, variant: "danger" },
    ]
  },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full gap-8">
      {/* Settings Sidebar */}
      <aside className="w-64 flex flex-col gap-8 py-2">
        <h2 className="text-gray-500 text-xs font-bold tracking-widest px-4 uppercase">Settings</h2>
        
        <nav className="flex flex-col gap-8">
          {SETTINGS_NAV.map((group) => (
            <div key={group.group} className="flex flex-col gap-2">
              <span className="px-4 text-[10px] font-bold text-gray-600 tracking-widest">{group.group}</span>
              <div className="flex flex-col">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? "bg-[#2a2a2a] text-white shadow-sm" 
                          : item.variant === "danger"
                            ? "text-red-500/70 hover:bg-red-500/5 hover:text-red-500"
                            : "text-gray-400 hover:bg-[#222] hover:text-gray-200"
                      }`}
                    >
                      <item.icon size={18} className={isActive ? "text-orange-500" : ""} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Settings Content */}
      <main className="flex-1 min-w-0 bg-[#2a2a2a]/30 rounded-2xl p-8 border border-[#333]/50">
        {children}
      </main>
    </div>
  );
}
