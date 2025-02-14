import { db } from "@/lib/db";
import { applicationReviews, hackerApplications, users } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { eq, and } from "drizzle-orm";
import { MIN_REVIEWS_THRESHOLD } from "./config";
import * as fs from "fs/promises";

export async function getTopApplicantsList(
  count: number,
): Promise<Array<{ firstName: string; email: string }>> {
  // Get top applications based on normalized ratings and review count
  return db
    .select({
      firstName: users.name,
      email: users.email,
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
    .groupBy(users.name, users.email, hackerApplications.createdAt)
    .having(sql`COUNT(${applicationReviews.id}) >= ${MIN_REVIEWS_THRESHOLD}`)
    .orderBy(
      sql`COALESCE(AVG(${applicationReviews.adjusted_rating}), 0) DESC`,
      hackerApplications.createdAt,
    )
    .limit(count)
    .execute();
}

export async function saveApplicantsToFile(
  applicants: Array<{ firstName: string; email: string }>,
) {
  const content = applicants
    .map(
      (applicant) => `${applicant.firstName.split(" ")[0]},${applicant.email}`,
    )
    .join("\n");

  await fs.writeFile("top-applicants.csv", "First Name,Email\n" + content);
  return true;
}
