"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FileText, Loader2, ReceiptText, X } from "lucide-react";
import { api } from "@/lib/api";

type DashboardStats = {
  totalCustomers?: number;
  monthMealsServed?: number;
  activePolls?: unknown[];
};

type OrganizationProfile = {
  name?: string;
  adminEmail?: string;
  address?: string;
  phone?: string;
};

const PLAN_AMOUNT = 4999;
const PLAN_NAME = "Pro plan";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function monthLabel(date: Date) {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function BillingPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  const today = useMemo(() => new Date(), []);
  const selectedDate = today.toISOString().split("T")[0];
  const invoiceNumber = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}-001`;
  const renewalDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const employees = stats?.totalCustomers ?? 0;
  const usageThisMonth = stats?.monthMealsServed ?? 0;
  const pollsCreated = stats?.activePolls?.length ?? 0;
  const pdfsExported = usageThisMonth;
  const pushNotifications = employees * Math.max(usageThisMonth, 1);

  useEffect(() => {
    async function loadBillingData() {
      setLoading(true);
      setError(null);
      try {
        const [statsData, profileData] = await Promise.all([
          api.get(`/superadmin/dashboard-stats?date=${selectedDate}`),
          api.get("/organizations/profile").catch(() => null),
        ]);
        setStats(statsData);
        setProfile(profileData);
      } catch (err) {
        console.error("Failed to load billing data", err);
        setError("Failed to load billing data. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    }

    loadBillingData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Billing & plan</h1>
        <p className="text-gray-400 text-sm">Your current plan and usage.</p>
      </div>

      <section className="bg-[#242424]/50 border border-[#444]/70 rounded-xl p-6 mb-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-sm font-bold text-white">{PLAN_NAME}</h2>
            <p className="text-xs text-gray-400">Billed monthly · Renews {formatDate(renewalDate)}</p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700">Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#1f1f1f] rounded-lg p-4">
            <p className="text-2xl font-semibold text-white">{employees.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Employees</p>
          </div>
          <div className="bg-[#1f1f1f] rounded-lg p-4">
            <p className="text-2xl font-semibold text-white">Unlimited</p>
            <p className="text-xs text-gray-400">Polls / month</p>
          </div>
          <div className="bg-[#1f1f1f] rounded-lg p-4">
            <p className="text-2xl font-semibold text-white">{formatCurrency(PLAN_AMOUNT)}</p>
            <p className="text-xs text-gray-400">Per month</p>
          </div>
        </div>
      </section>

      <section className="bg-[#242424]/50 border border-[#444]/70 rounded-xl p-6 mb-5">
        <h2 className="text-sm font-bold text-white mb-4">Usage this month</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Polls created</span>
            <span className="font-bold text-white">{pollsCreated} / unlimited</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">PDFs exported</span>
            <span className="font-bold text-white">{pdfsExported.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-400">Push notifications sent</span>
            <span className="font-bold text-white">{pushNotifications.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setInvoiceOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#555] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
        >
          <ReceiptText size={17} />
          View invoices
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[#555] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
        >
          Upgrade plan
        </button>
      </div>

      {invoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#444] bg-[#1f1f1f] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#333] p-5">
              <div className="flex items-center gap-3">
                <FileText className="text-orange-500" size={22} />
                <div>
                  <h2 className="text-lg font-bold text-white">Generated invoice</h2>
                  <p className="text-xs text-gray-500">{invoiceNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 border-b border-[#333] pb-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Bill to</p>
                  <p className="font-bold text-white">{profile?.name || "Organization"}</p>
                  <p className="text-sm text-gray-400">{profile?.adminEmail || "admin account"}</p>
                  {profile?.phone && <p className="text-sm text-gray-400">{profile.phone}</p>}
                  {profile?.address && <p className="mt-2 text-sm text-gray-500">{profile.address}</p>}
                </div>
                <div className="sm:text-right">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">Billing period</p>
                  <p className="font-bold text-white">{monthLabel(today)}</p>
                  <p className="text-sm text-gray-400">Generated on {formatDate(today)}</p>
                  <p className="text-sm text-gray-400">Renews on {formatDate(renewalDate)}</p>
                </div>
              </div>

              <div className="py-6">
                <div className="grid grid-cols-[1fr_auto] gap-4 rounded-lg bg-[#242424] p-4 text-sm">
                  <div>
                    <p className="font-bold text-white">{PLAN_NAME}</p>
                    <p className="text-gray-400">
                      {employees.toLocaleString()} employees · {usageThisMonth.toLocaleString()} usage this month
                    </p>
                    <p className="text-gray-500">
                      Polls: {pollsCreated} · PDFs: {pdfsExported.toLocaleString()} · Notifications:{" "}
                      {pushNotifications.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-white">{formatCurrency(PLAN_AMOUNT)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#333] pt-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500">Final amount</p>
                  <p className="text-sm text-gray-400">Amount specified in current plan</p>
                </div>
                <p className="text-3xl font-bold text-white">{formatCurrency(PLAN_AMOUNT)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
