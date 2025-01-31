"use client";

import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import HackerStatusModal from "../HackerStatusModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { hackerApplications, users } from "@/lib/db/schema";

type HackerWithUser = {
  user: typeof users.$inferSelect;
  hackerApplication: typeof hackerApplications.$inferSelect;
};

type Props = {
  hackers: HackerWithUser[];
};

const HackerList = ({ hackers }: Props) => {
  if (hackers.length === 0) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
          <TableHead className="w-[50px] py-4"></TableHead>
          <TableHead className="py-4 font-semibold">Name</TableHead>
          <TableHead className="py-4 font-semibold">School</TableHead>
          <TableHead className="py-4 font-semibold">Level</TableHead>
          <TableHead className="py-4 font-semibold">Major</TableHead>
          <TableHead className="py-4 font-semibold">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {hackers.map((hacker) => (
          <TableRow
            key={hacker.hackerApplication.id}
            className="transition-colors hover:bg-muted/50"
          >
            <TableCell className="text-center">
              <Link
                href={`/hackers/${hacker.hackerApplication.userId}`}
                prefetch={false}
                className="inline-block rounded-md p-1 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                <ExternalLinkIcon size={18} />
              </Link>
            </TableCell>
            <TableCell className="py-4 font-medium">
              {hacker.hackerApplication.firstName}{" "}
              {hacker.hackerApplication.lastName}
            </TableCell>
            <TableCell
              className="max-w-[200px] truncate py-4"
              title={hacker.hackerApplication.school || undefined}
            >
              {hacker.hackerApplication.school || "-"}
            </TableCell>
            <TableCell className="py-4">
              {hacker.hackerApplication.levelOfStudy ? (
                <span className="capitalize">
                  {hacker.hackerApplication.levelOfStudy}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className="py-4">
              {hacker.hackerApplication.major ? (
                <span className="capitalize">
                  {hacker.hackerApplication.major}
                </span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell className="py-4">
              <HackerStatusModal
                userId={hacker.hackerApplication.userId}
                name={hacker.hackerApplication.firstName || hacker.user.name}
                email={
                  hacker.hackerApplication.email || hacker.user.email || ""
                }
                age={hacker.hackerApplication.age || 0}
                status={hacker.user.applicationStatus}
              >
                <span
                  className={cn(
                    "inline-block cursor-pointer rounded-full px-2 py-1 text-xs font-semibold transition-colors hover:opacity-80",
                    {
                      "bg-amber-200 text-amber-800":
                        hacker.user.applicationStatus === "pending" ||
                        hacker.user.applicationStatus === "waitlisted",
                      "bg-emerald-200 text-emerald-800":
                        hacker.user.applicationStatus === "accepted",
                      "bg-red-200 text-red-800":
                        hacker.user.applicationStatus === "rejected",
                    },
                  )}
                >
                  {hacker.user.applicationStatus === "not_applied"
                    ? "Not Applied"
                    : hacker.user.applicationStatus.charAt(0).toUpperCase() +
                      hacker.user.applicationStatus.slice(1)}
                </span>
              </HackerStatusModal>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HackerList;
