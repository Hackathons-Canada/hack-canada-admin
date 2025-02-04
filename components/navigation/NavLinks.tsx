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
  Clipboard,
  Gavel,
} from "lucide-react";
import { useSession } from "next-auth/react";

const iconMap = {
  Home: LayoutDashboard,
  Users: Users,
  Applications: Clipboard,
  Statistics: BarChart3,
  "Review Applications": Gavel,
  "Reviewer Leaderboards": BarChart3,
  "Role Management": ShieldCheck,
  Logs: ScrollText,
};

interface NavLinksProps {
  isMinimized: boolean;
  onNavigate?: () => void;
}

const NavLinks = ({ isMinimized, onNavigate }: NavLinksProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";

  return (
    <ul className="w-full space-y-2 pb-8">
      {navLinks.map((link) => {
        const Icon = iconMap[link.name as keyof typeof iconMap];

        const isLocked = link.adminOnly && !isAdmin;

        return (
          <li
            key={link.name}
            className={cn(
              "flex rounded-lg border border-border/75 bg-muted/50 text-foreground/70 transition-[background-color,color] duration-200",
              {
                "hover:bg-primary/10 hover:text-foreground": !isLocked,
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground":
                  pathname === link.href,
                "cursor-not-allowed opacity-50": isLocked,
              },
            )}
          >
            {isLocked ? (
              <div
                className={cn(
                  "flex w-full items-center px-4 py-2.5",
                  isMinimized ? "" : "gap-3",
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "shrink-0 transition-[width,height]",
                      isMinimized ? "size-[22px]" : "size-[18px]",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "origin-left text-nowrap font-medium transition-[transform,opacity]",
                    isMinimized
                      ? "scale-x-0 opacity-0 duration-150"
                      : "scale-x-100 opacity-100 delay-75 duration-200",
                  )}
                >
                  {link.name}
                </span>
              </div>
            ) : (
              <Link
                className={cn(
                  "flex w-full items-center px-4 py-2.5",
                  isMinimized ? "" : "gap-3",
                )}
                href={link.href}
                onClick={onNavigate}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "shrink-0 transition-[width,height]",
                      isMinimized ? "size-[22px]" : "size-[18px]",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "origin-left text-nowrap font-medium transition-[transform,opacity]",
                    isMinimized
                      ? "scale-x-0 opacity-0 duration-150"
                      : "scale-x-100 opacity-100 delay-75 duration-200",
                  )}
                >
                  {link.name}
                </span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
