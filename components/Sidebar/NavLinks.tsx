import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldCheck,
  ScrollText,
  HardHat,
} from "lucide-react";

const iconMap = {
  Home: LayoutDashboard,
  Users: Users,
  Hackers: HardHat,
  Statistics: BarChart3,
  "Role Management": ShieldCheck,
  Logs: ScrollText,
};

interface NavLinksProps {
  isMinimized: boolean;
}

const NavLinks = ({ isMinimized }: NavLinksProps) => {
  const pathname = usePathname();

  return (
    <ul className="w-full space-y-2">
      {navLinks.map((link) => {
        const Icon = iconMap[link.name as keyof typeof iconMap];
        return (
          <li
            key={link.name}
            className={cn(
              "flex rounded-lg border border-border/50 bg-muted/50 text-foreground/70 transition-all duration-200 hover:bg-primary/10 hover:text-foreground",
              {
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground":
                  pathname === link.href,
              },
            )}
          >
            <Link
              className={cn(
                "flex w-full items-center px-4 py-2.5",
                isMinimized ? "" : "gap-3",
              )}
              href={link.href}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "shrink-0 transition-all",
                    isMinimized ? "size-[22px]" : "size-[18px]",
                  )}
                />
              )}
              <span
                className={cn(
                  "origin-left scale-x-100 text-nowrap font-medium transition-all duration-300",
                  isMinimized
                    ? "scale-x-0 opacity-0 duration-150"
                    : "scale-x-100 opacity-100 delay-200",
                )}
              >
                {link.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
