"use client";

import { cn, formatApplicationStatus } from "@/lib/utils";

interface UserStatusBadgeProps {
  status: ApplicationStatus;
}

export const UserStatusBadge = ({ status }: UserStatusBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold transition-colors",
        status === "pending" &&
          "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
        status === "waitlisted" &&
          "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
        status === "accepted" &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
        status === "rejected" &&
          "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
        status === "cancelled" &&
          "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
        !status &&
          "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300",
      )}
    >
      {formatApplicationStatus(status) || "No Application"}
    </div>
  );
};
