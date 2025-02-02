"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import { Button } from "@/components/ui/button";

interface Application {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  reviewCount: number | null;
  averageRating: number | null;
  internalResult: string | null;
  userId: string;
  applicationStatus: string;
}

interface AdminApplicationListProps {
  applications: Application[];
}

export default function AdminApplicationList({
  applications,
}: AdminApplicationListProps) {
  if (!applications.length) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
          <TableHead className="py-4 font-semibold">Name</TableHead>
          <TableHead className="py-4 font-semibold">Email</TableHead>
          <TableHead className="py-4 text-center font-semibold">
            Reviews
          </TableHead>
          <TableHead className="py-4 text-center font-semibold">
            Rating
          </TableHead>
          <TableHead className="py-4 text-center font-semibold">
            Result
          </TableHead>
          <TableHead className="py-4 text-right font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow
            key={application.id}
            className="transition-colors hover:bg-muted/50"
          >
            <TableCell className="py-4 font-medium">
              {application.firstName} {application.lastName}
            </TableCell>
            <TableCell className="py-4">{application.email}</TableCell>
            <TableCell className="py-4 text-center">
              {application.reviewCount ?? 0}
            </TableCell>
            <TableCell className="py-4 text-center">
              {application.averageRating?.toFixed(1) ?? "N/A"}
            </TableCell>
            <TableCell className="py-4 text-center">
              {application.internalResult ?? "Pending"}
            </TableCell>
            <TableCell className="py-4 text-right">
              <ApplicationStatusModal
                userId={application.userId}
                name={`${application.firstName} ${application.lastName}`}
                email={application.email ?? ""}
                status={application.applicationStatus as ApplicationStatus}
              >
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </ApplicationStatusModal>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
