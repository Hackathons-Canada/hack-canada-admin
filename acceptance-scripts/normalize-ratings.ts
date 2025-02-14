import { db } from "@/lib/db";
import { applicationReviews } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { TARGET_AVG, MIN_REVIEWS_THRESHOLD, ZSCORE_THRESHOLD } from "./config";

export async function normalizeRatings(): Promise<void> {
  console.log("Starting rating normalization process...");

  // Step 1: Calculate reviewer statistics (mean, standard deviation, reliability)
  const reviewerStats = await db
    .select({
      reviewerId: applicationReviews.reviewerId,
      avgRating: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
      stdDev: sql<number>`ROUND(STDDEV(${applicationReviews.rating})::numeric, 2)`,
      reviewCount: sql<number>`COUNT(${applicationReviews.id})`,
    })
    .from(applicationReviews)
    .groupBy(applicationReviews.reviewerId)
    .having(sql`COUNT(${applicationReviews.id}) >= ${MIN_REVIEWS_THRESHOLD}`)
    .execute();

  // Calculate global statistics
  const globalStats = await db
    .select({
      avgRating: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
      stdDev: sql<number>`ROUND(STDDEV(${applicationReviews.rating})::numeric, 2)`,
    })
    .from(applicationReviews)
    .execute();

  const globalAvg = globalStats[0]?.avgRating || TARGET_AVG;
  const globalStdDev = globalStats[0]?.stdDev || 1;

  console.log(`Global average rating: ${globalAvg}`);
  console.log(`Global standard deviation: ${globalStdDev}`);

  // Step 2: Process each reviewer's ratings
  for (const reviewer of reviewerStats) {
    // Calculate z-score for reviewer's average
    const zScore = (reviewer.avgRating - globalAvg) / globalStdDev;

    // Calculate reliability weight based on review count and consistency
    const reliabilityWeight = Math.min(
      1.0,
      (reviewer.reviewCount / MIN_REVIEWS_THRESHOLD) *
        (1 / (1 + Math.abs(zScore))),
    );

    // Calculate adjusted rating transformation
    const baseAdjustment = TARGET_AVG - reviewer.avgRating;
    const weightedAdjustment = baseAdjustment * reliabilityWeight;

    // Update adjusted_rating for all reviews by this reviewer
    await db.execute(sql`
      UPDATE "applicationReview"
      SET adjusted_rating = ROUND(
        LEAST(10::numeric, GREATEST(0::numeric,
          CASE
            WHEN ABS((${applicationReviews.rating}::numeric - ${reviewer.avgRating}::numeric) / NULLIF(${reviewer.stdDev}::numeric, 0)) > ${ZSCORE_THRESHOLD}::numeric
            THEN ${reviewer.avgRating}::numeric -- For outliers, use reviewer's average
            ELSE ${applicationReviews.rating}::numeric + ${weightedAdjustment}::numeric
          END
        ))::numeric, 2)
      WHERE "reviewerId" = ${reviewer.reviewerId}
    `);

    console.log(
      `Reviewer ${reviewer.reviewerId}: Avg=${reviewer.avgRating}, Reviews=${reviewer.reviewCount}, Adjustment=${weightedAdjustment.toFixed(2)}`,
    );
  }

  // Step 3: Handle applications without normalized ratings
  await db.execute(sql`
    UPDATE "applicationReview"
    SET adjusted_rating = rating
    WHERE adjusted_rating IS NULL
  `);

  // Step 4: Update average ratings in hackerApplications
  await db.execute(sql`
    UPDATE "hackerApplication" ha
    SET "averageRating" = (
      SELECT ROUND(AVG(ar.adjusted_rating)::numeric, 2)
      FROM "applicationReview" ar
      WHERE ar."applicationId" = ha.id
    )
    WHERE EXISTS (
      SELECT 1
      FROM "applicationReview" ar
      WHERE ar."applicationId" = ha.id
    )
  `);

  console.log("Rating normalization completed successfully.");
}
