"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusModalTrigger } from "./search/ApplicationStatusModalTrigger";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hackerApplications, users } from "@/lib/db/schema";
import ApplicationStatusModal from "./ApplicationStatusModal";

type HackerWithUser = {
  user: typeof users.$inferSelect;
  hackerApplication: typeof hackerApplications.$inferSelect;
};

type Props = {
  applications: HackerWithUser[];
};

const HackerList = ({ applications }: Props) => {
  if (applications.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
          <TableHead className="w-[50px] py-4"></TableHead>
          <TableHead className="py-4 font-semibold">Name</TableHead>
          <TableHead className="py-4 font-semibold">Status</TableHead>
          <TableHead className="py-4 font-semibold">School</TableHead>
          <TableHead className="py-4 font-semibold">Major</TableHead>
          <TableHead className="py-4 font-semibold">Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow
            key={app.hackerApplication.id}
            className="transition-colors hover:bg-muted/50"
          >
            <TableCell className="min-w-20 text-center">
              <Link
                href={`/applications/${app.hackerApplication.userId}`}
                prefetch={false}
                className="inline-block rounded-md p-1 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <ExternalLinkIcon size={18} />
              </Link>
            </TableCell>
            <TableCell className="py-4 font-medium">
              {app.hackerApplication.firstName} {app.hackerApplication.lastName}
            </TableCell>
            <TableCell className="py-4">
              <ApplicationStatusModal
                userId={app.hackerApplication.userId}
                name={app.hackerApplication.firstName || app.user.name}
                email={app.hackerApplication.email || app.user.email || ""}
                status={app.user.applicationStatus as ApplicationStatus}
              >
                <ApplicationStatusModalTrigger
                  status={app.user.applicationStatus as ApplicationStatus}
                />
              </ApplicationStatusModal>
            </TableCell>
            <TableCell
              className="max-w-[200px] truncate py-4"
              title={app.hackerApplication.school || undefined}
            >
              {app.hackerApplication.school || "-"}
            </TableCell>

            <TableCell className="py-4">
              {app.hackerApplication.major ? (
                <span className="capitalize">
                  {app.hackerApplication.major}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className="max-w-[200px] truncate py-4">
              {app.hackerApplication.age ? (
                <span className="capitalize">{app.hackerApplication.age}</span>
              ) : (
                "-"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HackerList;
