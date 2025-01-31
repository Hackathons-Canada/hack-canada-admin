"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import HackerStatusModal from "./ApplicationStatusModal";
import { HackerApplicationsSelectData } from "@/lib/db/schema";

type Props = {
  hacker: HackerApplicationsSelectData;
  status: ApplicationStatus;
};

const ApplicationActions = ({ hacker, status }: Props) => {
  return (
    <div className="flex h-fit w-full max-w-screen-md flex-col gap-4 rounded-lg border p-4 md:p-8 xl:max-w-sm xl:gap-6">
      <p className="font-medium">Actions</p>
      <div className="gap-4 max-sm:space-y-4 sm:flex xl:block xl:space-y-4">
        <Button asChild className="w-full text-base">
          <Link href={`mailto:${hacker.email}`}>
            Message {hacker.firstName}
          </Link>
        </Button>
        <HackerStatusModal
          userId={hacker.userId}
          name={hacker.firstName + " " + hacker.lastName}
          email={hacker.email}
          age={hacker.age}
          status={status}
        >
          <Button className="w-full text-base">Update Status</Button>
        </HackerStatusModal>
      </div>

      <hr className="border-t-2" />
      <Button asChild variant="outline" className="w-full text-base">
        <Link href={`/users/${hacker.userId}`}>View User Profile</Link>
      </Button>
    </div>
  );
};
export default ApplicationActions;
