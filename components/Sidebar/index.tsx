"use client";

import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldCheck,
  ScrollText,
  LogOut,
  HardHat,
  User,
} from "lucide-react";

type Props = {};

const iconMap = {
  Home: LayoutDashboard,
  Users: Users,
  Hackers: HardHat,
  Statistics: BarChart3,
  "Role Management": ShieldCheck,
  Logs: ScrollText,
};

const Sidebar = ({}: Props) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="fixed inset-y-0 z-30 hidden w-72 flex-col border-r bg-background pt-20 lg:flex">
      <div className="flex-1">
        <ul className="w-full space-y-1.5 p-3">
          {navLinks.map((link) => {
            const Icon = iconMap[link.name as keyof typeof iconMap];
            return (
              <li
                key={link.name}
                className={cn(
                  "flex rounded-lg text-foreground/70 transition-all duration-200 hover:bg-primary/10 hover:text-foreground",
                  {
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground":
                      pathname === link.href,
                  },
                )}
              >
                <Link
                  className="flex w-full items-center gap-3 px-4 py-2.5"
                  href={link.href}
                >
                  {Icon && <Icon className="h-[18px] w-[18px]" />}
                  <span className="font-medium">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User Profile Section */}
      <div className="border-t bg-secondary/5 p-3">
        {session?.user && (
          <div className="flex items-start gap-3 rounded-lg bg-card p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div>
                <p className="line-clamp-1 text-sm font-medium text-foreground">
                  {session.user.name}
                </p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-primary">
                  {session.user.role.charAt(0).toUpperCase() +
                    session.user.role.slice(1)}
                </p>
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
