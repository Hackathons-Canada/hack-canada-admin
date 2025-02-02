import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applicationReviews, users, hackerApplications } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { Suspense } from "react";
import ReviewerSelector from "@/components/review/ReviewerSelector";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";

interface ReviewerStats {
  reviewerId: string;
  reviewCount: number;
  timeSpent: string;
  averageRating: number;
  applicationsReviewed: {
    applicantName: string;
    rating: number;
    reviewedAt: Date;
  }[];
}

export default async function ReviewerStatsPage({
  searchParams,
}: {
  searchParams: { reviewer?: string };
}) {
  const user = await getCurrentUser();

  if (!user?.id || !isAdmin(user.role)) {
    redirect("/");
  }

  // Get all reviewers
  const reviewers = await db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(or(eq(users.role, "organizer"), eq(users.role, "admin")))
    .orderBy(users.name);

  // Get reviewer stats if one is selected
  const selectedReviewer = searchParams.reviewer;
  let reviewerStats: ReviewerStats | null = null;

  if (selectedReviewer) {
    const reviews = await db
      .select({
        reviewerId: applicationReviews.reviewerId,
        reviewCount: sql<number>`COUNT(*)`,
        timeSpent: sql<string>`
          CONCAT(
            EXTRACT(HOUR FROM SUM(${applicationReviews.updatedAt} - ${applicationReviews.createdAt}))::integer,
            ' hrs ',
            EXTRACT(MINUTE FROM SUM(${applicationReviews.updatedAt} - ${applicationReviews.createdAt}))::integer,
            ' mins'
          )
        `,
        averageRating: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
        applicationsReviewed: sql<
          {
            applicantId: string;
            applicantName: string;
            rating: number;
            reviewedAt: Date;
          }[]
        >`
          json_agg(
            json_build_object(
              'applicantId', ${hackerApplications.id},
              'applicantName', CONCAT(${hackerApplications.firstName}, ' ', ${hackerApplications.lastName}),
              'rating', ${applicationReviews.rating},
              'reviewedAt', ${applicationReviews.createdAt}
            )
            ORDER BY ${applicationReviews.createdAt} DESC
          )
        `,
      })
      .from(applicationReviews)
      .innerJoin(
        hackerApplications,
        eq(hackerApplications.id, applicationReviews.applicationId),
      )
      .where(eq(applicationReviews.reviewerId, selectedReviewer))
      .groupBy(applicationReviews.reviewerId)
      .execute();

    if (reviews.length > 0) {
      reviewerStats = reviews[0];
    }
  }

  return (
    <Container className="space-y-10">
      <PageBanner
        heading="Reviewer Statistics"
        subheading="Track individual reviewer performance and statistics"
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select an Organizer to View Stats</CardTitle>
            <CardDescription>
              Choose an organizer from the dropdown below to view their review
              statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewerSelector
              selectedReviewer={selectedReviewer}
              reviewers={reviewers}
            />
          </CardContent>
        </Card>

        {reviewerStats ? (
          <Suspense fallback={<div>Loading stats...</div>}>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Total Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {reviewerStats.reviewCount}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Time Spent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {reviewerStats.timeSpent}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Average Rating Given
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {reviewerStats.averageRating}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Reviews History</CardTitle>
                  <CardDescription>
                    Chronological list of applications reviewed by this
                    organizer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead className="text-center">Rating</TableHead>
                          <TableHead className="text-right">
                            Review Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reviewerStats.applicationsReviewed.map(
                          (review, index) => (
                            <TableRow key={index}>
                              <TableCell>{review.applicantName}</TableCell>
                              <TableCell className="text-center">
                                {review.rating}/5
                              </TableCell>
                              <TableCell className="text-right">
                                {new Date(review.reviewedAt).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Suspense>
        ) : selectedReviewer ? (
          <Card>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                No reviews found for this organizer
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </Container>
  );
}
