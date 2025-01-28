import type { Metadata } from "next";
import { fredoka, rubik } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "HC Admin - Authentication",
  description: "Hack Canada Admin Dashboard Authentication",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-screen w-full items-center justify-center",
        fredoka.className,
        rubik.variable,
      )}
    >
      {children}
    </div>
  );
}
