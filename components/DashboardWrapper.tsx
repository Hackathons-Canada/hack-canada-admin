"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./navigation/SidebarComponent";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="flex-1">
      <Sidebar isMinimized={isMinimized} onMinimize={setIsMinimized} />
      <main
        className={cn(
          "pb-8 pt-20 transition-[padding] duration-300 md:pb-12",
          isMinimized ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
