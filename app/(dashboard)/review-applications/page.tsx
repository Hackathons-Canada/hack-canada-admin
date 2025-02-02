import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { applicationReviews, hackerApplications } from "@/lib/db/schema";
import { isAdmin, isReviewer } from "@/lib/utils";

interface SystemStatus {
  pendingReviews: number;
}

export default async function ReviewApplicationsPage() {
  const user = await getCurrentUser();

  if (!user?.id || !isReviewer(user.role)) {
    redirect("/");
  }

  // Fetch pending reviews count
  const [systemStats] = await db
    .select({
      pendingReviews: sql<number>`
        COUNT(DISTINCT CASE
          WHEN ${hackerApplications.reviewCount} < 3
          AND ${hackerApplications.submissionStatus} = 'submitted'
          AND ${hackerApplications.internalResult} = 'pending'
          THEN ${hackerApplications.id}
        END)`,
    })
    .from(hackerApplications)
    .execute();

  const status: SystemStatus = {
    pendingReviews: systemStats?.pendingReviews ?? 0,
  };

  return (
    <div className="container max-w-screen-xl space-y-8 py-6">
      {/* Instructional Content */}
      <Card>
        <CardHeader>
          <CardTitle>Review Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Review Process</h3>
            <p className="text-muted-foreground">
              Review applications thoroughly and fairly. Each application
              requires three independent reviews before a decision can be made.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Rating Criteria</h3>
            <ul className="list-inside list-disc text-muted-foreground">
              <li>Consider technical experience and project history</li>
              <li>Evaluate enthusiasm and willingness to learn</li>
              <li>Assess potential contribution to the hackathon community</li>
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
      </div>

      {/* Role-based CTAs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4">
            {isAdmin(user.role) ? (
              <>
                <div className="grid w-full max-w-2xl gap-4">
                  <Button asChild size="lg">
                    <Link href="/review-applications/admin/applications">
                      Manage Applications
                    </Link>
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button asChild variant="secondary">
                      <Link href="/review-applications/admin/reviewers">
                        Review Stats
                      </Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link href="/review-applications/review">
                        Review Applications
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            ) : isReviewer(user.role) ? (
              <Button
                asChild
                size="lg"
                className="w-full max-w-md"
                disabled={status.pendingReviews === 0}
              >
                <Link href="/review-applications/review">
                  {status.pendingReviews === 0
                    ? "No Applications Available"
                    : "Start Reviewing"}
                </Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
