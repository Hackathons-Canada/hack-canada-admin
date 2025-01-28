"use client";

import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const Sidebar = ({}: Props) => {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 z-30 hidden w-72 border-r bg-background pt-20 lg:flex">
      <ul className="w-full space-y-4 p-8">
        {navLinks.map((link) => (
          <li
            key={link.name}
            className={cn(
              "flex rounded-lg text-lg text-muted transition duration-100 hover:bg-zinc-200 active:scale-95 dark:hover:bg-[#202020]",
              {
                "bg-zinc-300 text-foreground hover:bg-zinc-300 dark:bg-border dark:hover:bg-border":
                  pathname === link.href,
              },
            )}
          >
            <Link className="w-full px-3 py-2" href={link.href}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
