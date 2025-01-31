"use client";

import { Edit3 } from "lucide-react";
import { cn, formatApplicationStatus } from "@/lib/utils";

import { ButtonHTMLAttributes } from "react";

interface ApplicationStatusModalTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  status: ApplicationStatus;
  className?: string;
}

export const ApplicationStatusModalTrigger = ({
  status,
  className,
  ...props
}: ApplicationStatusModalTriggerProps) => {
  return (
    <button
      {...props}
      className={cn(
        "group flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
        // Using same color scheme as UserStatusBadge
        status === "pending" &&
          "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900",
        status === "waitlisted" &&
          "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900",
        status === "accepted" &&
          "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900",
        status === "rejected" &&
          "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900",
        status === "cancelled" &&
          "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900",
        status === "not_applied" &&
          "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-900",
        !status &&
          "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800",
        className,
      )}
    >
      <span>{formatApplicationStatus(status) || "No Application"}</span>
      <Edit3
        className="opacity-70 transition-opacity group-hover:opacity-100"
        size={14}
      />
    </button>
  );
};
