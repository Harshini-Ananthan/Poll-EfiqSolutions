"use client";

import React, { useState } from "react";
import { TriangleAlert } from "lucide-react";

type ConfirmState = null | "reset" | "remove" | "delete";

export default function DangerZonePage() {
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const actions = [
    {
      key: "reset" as ConfirmState,
      title: "Reset all poll data",
      description: "Deletes all votes, polls and comments. Employees and settings remain. Cannot be undone.",
      buttonLabel: "Reset poll data",
      confirmMessage: "Type RESET to confirm resetting all poll data.",
    },
    {
      key: "remove" as ConfirmState,
      title: "Remove all employees",
      description: "Removes all 400 employee accounts. They will lose access immediately.",
      buttonLabel: "Remove all employees",
      confirmMessage: "Type REMOVE to confirm removing all employees.",
    },
    {
      key: "delete" as ConfirmState,
      title: "Delete organisation",
      description: "Permanently deletes your MealVote account, all data, and cancels billing. This cannot be undone.",
      buttonLabel: "Delete organisation",
      confirmMessage: "Type DELETE to confirm deleting your organisation.",
    },
  ];

  return (
    <div className="p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-200 mb-2">Danger zone</h1>
        <p className="text-gray-400 text-sm">Irreversible actions — proceed carefully.</p>
      </div>

      <div className="space-y-5">
        {actions.map((action) => (
          <div
            key={action.key}
            className="border border-red-900/60 bg-red-950/10 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-3">
              <TriangleAlert size={16} className="text-red-500 mt-0.5 shrink-0" />
              <h2 className="text-[15px] font-semibold text-red-400">{action.title}</h2>
            </div>
            <p className="text-sm text-gray-400 mb-5 pl-7">{action.description}</p>

            {confirm === action.key ? (
              <div className="pl-7 flex flex-col gap-3">
                <p className="text-xs text-gray-400">{action.confirmMessage}</p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    className="bg-[#242424] border border-red-800/50 rounded-md px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-red-600 w-48"
                    placeholder="Type to confirm"
                  />
                  <button
                    className="px-4 py-2 rounded-md bg-red-800 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirm(null)}
                    className="px-4 py-2 rounded-md border border-[#444] text-gray-400 text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="pl-7">
                <button
                  onClick={() => setConfirm(action.key)}
                  className="border border-[#555] bg-[#2a2a2a] hover:bg-[#333] text-sm text-gray-200 px-4 py-2 rounded-md transition-colors font-medium shadow-sm"
                >
                  {action.buttonLabel}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
