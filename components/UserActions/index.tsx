"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import DeleteUserModal from "../DeleteUserModal";

type Props = {
  id: string;
  name: string;
  email: string;
  status: ApplicationStatus;
};

const UserActions = ({ id, name, email, status }: Props) => {
  return (
    <div className="flex h-fit w-full flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md md:p-8 xl:max-w-sm xl:gap-6">
      <p className="text-lg font-medium">Actions</p>
      <div className="gap-4 max-sm:space-y-4 sm:flex xl:block xl:space-y-4">
        <Button
          asChild
          size="lg"
          className="w-full text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Link href={`mailto:${email}`}>Message {name}</Link>
        </Button>
        <DeleteUserModal id={id} name={name}>
          <Button
            variant="destructive"
            size="lg"
            className="w-full text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Eradicate {name}
          </Button>
        </DeleteUserModal>
      </div>

      {status !== "not_applied" && (
        <>
          <hr className="border-t" />
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href={`/hackers/${id}`}>View Hacker Application</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default UserActions;
