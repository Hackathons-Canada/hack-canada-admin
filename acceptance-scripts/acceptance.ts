import { db } from "@/lib/db";
import { applicationReviews, hackerApplications, users } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { eq, and } from "drizzle-orm";
import { createAuditLog } from "@/lib/db/queries/audit-log";
import { MIN_REVIEWS_THRESHOLD } from "./config";

export async function getAcceptanceList(
  count: number,
): Promise<Array<{ userId: string; applicationId: string }>> {
  // Get top applications based on normalized ratings and review count
  return db
    .select({
      userId: hackerApplications.userId,
      applicationId: hackerApplications.id,
    })
    .from(hackerApplications)
    .innerJoin(users, eq(users.id, hackerApplications.userId))
    .leftJoin(
      applicationReviews,
      eq(applicationReviews.applicationId, hackerApplications.id),
    )
    .where(
      and(
        eq(users.applicationStatus, "pending"),
        eq(hackerApplications.submissionStatus, "submitted"),
      ),
    )
    .groupBy(
      hackerApplications.id,
      hackerApplications.userId,
      hackerApplications.createdAt,
    )
    .having(sql`COUNT(${applicationReviews.id}) >= ${MIN_REVIEWS_THRESHOLD}`)
    .orderBy(
      sql`COALESCE(AVG(${applicationReviews.adjusted_rating}), 0) DESC`,
      hackerApplications.createdAt,
    )
    .limit(count)
    .execute();
}

export async function acceptApplicant(
  userId: string,
  applicationId: string,
): Promise<boolean> {
  try {
    await db.transaction(async (tx) => {
      // Create audit log for the status change
      await createAuditLog(
        {
          userId: "system",
          action: "update",
          entityType: "user",
          entityId: userId,
          previousValue: { applicationStatus: "pending" },
          newValue: { applicationStatus: "accepted" },
          metadata: {
            description: `Applicant was automatically accepted by batch processing script`,
            updatedBy: "system",
            timestamp: new Date().toISOString(),
          },
        },
        tx,
      );

      await tx
        .update(users)
        .set({
          applicationStatus: "accepted",
          acceptedAt: new Date(),
        })
        .where(eq(users.id, userId));

      await tx
        .update(hackerApplications)
        .set({
          internalResult: "accepted",
        })
        .where(eq(hackerApplications.id, applicationId));
    });

    return true;
  } catch (error) {
    console.error(`Error accepting applicant ${userId}:`, error);
    return false;
  }
}
