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
import { updateHackerStatus } from "@/actions/update-hacker-status";
import { toast } from "sonner";
import Banner from "./Banner";
import { ArrowUpRightFromSquare, Loader2, Mail } from "lucide-react";

type Props = {
  status: ApplicationStatus;
  children: React.ReactNode;
  userId: string;
  name: string | null;
  email: string | null;
  age: number | null;
};

type DisplayBannerType = {
  show: boolean;
  message: string;
  type: "error" | "success";
};

const ApplicationStatusModal = ({
  status,
  children,
  name,
  email,
  age,
  userId,
}: Props) => {
  const [isPending, startTransition] = useTransition();
  const [displayBanner, setDisplayBanner] = useState<DisplayBannerType>({
    show: false,
    message: "",
    type: "error",
  });

  const onSubmit = (status: ApplicationStatus) => {
    const troo = true;

    if (troo) {
      toast.error("This feature is not yet available.");
      return;
    }

    setDisplayBanner((prev) => ({
      ...prev,
      show: false,
    }));

    startTransition(async () => {
      const data = await updateHackerStatus(userId, status);

      if (data.error && !data.displayBanner) {
        toast.error(data.error);
        return;
      }

      if (data.error) {
        setDisplayBanner({
          show: true,
          message: data.error,
          type: "error",
        });
        return;
      }

      if (data.success) {
        setDisplayBanner({
          show: true,
          message: data.success,
          type: "success",
        });
      }
    });
  };

  return (
    <Dialog>
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
              <DialogDescription className="space-y-2 py-2">
                <p>
                  Accept or reject the hacker&apos;s applications. Can only be
                  done once. When the user receives an email, it cannot be
                  undone.
                </p>
                <p className="">
                  Upon accepting or rejecting {name}, they will receive an
                  acceptance or rejection email automatically.
                </p>
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
                <p className="text-muted-foreground">Age</p>
                <p>{age}</p>
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

            {displayBanner.show && (
              <Banner
                message={displayBanner.message}
                type={displayBanner.type}
              />
            )}

            {(status === "accepted" || status === "rejected") &&
            !displayBanner.show ? (
              <div className="py-2 text-center text-sm text-muted-foreground">
                <p>
                  Since the user has already received an email, their status
                  cannot be updated at this time.
                </p>
                <p className="mb-4 py-2">
                  {" "}
                  To undo the action, please contact the user and update the
                  status manually in the database as needed.
                </p>

                <Button asChild className="w-full">
                  <Link href={`mailto:${email}`}>Message {name}</Link>
                </Button>
              </div>
            ) : null}

            {(status === "pending" || status === "waitlisted") && (
              <div className="flex flex-col gap-4 text-center text-muted-foreground">
                <hr className="border-t-2" />

                <p className="text-balance text-sm">
                  Upon acceptance or rejection, user will immediately receive an
                  email.
                </p>

                <p className="font-medium text-foreground">
                  {name?.split(" ")[0]} is desperately waiting to be accepted.
                </p>

                <div className="flex gap-2 max-xs:flex-col md:mt-2">
                  <Button
                    disabled={isPending}
                    onClick={() => onSubmit("accepted")}
                    className="w-full text-base"
                    variant="default"
                  >
                    {isPending ? (
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
                    {isPending ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      "Reject"
                    )}
                  </Button>
                </div>

                {status === "pending" && (
                  <>
                    <hr className="my-2 border-t-2" />

                    <Button
                      disabled={isPending}
                      onClick={() => onSubmit("waitlisted")}
                      variant="outline"
                      className="w-full text-base hover:border-secondary hover:bg-secondary/10 hover:text-secondary"
                    >
                      Mark as Waitlisted
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
