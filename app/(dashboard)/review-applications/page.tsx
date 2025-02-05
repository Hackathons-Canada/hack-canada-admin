import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { eq, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { hackerApplications, applicationReviews } from "@/lib/db/schema";
import { cn, isAdmin, isReviewer } from "@/lib/utils";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import { Trophy } from "lucide-react";
import ReviewGuidelines from "@/components/review/ReviewGuidelines";

interface SystemStatus {
  pendingReviews: number;
  finishedReviews: number;
  userReviewCount: number;
  canReviewMore: boolean;
}

const MIN_REVIEW_LIMIT = 50;
const MAX_REVIEW_LIMIT = Math.ceil(MIN_REVIEW_LIMIT * 2.5);

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
            WHEN ${hackerApplications.reviewCount} < 5
            AND ${hackerApplications.submissionStatus} = 'submitted'
            AND ${hackerApplications.internalResult} = 'pending'
            THEN ${hackerApplications.id}
          END)`,
        finishedReviews: sql<number>`
          COUNT(DISTINCT CASE
            WHEN ${hackerApplications.reviewCount} = 5
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
    canReviewMore: (userReviews[0]?.count ?? 0) < MAX_REVIEW_LIMIT,
  };

  return (
    <Container className="space-y-6 md:space-y-10">
      <PageBanner
        heading="Review Applications"
        subheading="Review submitted applications. Each application requires five independent reviews for a decision."
      />

      <div className="space-y-4 md:space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 xl:flex-row-reverse">
          <ReviewGuidelines />
          <div className="group relative flex min-h-28 w-full flex-1 overflow-hidden rounded-[6px] p-1 shadow-[0px_0px_0x_white] transition-shadow delay-200 duration-500 ease-in hover:shadow-[-12px_0px_32px_#ec6aff77,12px_0px_32px_#00d3f477] xl:w-1/3">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-fuchsia-400" />
            <Link
              href={
                status.pendingReviews > 0 && status.canReviewMore
                  ? "/review-applications/review"
                  : ""
              }
              className={cn(
                "relative flex w-full items-center justify-center rounded-[6px] border-white/50 bg-white/50 backdrop-blur-sm transition-all duration-500 hover:border-white/80 hover:bg-white/60 hover:shadow-md",
                (!status.canReviewMore || status.pendingReviews === 0) &&
                  "cursor-not-allowed opacity-50 hover:shadow-none hover:before:scale-x-0 hover:after:opacity-0",
              )}
            >
              <span className="text-center text-xl font-semibold tracking-wider text-black xl:w-36 xl:text-2xl 2xl:w-52 2xl:text-3xl">
                {!status.canReviewMore
                  ? "Review Limit Reached"
                  : status.pendingReviews === 0
                    ? "No Applications Available"
                    : "Start Reviewing Applications"}
              </span>
            </Link>
          </div>
        </div>

        <Link
          href="/reviewers/leaderboards"
          className="flex h-12 w-full items-center justify-center rounded-md border-2 border-primary/50 bg-primary/5 font-medium tracking-wider text-sky-500 transition duration-300 hover:border-primary hover:bg-primary/15 hover:text-sky-600 dark:text-blue-400 dark:hover:text-blue-300 md:h-14 md:text-lg xl:h-16 xl:text-xl"
        >
          <Trophy className="mr-2 inline-block size-4 stroke-[3px] md:size-5" />
          Reviewer Leaderboards
          <Trophy className="ml-2 inline-block size-4 stroke-[3px] md:size-5" />
        </Link>

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
                  Review limit reached ({MAX_REVIEW_LIMIT} reviews)
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {isAdmin(user.role) && (
          <div className="rounded-md border p-3 md:p-6">
            <p className="mb-4 font-medium md:text-lg">Admin-Only Actions</p>

            <div className="flex flex-col gap-2.5 xl:col-span-2 xl:flex-row">
              <Button asChild variant="default">
                <Link href="/review-applications/decisions">
                  Accept/Reject Applications
                </Link>
              </Button>
              <Button asChild variant="default">
                <Link href="/reviewers">Individual Reviewer Stats</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
