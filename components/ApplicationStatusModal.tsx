"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn, formatApplicationStatus } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowUpRightFromSquare, Loader2 } from "lucide-react";

type Props = {
  status: ApplicationStatus;
  children: React.ReactNode;
  userId: string;
  name: string | null;
  email: string | null;
};

const ApplicationStatusModal = ({
  status,
  children,
  name,
  email,
  userId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  type ActionType = Extract<
    ApplicationStatus,
    "accepted" | "rejected" | "waitlisted"
  >;
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const onSubmit = (status: ActionType) => {
    setActionType(status);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/update-status/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        const data = await response.json();

        if (!data.success) {
          toast.error(data.message || "Failed to update status");
          return;
        }

        toast.success(data.message);
        router.refresh();
        setIsOpen(false);
      } catch (error) {
        toast.error("An error occurred while updating the status");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        {status === "not_applied" ? (
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription className="space-y-2 py-2">
              <p>This user has not applied for the hackathon yet.</p>
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
              <DialogDescription className="py-2">
                This action will trigger an automatic email notification and
                cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1">
              <div className="flex justify-between rounded-md bg-muted px-2.5 py-2">
                <p className="text-muted-foreground">Name</p>
                <p>{name}</p>
              </div>

              <div className="flex justify-between gap-4 rounded-md bg-muted px-2.5 py-2">
                <p className="w-1/2 text-nowrap text-muted-foreground">
                  Email Address
                </p>
                <p className="w-1/2 break-words text-right">{email}</p>
              </div>

              <div className="flex justify-between rounded-md bg-muted px-2.5 py-2">
                <p className="text-muted-foreground">Current Status</p>
                <p
                  className={cn({
                    "font-medium text-green-400 dark:text-green-400":
                      status === "accepted",
                    "font-medium text-rose-400 dark:text-rose-400":
                      status === "rejected",
                    "font-medium text-yellow-400 dark:text-yellow-400":
                      status === "waitlisted",
                  })}
                >
                  {formatApplicationStatus(status)}
                </p>
              </div>
              <div className="pt-4">
                <Link href={`/applications/${userId}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group w-full gap-2 text-base transition-all"
                  >
                    View Application
                    <ArrowUpRightFromSquare
                      strokeWidth={3}
                      className="size-4"
                    />
                  </Button>
                </Link>
              </div>
            </div>

            {(status === "accepted" || status === "rejected") && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                <p>
                  Since the user has already received an email, their status
                  cannot be updated at this time.
                </p>
                <p className="mb-4 py-2">
                  To undo the action, please contact the user and update the
                  status manually in the database as needed.
                </p>

                <Button asChild className="w-full">
                  <Link href={`mailto:${email}`}>Message {name}</Link>
                </Button>
              </div>
            )}

            {(status === "pending" || status === "waitlisted") && (
              <div className="flex flex-col gap-4 text-center text-muted-foreground">
                <hr className="border-t-2" />

                <p className="text-sm font-medium text-foreground">
                  Ready to update application status
                </p>

                <div className="flex gap-2 max-xs:flex-col">
                  <Button
                    disabled={isPending}
                    onClick={() => onSubmit("accepted")}
                    className="w-full text-base"
                    variant="default"
                  >
                    {isPending && actionType === "accepted" ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Accept"
                    )}
                  </Button>

                  <Button
                    disabled={isPending}
                    onClick={() => onSubmit("rejected")}
                    variant="destructive"
                    className="w-full text-base"
                  >
                    {isPending && actionType === "rejected" ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </div>

                {status === "pending" && (
                  <>
                    <Button
                      disabled={isPending}
                      onClick={() => onSubmit("waitlisted")}
                      variant="outline"
                      className="w-full text-base hover:border-secondary hover:bg-secondary/10 hover:text-secondary"
                    >
                      {isPending && actionType === "waitlisted" ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        "Mark as Waitlisted"
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default ApplicationStatusModal;
