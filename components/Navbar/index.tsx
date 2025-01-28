import Link from "next/link";
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import { getCurrentUser } from "@/auth";

type Props = {};

const Navbar = async ({}: Props) => {
  const user = await getCurrentUser();

  return (
    <header className="fixed z-40 flex h-20 w-full items-center justify-center border bg-background">
      <nav className="mx-auto flex h-full w-full flex-1 items-center justify-between px-4 py-2.5 sm:px-8 sm:py-4">
        <div className="flex items-center gap-2">
          <p className="text-xl font-medium xl:text-2xl">Hack Canada Admin</p>
        </div>

        <div className="flex items-center gap-8">
          <ThemeToggle />

          {user ? (
            <p>Logged in as {user.name}.</p>
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
