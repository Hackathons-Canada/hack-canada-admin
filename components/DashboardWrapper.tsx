"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

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
          "pt-20 transition-[padding] duration-300",
          isMinimized ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardWrapper;
