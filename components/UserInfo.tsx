import { formatDate } from "@/lib/utils";
import {
  ExternalLink,
  Mail,
  User as UserIcon,
  Calendar,
  Shield,
  Clock,
  Bell,
  FileCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { User } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStatusBadge } from "./search/UserStatusBadge";
import InfoRow from "./InfoRow";
import EmergencyContactInfo from "./EmergencyContactInfo";

type Props = {
  user: User;
};

const UserInfo = async ({ user }: Props) => {
  if (!user) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="pt-6">
          <p className="text-center text-destructive">
            Could not find a user with the given ID.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gradient-to-br from-background via-background/80 to-background">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-y-3">
          <InfoRow
            label="ID"
            value={user.id}
            icon={<UserIcon className="size-4" />}
          />
          <InfoRow
            label="Full Name"
            value={user.name}
            icon={<UserIcon className="size-4" />}
          />
          <InfoRow
            label="Email Address"
            value={user.email || "N/A"}
            className="overflow-hidden text-ellipsis"
            icon={<Mail className="size-4" />}
          />
          <InfoRow
            label="Role"
            value={user.role}
            icon={<Shield className="size-4" />}
          />
          <InfoRow
            label="Application Status"
            value={
              <UserStatusBadge
                status={user.applicationStatus as ApplicationStatus}
              />
            }
            icon={<FileCheck className="size-4" />}
          />
          <InfoRow
            label="Email Verified"
            value={
              user.emailVerified
                ? formatDate(user.emailVerified.toString())
                : "N/A"
            }
            icon={<Clock className="size-4" />}
          />
          <InfoRow
            label="Account Created"
            value={formatDate(user.createdAt.toString())}
            icon={<Calendar className="size-4" />}
          />
          <InfoRow
            label="RSVP Status"
            value={
              user.role === "hacker"
                ? user.rsvpAt
                  ? formatDate(user.rsvpAt.toString())
                  : "Has Not RSVP'd"
                : "N/A"
            }
            icon={<Bell className="size-4" />}
          />
          {user.applicationStatus !== "not_applied" && (
            <InfoRow
              label="Hacker Application"
              value={
                <Link
                  href={`/applications/${user.id}`}
                  className="inline-flex items-center gap-2 text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                >
                  Click to view{" "}
                  <ExternalLink strokeWidth={2.5} className="size-4" />
                </Link>
              }
              icon={<UserCheck className="size-4" />}
            />
          )}
        </div>
      </CardContent>
      {user.role === "hacker" && (
        <CardContent className="border-t pt-6">
          <EmergencyContactInfo userId={user.id} />
        </CardContent>
      )}
    </Card>
  );
};

export default UserInfo;
