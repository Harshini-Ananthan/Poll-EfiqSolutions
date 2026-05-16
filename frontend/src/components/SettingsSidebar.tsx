"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Monitor, 
  Bell, 
  Sun, 
  Users, 
  Shield, 
  CreditCard, 
  TriangleAlert 
} from "lucide-react";

export default function SettingsSidebar() {
  const pathname = usePathname();

  const sections = [
    {
      title: "GENERAL",
      items: [
        { name: "Company profile", href: "/dashboard/settings/company-profile", icon: Monitor },
      ],
    },
    {
      title: "USERS",
      items: [
        { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
        { name: "Appearance", href: "/dashboard/settings/appearance", icon: Sun },
        { name: "User management", href: "/dashboard/settings/user-management", icon: Users },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { name: "Security", href: "/dashboard/settings/security", icon: Shield },
        { name: "Billing & plan", href: "/dashboard/settings/billing", icon: CreditCard },
        { name: "Danger zone", href: "/dashboard/settings/danger-zone", icon: TriangleAlert, danger: true },
      ],
    },
  ];

  return (
    <aside className="w-[280px] flex-shrink-0 bg-[#242424] border-r border-[#333333] h-full overflow-y-auto">
      <div className="py-8 px-6">
        <h2 className="text-xl font-medium text-gray-300 font-manrope mb-8 pl-2 border-b border-[#333333] pb-4">Settings</h2>
        
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 pl-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                          isActive
                            ? "bg-white/5 text-[#D46B53] font-medium"
                            : item.danger
                            ? "text-red-500/80 hover:bg-white/5 hover:text-red-500"
                            : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                        }`}
                      >
                        <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#D46B53]" : ""} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
