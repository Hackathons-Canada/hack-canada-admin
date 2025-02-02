import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { hackerApplications, applicationReviews } from "@/lib/db/schema";
import { isAdmin, isReviewer } from "@/lib/utils";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";

interface SystemStatus {
  pendingReviews: number;
  finishedReviews: number;
  userReviewCount: number;
  canReviewMore: boolean;
}

export default async function ReviewApplicationsPage() {
  const user = await getCurrentUser();

  if (!user?.id || !isReviewer(user.role)) {
    redirect("/");
  }

  // Fetch system stats and user review count in parallel
  const [systemStats, userReviews] = await Promise.all([
    db
      .select({
        pendingReviews: sql<number>`
          COUNT(DISTINCT CASE
            WHEN ${hackerApplications.reviewCount} < 3
            AND ${hackerApplications.submissionStatus} = 'submitted'
            AND ${hackerApplications.internalResult} = 'pending'
            THEN ${hackerApplications.id}
          END)`,
        finishedReviews: sql<number>`
          COUNT(DISTINCT CASE
            WHEN ${hackerApplications.reviewCount} >= 3
            THEN ${hackerApplications.id}
          END)`,
      })
      .from(hackerApplications)
      .execute(),
    db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(applicationReviews)
      .where(eq(applicationReviews.reviewerId, user.id))
      .execute(),
  ]);

  const status: SystemStatus = {
    pendingReviews: systemStats[0]?.pendingReviews ?? 0,
    finishedReviews: systemStats[0]?.finishedReviews ?? 0,
    userReviewCount: userReviews[0]?.count ?? 0,
    canReviewMore: (userReviews[0]?.count ?? 0) < 50,
  };

  return (
    <Container className="space-y-6 md:space-y-10">
      <PageBanner
        heading="Review Applications"
        subheading="Review submitted applications. Each application requires three independent reviews for a decision."
      />

      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">Review Process</h3>
              <p className="text-muted-foreground">
                Review applications thoroughly and fairly. Each application
                requires three independent reviews before a decision can be
                made.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Rating Criteria</h3>
              <ul className="list-inside list-disc text-muted-foreground">
                <li>Consider technical experience and project history</li>
                <li>Evaluate enthusiasm and willingness to learn</li>
                <li>
                  Assess potential contribution to the hackathon community
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{status.pendingReviews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completed Reviewing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{status.finishedReviews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{status.userReviewCount}</p>
              {!status.canReviewMore && (
                <p className="text-sm text-destructive">
                  Review limit reached (50)
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {/* Primary Action */}
          <Button
            asChild
            size="lg"
            className="h-full min-h-28 text-lg font-semibold tracking-wide transition-all duration-200"
            disabled={status.pendingReviews === 0 || !status.canReviewMore}
          >
            <Link href="/review-applications/review">
              {!status.canReviewMore
                ? "Review Limit Reached"
                : status.pendingReviews === 0
                  ? "No Applications Available"
                  : "Start Reviewing Applications"}
            </Link>
          </Button>

          {/* Secondary Actions */}
          {isAdmin(user.role) && (
            <div className="flex flex-col gap-4 xl:col-span-2 xl:flex-row">
              <Button
                asChild
                variant="outline"
                className="flex-1 py-4 xl:h-full"
              >
                <Link href="/review-applications/admin/applications">
                  Accept/Reject Applications
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 py-4 xl:h-full"
              >
                <Link href="/review-applications/admin/reviewers">
                  Individual Reviewer Stats
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
