import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Review {
  applicationId: string;
  applicantName: string;
  rating: number;
  reviewedAt: Date;
  duration: number;
}

interface ReviewerHistoryTableProps {
  reviews: Review[];
}

export default function ReviewerHistoryTable({
  reviews,
}: ReviewerHistoryTableProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h3 className="font-medium md:text-lg">Reviews History</h3>
        <p className="text-xs text-muted-foreground md:text-sm">
          Chronological list of applications reviewed by this organizer
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
              <TableHead className="py-4 font-semibold">Applicant</TableHead>
              <TableHead className="py-4 text-center font-semibold">
                Rating
              </TableHead>
              <TableHead className="py-4 text-center font-semibold">
                Time Spent
              </TableHead>
              <TableHead className="py-4 text-right font-semibold">
                Review Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review, index) => (
              <TableRow
                key={index}
                className="transition-colors hover:bg-muted/50"
              >
                <TableCell className="py-4">
                  <Link
                    className="group relative flex w-fit items-center gap-1.5"
                    href={`/applications/${review.applicationId}`}
                  >
                    {review.applicantName}
                    <ExternalLink size={16} />
                    <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-foreground transition-transform group-hover:scale-x-100"></span>
                  </Link>
                </TableCell>
                <TableCell className="py-4 text-center">
                  {review.rating}/10
                </TableCell>
                <TableCell className="py-4 text-center">
                  {Math.floor(review.duration / 60)} min{" "}
                  {Math.round(review.duration % 60)} secs
                </TableCell>
                <TableCell className="py-4 text-right">
                  {formatDate(review.reviewedAt.toString())}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
