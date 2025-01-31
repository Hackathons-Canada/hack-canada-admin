"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import HackerStatusModal from "./ApplicationStatusModal";
import { HackerApplicationsSelectData } from "@/lib/db/schema";
import {
  ArrowUpRightFromSquare,
  Mail,
  UserCircle2,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  hacker: HackerApplicationsSelectData;
  status: ApplicationStatus;
};

const ApplicationActions = ({ hacker, status }: Props) => {
  return (
    <div className="flex h-fit w-full max-w-screen-md flex-col gap-5 rounded-lg border bg-gradient-to-br from-background via-background/80 to-background p-6 md:p-8 xl:max-w-sm xl:gap-6">
      <div className="space-y-1">
        <h3 className="font-semibold">Actions</h3>
        <p className="text-sm text-muted-foreground">
          Manage {hacker.firstName}&apos;s application
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="gap-3 max-sm:space-y-3 sm:flex xl:block xl:space-y-3">
          <Button
            asChild
            className="group w-full gap-2 text-base transition-all hover:scale-[1.02]"
          >
            <Link href={`mailto:${hacker.email}`}>
              <Mail className="size-4 transition-transform group-hover:-translate-y-0.5" />
              Message {hacker.firstName}
              <ArrowUpRightFromSquare className="size-3.5 opacity-60" />
            </Link>
          </Button>
          <HackerStatusModal
            userId={hacker.userId}
            name={hacker.firstName + " " + hacker.lastName}
            email={hacker.email}
            age={hacker.age}
            status={status}
          >
            <Button className="group w-full gap-2 text-base transition-all hover:scale-[1.02]">
              <RefreshCcw className="size-4 transition-transform group-hover:rotate-180" />
              Update Status
            </Button>
          </HackerStatusModal>
        </div>

        <div
          className={cn(
            "my-1.5 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50",
          )}
        />

        <Button
          asChild
          variant="outline"
          className="group w-full gap-2 text-base transition-all hover:scale-[1.02]"
        >
          <Link href={`/users/${hacker.userId}`}>
            <UserCircle2 className="size-4 transition-transform group-hover:-translate-y-0.5" />
            View User
            <ArrowUpRightFromSquare className="size-3.5 opacity-60" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
export default ApplicationActions;
