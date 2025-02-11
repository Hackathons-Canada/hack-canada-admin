"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SortApplications from "./SortApplications";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import { ApplicationStatusModalTrigger } from "@/components/search/ApplicationStatusModalTrigger";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Application {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  reviewCount: number | null;
  averageRating: number | null;
  internalResult: string | null;
  userId: string;
}

interface AdminApplicationListProps {
  applications: Application[];
}

const getReviewCountColor = (count: number | null) => {
  if (count === null) return "text-gray-500";
  if (count <= 1) return "text-red-500 font-medium";
  if (count <= 3) return "text-yellow-500 font-medium";
  return "text-green-500 font-medium";
};

const getRatingColor = (rating: number | null) => {
  if (rating === null) return "text-gray-500";
  const normalizedRating = rating / 100;
  if (normalizedRating <= 3) return "text-red-500 font-medium";
  if (normalizedRating <= 6) return "text-yellow-500 font-medium";
  return "text-green-500 font-medium";
};

type SortField = "reviewCount" | "averageRating" | "internalResult";
type SortOrder = "asc" | "desc";

export default function AdminApplicationList({
  applications,
}: AdminApplicationListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = {
    field: (searchParams.get("sort") as SortField) ?? "reviewCount",
    order: (searchParams.get("order") as SortOrder) ?? "desc",
  };

  const handleSort = (field: SortField, order: SortOrder) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", field);
    params.set("order", order);
    router.push(`?${params.toString()}`);
  };

  if (!applications.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Sort applications by review count, rating, or status
        </p>
        <SortApplications onSort={handleSort} currentSort={currentSort} />
      </div>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
              <TableHead className="py-4 font-semibold">Name</TableHead>
              <TableHead className="py-4 font-semibold">Email</TableHead>
              <TableHead className="py-4 font-semibold">Status</TableHead>
              <TableHead className="py-4 text-center font-semibold">
                Review Count
              </TableHead>
              <TableHead className="py-4 text-center font-semibold">
                Avg. Rating
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
                  <Link
                    className="group relative flex w-fit items-center gap-1.5"
                    href={`/applications/${application.userId}`}
                  >
                    {application.firstName} {application.lastName}
                    <ExternalLink size={16} />
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-foreground transition-transform group-hover:scale-x-100"></span>
                  </Link>
                </TableCell>
                <TableCell className="py-4">{application.email}</TableCell>
                <TableCell className="py-4">
                  <ApplicationStatusModal
                    userId={application.userId}
                    name={`${application.firstName} ${application.lastName}`}
                    email={application.email ?? ""}
                    status={application.internalResult as ApplicationStatus}
                  >
                    <ApplicationStatusModalTrigger
                      status={application.internalResult as ApplicationStatus}
                    />
                  </ApplicationStatusModal>
                </TableCell>
                <TableCell
                  className={`py-4 text-center ${getReviewCountColor(application.reviewCount)}`}
                >
                  {application.reviewCount ?? 0}
                </TableCell>
                <TableCell
                  className={`py-4 text-center ${getRatingColor(application.averageRating)}`}
                >
                  {application.averageRating
                    ? (application.averageRating / 100).toFixed(1)
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
