"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Activity, Building2, CheckCircle2, LockKeyhole, Plus, Power, RefreshCw, Search, Shield, Users, Vote } from "lucide-react";
import { db } from "@/lib/firebase";
import { api } from "@/lib/api";

type Organization = {
  id: string;
  organizationId: string;
  companyName: string;
  isEnabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  admin?: Admin | null;
  stats?: { polls: number; votes: number };
};

type Admin = {
  id: string;
  userId: string;
  name: string;
  email: string;
  mobileNo?: string;
  organizationId: string;
  isEnabled: boolean;
  createdAt?: string;
  organization?: { companyName?: string; isEnabled?: boolean };
};

const emptyForm = {
  name: "",
  email: "",
  mobileNo: "",
  password: "",
  companyName: "",
};

export default function SuperadminPage() {
  const [stats, setStats] = useState<any>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [activityData, setActivityData] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [passwordReset, setPasswordReset] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadServerViews() {
    const [statsData, orgData, adminData, activity] = await Promise.all([
      api.get("/superadmin/dashboard-stats"),
      api.get("/superadmin/organizations"),
      api.get("/superadmin/admins"),
      api.get("/superadmin/activity"),
    ]);
    setStats(statsData);
    setOrganizations(orgData);
    setAdmins(adminData);
    setActivityData(activity);
  }

  useEffect(() => {
    let mounted = true;
    loadServerViews()
      .catch((err) => setError(err.message || "Failed to load Super Admin data"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const filteredOrganizations = useMemo(() => {
    const needle = search.toLowerCase();
    return organizations.filter((organization) => {
      if (organization.organizationId === "master-org" || organization.companyName === "master-org") return false;
      return !needle ||
        organization.companyName?.toLowerCase().includes(needle) ||
        organization.admin?.email?.toLowerCase().includes(needle) ||
        organization.admin?.name?.toLowerCase().includes(needle);
    });
  }, [organizations, search]);

  const filteredAdmins = useMemo(() => {
    const needle = search.toLowerCase();
    return admins.filter((admin) =>
      !needle ||
      admin.name?.toLowerCase().includes(needle) ||
      admin.email?.toLowerCase().includes(needle) ||
      admin.organization?.companyName?.toLowerCase().includes(needle),
    );
  }, [admins, search]);

  async function createAdmin(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/superadmin/admins", form);
      setForm(emptyForm);
      await loadServerViews();
    } catch (err: any) {
      setError(err.message || "Failed to create admin");
    } finally {
      setSaving(false);
    }
  }

  async function toggleOrganization(organization: Organization) {
    await api.patch(`/superadmin/organizations/${organization.organizationId}/status`, {
      isEnabled: !organization.isEnabled,
    });
    await loadServerViews();
  }

  async function toggleAdmin(admin: Admin) {
    await api.patch(`/superadmin/admins/${admin.id}`, { isEnabled: !admin.isEnabled });
    if (admin.organizationId && admin.organizationId !== "master-org") {
      try {
        await api.patch(`/superadmin/organizations/${admin.organizationId}/status`, {
          isEnabled: !admin.isEnabled,
        });
      } catch (err) {
        console.error("Failed to sync organization status", err);
      }
    }
    await loadServerViews();
  }

  async function resetPassword(admin: Admin) {
    const password = passwordReset[admin.id];
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    await api.post(`/superadmin/admins/${admin.id}/reset-password`, { password });
    setPasswordReset((current) => ({ ...current, [admin.id]: "" }));
  }

  if (loading) {
    return <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-gray-500 font-orbitron animate-pulse">Loading Super Admin...</div>;
  }

  const metricCards = [
    { label: "Organizations", value: stats?.totalOrganizations || 0, icon: Building2 },
    { label: "Admins", value: stats?.totalAdmins || 0, icon: Shield },
    { label: "Users", value: stats?.totalUsers || 0, icon: Users },
    { label: "Active Orgs", value: stats?.activeOrganizations || 0, icon: CheckCircle2 },
    { label: "Disabled Orgs", value: stats?.disabledOrganizations || 0, icon: LockKeyhole },
  ];

  return (
    <>
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-orbitron font-bold uppercase tracking-wide text-white leading-none">Super Admin</h1>
        <div className="relative w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search organizations or admins"
            className="w-full rounded-lg border border-[#444] bg-[#242424] py-2 pl-10 pr-4 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500/60"
          />
        </div>
      </header>

      {error && <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

      <section className="grid grid-cols-5 gap-5 mb-10 border-b border-[#333333] pb-8">
        {metricCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="min-w-0">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[#333333] bg-[#2a2a2a] text-blue-400">
                <Icon size={17} />
              </div>
              <p className="text-gray-400 text-sm font-medium mb-1">{item.label}</p>
              <p className="text-3xl font-bold font-orbitron">{item.value.toLocaleString()}</p>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-[420px_1fr] gap-8 mb-10" id="admins">
        <form onSubmit={createAdmin} className="bg-[#2a2a2a] rounded-xl p-6 border border-[#333333]/50">
          <div className="flex items-center gap-2 mb-6">
            <Plus size={18} className="text-green-400" />
            <h2 className="font-orbitron font-bold uppercase tracking-wide">Create Admin</h2>
          </div>
          <div className="space-y-3">
            {Object.keys(emptyForm).map((key) => (
              <input
                key={key}
                type={key === "password" ? "password" : key === "email" ? "email" : "text"}
                value={form[key as keyof typeof form]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                placeholder={key === "companyName" ? "Company name" : key === "mobileNo" ? "Mobile number" : key[0].toUpperCase() + key.slice(1)}
                className="w-full rounded-lg border border-[#444] bg-[#242424] px-4 py-2.5 text-sm text-gray-200 outline-none transition-colors placeholder:text-gray-500 focus:border-blue-500/60"
                required={key !== "mobileNo"}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Plus size={16} />}
            Create Tenant Admin
          </button>
        </form>

        <div className="bg-[#2a2a2a] rounded-xl p-6 border border-[#333333]/50">
          <h2 className="font-orbitron font-bold uppercase tracking-wide mb-5">Admin Management</h2>
          <div className="space-y-3 max-h-[390px] overflow-y-auto pr-2">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="grid grid-cols-[1fr_140px_230px] items-center gap-4 rounded-lg bg-[#242424] p-4 border border-[#333333]/60">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{admin.name}</p>
                  <p className="text-sm text-gray-400 truncate">{admin.email}</p>
                  <p className="text-xs text-gray-500 truncate">{admin.organization?.companyName || admin.organizationId}</p>
                </div>
                <button
                  onClick={() => toggleAdmin(admin)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${admin.isEnabled ? "border-red-400/40 text-red-300 hover:bg-red-500/10" : "border-green-400/40 text-green-300 hover:bg-green-500/10"
                    }`}
                >
                  <Power size={15} />
                  {admin.isEnabled ? "Disable" : "Enable"}
                </button>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={passwordReset[admin.id] || ""}
                    onChange={(event) => setPasswordReset((current) => ({ ...current, [admin.id]: event.target.value }))}
                    placeholder="New password"
                    className="min-w-0 flex-1 rounded-lg border border-[#444] bg-[#1e1e1e] px-3 py-2 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-blue-500/60"
                  />
                  <button onClick={() => resetPassword(admin)} className="rounded-lg border border-white/70 px-3 py-2 text-sm font-semibold hover:bg-white/5">
                    Reset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10" id="organizations">
        <h2 className="font-orbitron text-xl font-bold mb-6">Organization Management</h2>
        <div className="bg-[#2a2a2a] rounded-xl border border-[#333333]/50 overflow-hidden">
          <div className="grid grid-cols-[1.5fr_1.2fr_140px] gap-4 border-b border-[#333] px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#666]">
            <div>Organization</div>
            <div>Admin</div>
            <div>Status</div>
          </div>
          {filteredOrganizations.map((organization) => (
            <div key={organization.id} className="grid grid-cols-[1.5fr_1.2fr_140px] gap-4 items-center border-b border-[#333]/60 px-6 py-4 last:border-b-0">
              <div>
                <p className="font-semibold">{organization.companyName}</p>
                <p className="text-xs text-gray-500">{organization.organizationId}</p>
              </div>
              <div className="min-w-0">
                <p className="text-sm truncate">{organization.admin?.name || "No admin"}</p>
                <p className="text-xs text-gray-500 truncate">{organization.admin?.email || "-"}</p>
              </div>
              <div className="text-sm">
                {organization.isEnabled ? "Enabled" : "Disabled"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="activity">
        <h2 className="font-orbitron text-xl font-bold mb-6">Activity Monitoring</h2>
        <div className="grid grid-cols-1 gap-6">
          <ActivityColumn title="Organization Activity" items={activityData?.organizationActivity} getText={(item) => `${item.companyName || item.id} updated`} />
        </div>
      </section>
    </>
  );
}

function ActivityColumn({ title, items, getText }: { title: string; items?: any[]; getText: (item: any) => string }) {
  return (
    <div className="bg-[#2a2a2a] rounded-xl p-5 border border-[#333333]/50 min-h-64">
      <h3 className="font-orbitron font-bold uppercase tracking-wide text-sm mb-4">{title}</h3>
      <div className="space-y-3">
        {(items || []).slice(0, 6).map((item) => (
          <div key={item.id} className="rounded-lg bg-[#242424] border border-[#333333]/60 p-3">
            <p className="text-sm text-gray-200 truncate">{getText(item)}</p>
            <p className="text-xs text-gray-500 mt-1">{item.createdAt || item.updatedAt || "Realtime"}</p>
          </div>
        ))}
        {(!items || items.length === 0) && <p className="text-sm text-gray-500 italic">No activity recorded yet.</p>}
      </div>
    </div>
  );
}
