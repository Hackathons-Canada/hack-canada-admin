"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import NavLinks from "./NavLinks";
import { Button } from "../ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserProfile from "./UserProfile";
import { useState } from "react";

const MobileNav = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="size-10">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full border-l-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 pb-8 pt-4">
            <Image
              src="/logo.webp"
              alt="Hack Canada Logo"
              width={32}
              height={32}
              className="translate-y-0.5"
            />
            <p className="w-fit bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-lg font-semibold text-transparent transition-colors dark:from-sky-500 dark:to-blue-500">
              Hack Canada Admin
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            <NavLinks isMinimized={false} onNavigate={() => setIsOpen(false)} />
          </div>

          <div className="mt-auto border-t">
            {user ? (
              <UserProfile isMinimized={false} />
            ) : (
              <div className="p-6">
                <Button
                  asChild
                  className="w-full bg-primary text-lg font-medium"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
