import { formatDate } from "@/lib/utils";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/db/schema";

type Props = {
  user: User;
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
          <p className="w-1/2 text-nowrap">Full Name</p>
          <p className="w-1/2 text-nowrap text-right">{user.name}</p>
        </div>

        <div className="flex items-center justify-between gap-12 lg:gap-12">
          <p className="w-1/2 text-nowrap">Email Address</p>
          <p
            title={user.email || "N/A"}
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
              ? user.rsvpAt
                ? formatDate(user.rsvpAt.toString())
                : "Has Not RSVP'd"
              : "N/A"}
          </p>
        </div>

        {user.applicationStatus !== "not_applied" && (
          <div className="flex items-center justify-between gap-12 lg:gap-12">
            <p className="w-1/2 text-nowrap">Hacker Application</p>
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
