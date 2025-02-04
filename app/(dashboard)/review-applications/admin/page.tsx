import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { applicationReviews, hackerApplications } from "@/lib/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/lib/utils";

interface ReviewAnalytics {
  organizerStats: {
    reviewerId: string;
    totalReviews: number;
    averageRating: number;
    averageTimePerReview: number;
  }[];
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  reviewProgress: {
    totalApplications: number;
    reviewedApplications: number;
    completedReviews: number;
  };
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user?.id || !isAdmin(user.role)) {
    redirect("/");
  }

  // Fetch analytics data
  const [organizerStats, ratingDistribution, reviewProgress] =
    await Promise.all([
      // Organizer performance stats
      db
        .select({
          reviewerId: applicationReviews.reviewerId,
          totalReviews: sql<number>`COUNT(*)`,
          averageRating: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
          averageTimePerReview: sql<number>`
        ROUND(
          AVG(
            EXTRACT(EPOCH FROM (${applicationReviews.updatedAt} - ${applicationReviews.createdAt}))
          )::numeric / 60,
          2
        )`,
        })
        .from(applicationReviews)
        .groupBy(applicationReviews.reviewerId)
        .execute(),

      // Rating distribution
      db
        .select({
          rating: applicationReviews.rating,
          count: sql<number>`COUNT(*)`,
        })
        .from(applicationReviews)
        .groupBy(applicationReviews.rating)
        .orderBy(applicationReviews.rating)
        .execute(),

      // Review progress
      db
        .select({
          totalApplications: sql<number>`COUNT(DISTINCT ${hackerApplications.id})`,
          reviewedApplications: sql<number>`
        COUNT(DISTINCT CASE 
          WHEN ${hackerApplications.reviewCount} > 0 
          THEN ${hackerApplications.id}
        END)`,
          completedReviews: sql<number>`
        COUNT(DISTINCT CASE 
          WHEN ${hackerApplications.reviewCount} = 5 
          THEN ${hackerApplications.id}
        END)`,
        })
        .from(hackerApplications)
        .execute(),
    ]);

  const analytics: ReviewAnalytics = {
    organizerStats: organizerStats.map((stat) => ({
      reviewerId: stat.reviewerId,
      totalReviews: stat.totalReviews ?? 0,
      averageRating: stat.averageRating ?? 0,
      averageTimePerReview: stat.averageTimePerReview ?? 0,
    })),
    ratingDistribution: ratingDistribution.map((dist) => ({
      rating: dist.rating,
      count: dist.count ?? 0,
    })),
    reviewProgress: {
      totalApplications: reviewProgress[0]?.totalApplications ?? 0,
      reviewedApplications: reviewProgress[0]?.reviewedApplications ?? 0,
      completedReviews: reviewProgress[0]?.completedReviews ?? 0,
    },
  };

  return (
    <div className="container max-w-screen-xl space-y-8 py-6">
      {/* Review Progress */}
      <section id="progress">
        <h2 className="mb-4 text-2xl font-bold">Review Progress</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {analytics.reviewProgress.totalApplications}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {analytics.reviewProgress.reviewedApplications -
                  analytics.reviewProgress.completedReviews}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completed Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {analytics.reviewProgress.completedReviews}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Organizer Performance */}
      <section id="organizers">
        <h2 className="mb-4 text-2xl font-bold">Organizer Performance</h2>
        <Card>
          <CardHeader>
            <CardTitle>Review Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2">Reviewer ID</th>
                    <th className="px-4 py-2">Total Reviews</th>
                    <th className="px-4 py-2">Avg. Rating</th>
                    <th className="px-4 py-2">Avg. Time (min)</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.organizerStats.map((stat) => (
                    <tr key={stat.reviewerId} className="border-b">
                      <td className="px-4 py-2">{stat.reviewerId}</td>
                      <td className="px-4 py-2">{stat.totalReviews}</td>
                      <td className="px-4 py-2">{stat.averageRating}</td>
                      <td className="px-4 py-2">{stat.averageTimePerReview}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Rating Distribution */}
      <section id="ratings">
        <h2 className="mb-4 text-2xl font-bold">Rating Distribution</h2>
        <Card>
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {analytics.ratingDistribution.map((dist) => (
                <div key={dist.rating} className="flex items-center gap-4">
                  <div className="w-12 text-right">{dist.rating}</div>
                  <div className="h-4 flex-1 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${(dist.count / Math.max(...analytics.ratingDistribution.map((d) => d.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="w-12">{dist.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* System Tools */}
      <section id="tools">
        <h2 className="mb-4 text-2xl font-bold">System Tools</h2>
        <Card>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <Button variant="outline">Export Review Data</Button>
            <Button variant="outline">View Audit Logs</Button>
            <Button variant="destructive">Reset All Reviews</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
