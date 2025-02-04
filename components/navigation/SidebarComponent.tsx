"use client";

import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import NavLinks from "./NavLinks";
import UserProfile from "./UserProfile";

interface SidebarProps {
  isMinimized: boolean;
  onMinimize: (value: boolean) => void;
}

const Sidebar = ({ isMinimized, onMinimize }: SidebarProps) => {
  return (
    <div
      className={cn(
        "fixed inset-y-0 z-30 hidden flex-col overflow-hidden overflow-y-auto border-r bg-background pt-24 transition-all duration-300 ease-in-out lg:flex",
        isMinimized ? "w-20" : "w-72",
      )}
    >
      <div className="flex flex-1 flex-col">
        <div className="relative ml-auto mr-4">
          <button onClick={() => onMinimize(!isMinimized)}>
            {isMinimized ? (
              <PanelLeftOpen className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </button>
        </div>

        <hr className="my-4 border-t-border/50" />

        <div className="px-3">
          <NavLinks isMinimized={isMinimized} />
        </div>
      </div>

      <UserProfile isMinimized={isMinimized} />
    </div>
  );
};

export default Sidebar;
