import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({ children, className }: Props) => {
  return <div className={cn("p-4 md:p-8", className)}>{children}</div>;
};

export default Container;
