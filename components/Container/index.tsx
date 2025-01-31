import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  children: React.ReactNode;
};

const Container = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8 xl:p-12",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
