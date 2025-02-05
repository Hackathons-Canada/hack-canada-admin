import { eq, sql } from "drizzle-orm";
import { applicationReviews, users } from "@/lib/db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/lib/db/schema";

console.log("Normalizing ratings...");

const client = neon(process.env.DATABASE_URL!);

const db = drizzle(client, { schema });

const TARGET_AVG = 6;

async function normalizeRatings() {
  try {
    // First, get current reviewer averages
    const reviewerStats = await db
      .select({
        reviewerId: applicationReviews.reviewerId,
        name: users.name,
        avgRating: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
        reviewCount: sql<number>`COUNT(${applicationReviews.id})`,
      })
      .from(applicationReviews)
      .leftJoin(users, eq(users.id, applicationReviews.reviewerId))
      .groupBy(applicationReviews.reviewerId, users.name)
      .having(sql`COUNT(${applicationReviews.id}) > 0`)
      .execute();

    // Calculate and apply adjustments for each reviewer
    for (const reviewer of reviewerStats) {
      if (reviewer.reviewCount < 5) {
        console.log(
          `Skipping ${reviewer.name} - insufficient reviews (${reviewer.reviewCount})`,
        );
        continue; // Skip reviewers with too few reviews
      }

      const adjustment = TARGET_AVG - reviewer.avgRating;

      // Update adjusted_rating for all reviews by this reviewer
      await db.execute(sql`
      UPDATE "applicationReview"
      SET adjusted_rating = LEAST(10, GREATEST(0, rating + ${adjustment}))
      WHERE "reviewerId" = ${reviewer.reviewerId}
    `);

      console.log(
        `${reviewer.name}: Original avg: ${reviewer.avgRating}, Adjustment: ${adjustment.toFixed(2)}`,
      );
    }

    // Print final averages after adjustment
    const finalStats = await db
      .select({
        name: users.name,
        originalAvg: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
        adjustedAvg: sql<number>`ROUND(AVG(${applicationReviews.adjusted_rating})::numeric, 2)`,
        reviewCount: sql<number>`COUNT(${applicationReviews.id})`,
      })
      .from(applicationReviews)
      .leftJoin(users, eq(users.id, applicationReviews.reviewerId))
      .groupBy(users.name)
      .having(sql`COUNT(${applicationReviews.id}) > 0`)
      .orderBy(sql`COUNT(${applicationReviews.id}) DESC`)
      .execute();

    console.log("\nFinal Statistics:");
    console.log("Reviewer | Reviews | Original Avg | Adjusted Avg");
    console.log("-".repeat(50));
    finalStats.forEach(({ adjustedAvg, name, originalAvg, reviewCount }) => {
      console.log(
        `${String(reviewCount).padEnd(7)} | ` +
          `${name?.padEnd(20)} | ` +
          `${originalAvg.toFixed(2).padEnd(11)} | ` +
          `${adjustedAvg.toFixed(2)}`,
      );
    });
  } catch (error) {
    console.error("Error normalizing ratings:", error);
  }
}

// Execute the normalization
normalizeRatings().catch(console.error);
