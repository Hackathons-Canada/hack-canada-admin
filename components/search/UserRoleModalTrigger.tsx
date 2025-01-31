"use client";

import { Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface UserRoleModalTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  role: UserRole;
  className?: string;
}

export const UserRoleModalTrigger = ({
  role,
  className,
  ...props
}: UserRoleModalTriggerProps) => {
  return (
    <button
      {...props}
      className={cn(
        "group flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all",
        // Color scheme based on role
        role === "admin" &&
          "bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:hover:bg-violet-900",
        role === "hacker" &&
          "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900",
        role === "organizer" &&
          "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900",
        role === "mentor" &&
          "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900",
        role === "volunteer" &&
          "bg-teal-100 text-teal-700 hover:bg-teal-200 dark:bg-teal-900/50 dark:text-teal-300 dark:hover:bg-teal-900",
        role === "judge" &&
          "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900",
        role === "unassigned" &&
          "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-900",
        className,
      )}
    >
      <span className="capitalize">{role}</span>
      <Edit3
        className="opacity-70 transition-opacity group-hover:opacity-100"
        size={14}
      />
    </button>
  );
};
