import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { and, eq, lt, sql } from "drizzle-orm";
import { applicationReviews, hackerApplications } from "@/lib/db/schema";
import ReviewInterface from "@/components/review/ReviewInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ApplicationInfo from "@/components/ApplicationInfo";
import { Suspense } from "react";
import { isReviewer } from "@/lib/utils";
import LoadingApplication from "./loading-application";
import LoadingStats from "./loading-stats";

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}

export default async function ReviewsPage() {
  const user = await getCurrentUser();

  if (!user?.id || !isReviewer(user.role)) {
    redirect("/");
  }

  // Fetch application and review stats in parallel
  const [nextApplication, reviewStats] = await Promise.all([
    db
      .select()
      .from(hackerApplications)
      .where(
        and(
          lt(hackerApplications.reviewCount, 5),
          eq(hackerApplications.submissionStatus, "submitted"),
          eq(hackerApplications.internalResult, "pending"),
          sql`NOT EXISTS (
            SELECT 1 FROM ${applicationReviews}
            WHERE ${applicationReviews.applicationId} = ${hackerApplications.id}
            AND ${applicationReviews.reviewerId} = ${user.id}
          )`,
        ),
      )
      .orderBy(sql`${hackerApplications.reviewCount} ASC, RANDOM()`)
      .limit(1)
      .execute(),
    // Get organizers's review stats using aggregates
    db
      .select({
        count: sql<number>`count(*)`,
        average: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
      })
      .from(applicationReviews)
      .where(eq(applicationReviews.reviewerId, user.id))
      .execute(),
  ]);

  const stats: ReviewStats = {
    totalReviews: reviewStats[0].count ?? 0,
    averageRating: reviewStats[0].average ?? 0,
  };

  const application = nextApplication[0] ?? null;

  return (
    <div className="container max-w-screen-lg space-y-6 py-6 md:space-y-10">
      <Suspense fallback={<LoadingStats />}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Review Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Total Reviews</p>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Avg. Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Suspense>

      {/* Application Review Section */}
      <Suspense fallback={<LoadingApplication />}>
        {application ? (
          <div className="space-y-4 md:space-y-8">
            <ApplicationInfo hacker={application} hideBackgroundInfo />
            <ReviewInterface initialApplication={application} />
          </div>
        ) : (
          <Card className="p-6">
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No more applications to review!
              </p>
            </div>
          </Card>
        )}
      </Suspense>
    </div>
  );
}
