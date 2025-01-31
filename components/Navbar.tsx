import Link from "next/link";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import { getCurrentUser } from "@/auth";
import Image from "next/image";

type Props = {};

const Navbar = async ({}: Props) => {
  const user = await getCurrentUser();

  return (
    <header className="fixed z-40 flex h-20 w-full items-center justify-center border-b bg-background">
      <nav className="mx-auto flex h-full w-full flex-1 items-center justify-between px-4 py-2.5 sm:px-8 sm:py-4">
        <div className="flex items-center gap-3">
          <Image
            src={"/logo.webp"}
            alt="Hack Canada Logo"
            width={40}
            height={40}
            className="translate-y-0.5"
          />
          <p className="w-fit bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-xl font-semibold text-transparent transition-colors dark:from-sky-500 dark:to-blue-500 xl:text-2xl">
            Hack Canada Admin
          </p>
        </div>

        <div className="flex items-center gap-6">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                {user.role === "admin" ? "Administrator" : user.role}
              </p>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
