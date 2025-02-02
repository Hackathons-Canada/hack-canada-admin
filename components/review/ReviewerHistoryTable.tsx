import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <CardTitle>Reviews History</CardTitle>
        <CardDescription>
          Chronological list of applications reviewed by this organizer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 transition-colors hover:bg-muted">
                <TableHead className="py-4 font-semibold">Applicant</TableHead>
                <TableHead className="py-4 text-center font-semibold">
                  Rating
                </TableHead>
                <TableHead className="py-4 text-center font-semibold">
                  Duration (s)
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
                      href={`/applications/${review.applicationId}`}
                      className="text-primary hover:underline"
                    >
                      {review.applicantName}
                    </Link>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {review.rating}/10
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    {review.duration}
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    {new Date(review.reviewedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
