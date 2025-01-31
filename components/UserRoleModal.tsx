"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  role: UserRole;
  children: React.ReactNode;
  userId: string;
  name: string | null;
  email: string | null;
};

const ROLES: UserRole[] = [
  "admin",
  "hacker",
  "organizer",
  "mentor",
  "volunteer",
  "judge",
  "unassigned",
];

const UserRoleModal = ({ role, children, name, email, userId }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: "Failed to update user role",
        error: "Network error occurred",
      };
    }
  };

  const onSubmit = () => {
    if (!selectedRole || selectedRole === role) return;

    startTransition(async () => {
      const data = await updateUserRole(userId, selectedRole);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Role</DialogTitle>
          <DialogDescription className="space-y-2 py-2">
            <p>
              Update the user&apos;s role. This will change their permissions
              and access levels within the system.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5">
          <div className="flex justify-between rounded-md bg-muted px-3 py-2.5">
            <p className="text-muted-foreground">Name</p>
            <p>{name}</p>
          </div>

          <div className="flex justify-between gap-4 rounded-md bg-muted px-3 py-2.5">
            <p className="w-1/2 text-nowrap text-muted-foreground">
              Email Address
            </p>
            <p className="w-1/2 break-words text-right">{email}</p>
          </div>

          <div className="flex justify-between rounded-md bg-muted px-3 py-2.5">
            <p className="text-muted-foreground">Current Role</p>
            <p className="capitalize">{role}</p>
          </div>
        </div>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Select New Role
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((roleOption) => (
                <Button
                  key={roleOption}
                  onClick={() => setSelectedRole(roleOption)}
                  disabled={isPending || role === roleOption}
                  size="sm"
                  variant={
                    role === roleOption
                      ? "default"
                      : selectedRole === roleOption
                        ? "outline"
                        : "ghost"
                  }
                  className={cn(
                    "border border-primary/25 capitalize",
                    role === roleOption && "cursor-default hover:scale-100",
                    selectedRole === roleOption &&
                      "border-2 border-primary bg-primary/10 shadow-sm",
                  )}
                >
                  {roleOption}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={onSubmit}
            disabled={!selectedRole || selectedRole === role || isPending}
            className="h-11 w-full text-base font-medium"
          >
            {isPending ? "Updating..." : "Confirm Role Change"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleModal;
