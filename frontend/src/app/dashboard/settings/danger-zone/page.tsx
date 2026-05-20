"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function DangerZonePage() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (
    action: string, 
    endpoint: string, 
    confirmMessage: string, 
    successMessage: string
  ) => {
    if (!window.confirm(confirmMessage)) return;

    setLoadingAction(action);
    try {
      await api.delete(endpoint);
      alert(successMessage);
    } catch (error: unknown) {
      console.error(`Failed to execute ${action}`, error);
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      alert(message || `Failed to execute action.`);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">Danger zone</h1>
        <p className="text-gray-400 text-sm">Irreversible actions - proceed carefully.</p>
      </div>

      <div className="space-y-6">
        {/* Reset all poll data */}
        <div className="border border-red-500/30 rounded-xl p-6 bg-[#1a1a1a]">
          <h2 className="text-red-400 font-semibold mb-2">Reset all poll data</h2>
          <p className="text-gray-400 text-sm mb-6">
            Deletes all votes, polls and comments. Employees and settings remain. Cannot be undone.
          </p>
          <button
            disabled={loadingAction === "reset-polls"}
            onClick={() => handleAction(
              "reset-polls", 
              "/superadmin/danger/reset-polls", 
              "Are you completely sure you want to reset all poll data? This will permanently delete all polls and votes.", 
              "All poll data has been successfully deleted."
            )}
            className="px-4 py-2 bg-transparent border border-[#333] rounded-lg text-white text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {loadingAction === "reset-polls" ? "Processing..." : "Reset poll data"}
          </button>
        </div>

        {/* Remove all employees */}
        <div className="border border-red-500/30 rounded-xl p-6 bg-[#1a1a1a]">
          <h2 className="text-red-400 font-semibold mb-2">Remove all employees</h2>
          <p className="text-gray-400 text-sm mb-6">
            Removes all employee accounts. They will lose access immediately.
          </p>
          <button
            disabled={loadingAction === "remove-employees"}
            onClick={() => handleAction(
              "remove-employees", 
              "/superadmin/danger/remove-employees", 
              "Are you completely sure you want to remove all employees? This cannot be undone.", 
              "All employees have been removed."
            )}
            className="px-4 py-2 bg-transparent border border-[#333] rounded-lg text-white text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {loadingAction === "remove-employees" ? "Processing..." : "Remove all employees"}
          </button>
        </div>
      </div>
    </div>
  );
}
