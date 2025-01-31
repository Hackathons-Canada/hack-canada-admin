import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

interface UserProfileProps {
  isMinimized: boolean;
}

const UserProfile = ({ isMinimized }: UserProfileProps) => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!session?.user) return null;

  return (
    <div
      className={cn(
        "origin-left p-3 transition-all duration-500",
        isMinimized ? "opacity-0 duration-100" : "opacity-100 delay-300",
      )}
    >
      <div className="flex gap-3.5 rounded-lg border p-3 shadow-black/30">
        <div className="relative aspect-square size-9 overflow-hidden rounded-full border border-primary/20">
          <Image
            src="/default-avatar.webp"
            alt="User avatar"
            className="bg-white object-cover dark:bg-gray-800"
            fill
            sizes="(max-width: 40px) 40px"
            priority
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="space-y-1">
            <p className="line-clamp-1 font-medium text-foreground">
              {session.user.name}
            </p>
            <p className="line-clamp-1 text-xs text-muted-foreground/80">
              {session.user.email}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
              {session.user.role.charAt(0).toUpperCase() +
                session.user.role.slice(1)}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center justify-center gap-1.5 rounded-md bg-destructive/10 px-2 py-1.5 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="size-3" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
