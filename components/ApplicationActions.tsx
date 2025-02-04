"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { HackerApplicationsSelectData } from "@/lib/db/schema";
import {
  ArrowUpRightFromSquare,
  Mail,
  UserCircle2,
  RefreshCcw,
} from "lucide-react";
import ApplicationStatusModal from "./ApplicationStatusModal";

type Props = {
  hacker: HackerApplicationsSelectData;
  status: ApplicationStatus;
};

const ApplicationActions = ({ hacker, status }: Props) => {
  return (
    <div className="flex h-fit w-full max-w-screen-md flex-col gap-5 rounded-lg border bg-background p-6 md:p-8 xl:max-w-sm xl:gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">Actions</h3>
          <p className="text-sm text-muted-foreground">
            Manage {hacker.firstName}&apos;s application
          </p>
        </div>
        <Button
          asChild
          variant="secondary"
          size="icon"
          className="h-8 w-8 transition-all hover:scale-105"
        >
          <Link href={`mailto:${hacker.email}`}>
            <Mail className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <ApplicationStatusModal
          userId={hacker.userId}
          name={hacker.firstName + " " + hacker.lastName}
          email={hacker.email}
          status={status}
        >
          <Button className="group w-full gap-2 text-base transition-all">
            <RefreshCcw className="size-4 transition-transform group-hover:rotate-180" />
            Update Status
          </Button>
        </ApplicationStatusModal>

        <hr />

        <Button
          asChild
          variant="outline"
          className="group w-full gap-2 text-base transition-all"
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
