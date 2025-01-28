import { formatDate } from "@/lib/utils";
import { User } from "@/types/user";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";

type Props = {
  user: User | null;
};

const UserInfo = ({ user }: Props) => {
  if (!user) {
    return (
      <div className="idk">
        <p>Could not find a user with the given ID.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border p-4 md:p-8">
      <div className="grid w-full gap-y-4 max-[410px]:mr-20">
        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">ID</p>
          <p className="w-1/2 text-nowrap text-right">{user.id}</p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">First Name</p>
          <p className="w-1/2 text-nowrap text-right">{user.firstName}</p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Last Name</p>
          <p className="w-1/2 text-nowrap text-right">
            {user.lastName || (
              <b className="text-zinc-300 dark:text-zinc-600">N/A</b>
            )}
          </p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Email Address</p>
          <p
            title={user.email}
            className="w-1/2 truncate text-nowrap text-right"
          >
            {user.email}
          </p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Role</p>
          <p className="w-1/2 text-nowrap text-right">{user.role}</p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Application Status</p>
          <p className="w-1/2 text-nowrap text-right">
            {user.applicationStatus}
          </p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Auth Provider</p>
          <p className="w-1/2 text-nowrap text-right">{user.provider}</p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Email Verified</p>
          <p className="w-1/2 text-nowrap text-right">
            {user.emailVerified
              ? formatDate(user.emailVerified.toString())
              : "N/A"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Account Created</p>
          <p className="w-1/2 text-nowrap text-right">
            {formatDate(user.createdAt.toString())}
          </p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">RSVP Status</p>
          <p className="w-1/2 text-nowrap text-right">
            {user.role === "hacker"
              ? user.rsvp
                ? formatDate(user.rsvp.toString())
                : "Has Not RSVP'd"
              : "N/A"}
          </p>
        </div>

        {user.applicationStatus !== "not_applied" && (
          <div className="flex items-center justify-between gap-12 lg:gap-12">
            <p className="w-1/2 text-nowrap">Hacker Profile</p>
            <Link
              href={`/hackers/${user.id}`}
              className="flex w-1/2 items-center justify-end gap-2 text-nowrap text-right underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Click to view <SquareArrowOutUpRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
