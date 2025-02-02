import { db } from "@/lib/db";
import { applicationReviews, users, hackerApplications } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { sql } from "drizzle-orm";

interface ReviewerStats {
  reviewerId: string;
  reviewCount: number;
  timeSpent: string;
  averageRating: number;
  applicationsReviewed: {
    applicationId: string;
    applicantName: string;
    rating: number;
    reviewedAt: Date;
    duration: number;
  }[];
}

interface Reviewer {
  id: string;
  name: string;
}

export async function getReviewers(): Promise<Reviewer[]> {
  return db
    .select({
      id: users.id,
      name: users.name,
    })
    .from(users)
    .where(or(eq(users.role, "organizer"), eq(users.role, "admin")))
    .orderBy(users.name);
}

export async function getReviewerStats(
  reviewerId: string,
): Promise<ReviewerStats | null> {
  const reviews = await db
    .select({
      reviewerId: applicationReviews.reviewerId,
      reviewCount: sql<number>`COUNT(*)`,
      timeSpent: sql<string>`
        CONCAT(
          FLOOR(SUM(${applicationReviews.reviewDuration})::numeric / 60)::integer,
          ' min ',
          MOD(ROUND(SUM(${applicationReviews.reviewDuration}))::integer, 60),
          ' secs'
        )
      `,
      averageRating: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
      applicationsReviewed: sql<
        {
          applicationId: string;
          applicantName: string;
          rating: number;
          reviewedAt: Date;
          duration: number;
        }[]
      >`
        json_agg(
          json_build_object(
            'applicationId', ${hackerApplications.id},
            'applicantName', CONCAT(${hackerApplications.firstName}, ' ', ${hackerApplications.lastName}),
            'rating', ${applicationReviews.rating},
            'reviewedAt', ${applicationReviews.createdAt},
            'duration', ${applicationReviews.reviewDuration}
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
    .where(eq(applicationReviews.reviewerId, reviewerId))
    .groupBy(applicationReviews.reviewerId)
    .execute();

  return reviews.length > 0 ? reviews[0] : null;
}
