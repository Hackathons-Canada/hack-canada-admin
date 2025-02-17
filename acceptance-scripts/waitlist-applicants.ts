import * as fs from "fs/promises";
import * as path from "path";
import { db } from "@/lib/db";
import { hackerApplications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getTopApplicantsList } from "./list-top-applicants";
import { normalizeRatings } from "./normalize-ratings";
import { loadProgress, saveProgress } from "./progress";

interface WaitlistedApplicant {
  userId: string;
  firstName: string;
  email: string;
  avgRating: number;
}

async function waitlistApplicant(applicant: WaitlistedApplicant) {
  try {
    console.log(`Processing ${applicant.firstName} (${applicant.email})...`);

    await db.transaction(async (tx) => {
      // Update user status
      await tx
        .update(users)
        .set({
          applicationStatus: "waitlisted",
        })
        .where(eq(users.id, applicant.userId));

      // Update application status
      await tx
        .update(hackerApplications)
        .set({
          internalResult: "waitlisted",
        })
        .where(eq(hackerApplications.userId, applicant.userId));
    });

    console.log(`Successfully waitlisted ${applicant.firstName}`);
    return true;
  } catch (error) {
    console.error(`Failed to waitlist ${applicant.firstName}:`, error);
    return false;
  }
}

async function main() {
  try {
    // First check if ratings need to be normalized
    let progress = await loadProgress();

    if (progress && progress.normalizedAt) {
      console.log(`Last normalization was at ${progress.normalizedAt}`);
      const timeSinceNormalization =
        Date.now() - new Date(progress.normalizedAt).getTime();
      const hoursSinceNormalization = timeSinceNormalization / (1000 * 60 * 60);

      if (hoursSinceNormalization > 1) {
        console.log(
          "More than 1 hour since last normalization, normalizing ratings...",
        );
        await normalizeRatings();
        progress.normalizedAt = new Date().toISOString();
        await saveProgress(progress);
      } else {
        console.log("Recent normalization found, skipping...");
      }
    } else {
      console.log("No previous normalization found, normalizing ratings...");
      await normalizeRatings();
      progress = {
        totalToAccept: 0,
        acceptedCount: 0,
        normalizedAt: new Date().toISOString(),
      };
      await saveProgress(progress);
    }

    // Get top 50 pending applicants based on normalized ratings
    console.log("\nFetching top 50 applicants...");
    const applicants = await getTopApplicantsList(50);
    console.log(`Found ${applicants.length} applicants to process`);

    let successCount = 0;

    for (let i = 0; i < applicants.length; i++) {
      const applicant = applicants[i];
      console.log(`\nProcessing ${i + 1}/${applicants.length}`);
      console.log(
        `Applicant: ${applicant.firstName} (${applicant.email}) - ${applicant.avgRating}/10 normalized rating`,
      );

      const success = await waitlistApplicant(applicant);

      if (success) {
        successCount++;
      }
    }

    console.log("\nWaitlist process complete:");
    console.log(
      `Successfully waitlisted: ${successCount}/${applicants.length}`,
    );
    console.log(`Failed: ${applicants.length - successCount}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\nSuccess - Script completed");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(
      "Fatal error:",
      error instanceof Error ? error.message : "Unknown error occurred",
    );
    process.exit(1);
  });
