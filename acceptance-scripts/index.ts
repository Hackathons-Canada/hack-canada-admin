import { rl, question } from "./cli";
import { loadProgress, saveProgress } from "./progress";
import { normalizeRatings } from "./normalize-ratings";
import { getAcceptanceList, acceptApplicant } from "./acceptance";
// Import for listing applicants (comment out if going back to accepting applicants)
import {
  getTopApplicantsList,
  saveApplicantsToFile,
} from "./list-top-applicants";

async function main() {
  let progress = await loadProgress();

  if (progress && progress.normalizedAt) {
    const continueNormalization = await question(
      `Ratings were previously normalized at ${progress.normalizedAt}. Normalize again? (y/n): `,
    );
    if (continueNormalization.toLowerCase() === "y") {
      await normalizeRatings();
      progress.normalizedAt = new Date().toISOString();
      await saveProgress(progress);
    }
  } else {
    await normalizeRatings();
    progress = {
      totalToAccept: 0,
      acceptedCount: 0,
      normalizedAt: new Date().toISOString(),
    };
    await saveProgress(progress);
  }

  // Ask for number of applicants to accept
  if (!progress || progress.acceptedCount === 0) {
    const baseCountStr = await question(
      "How many applicants do you want to accept? ",
    );
    const baseCount = parseInt(baseCountStr, 10);

    const extraPercentStr = await question(
      "What percentage extra should we accept (e.g., 10 for 10%)? ",
    );
    const extraPercent = parseInt(extraPercentStr, 10) || 0;

    const totalToAccept = Math.ceil(baseCount * (1 + extraPercent / 100));
    progress = {
      ...progress,
      totalToAccept,
      acceptedCount: 0,
    };

    console.log(
      `Will accept ${totalToAccept} applicants (${baseCount} + ${extraPercent}% buffer)`,
    );
    await saveProgress(progress);
  } else {
    console.log(
      `Continuing previous run: ${progress.acceptedCount}/${progress.totalToAccept} already accepted`,
    );
  }

  // Get applications to accept
  const remaining = progress.totalToAccept - progress.acceptedCount;
  if (remaining <= 0) {
    console.log("All applicants have already been accepted!");
    rl.close();
    return;
  }

  console.log(`Getting top ${remaining} applicants...`);

  // Comment out the next block to switch back to accepting applicants
  const applicantsToList = await getTopApplicantsList(remaining);
  console.log(`Found ${applicantsToList.length} eligible applicants`);

  // Save applicants to file
  const success = await saveApplicantsToFile(applicantsToList);
  if (success) {
    console.log(
      "Successfully saved applicant information to top-applicants.csv",
    );
  }

  /* Uncomment this block to switch back to accepting applicants
  const applicantsToAccept = await getAcceptanceList(remaining);
  console.log(`Found ${applicantsToAccept.length} eligible applicants`);

  // Process acceptances
  let successCount = 0;
  let index = 0;
  for (const applicant of applicantsToAccept) {
    const current = progress.acceptedCount + index + 1;
    console.log(
      `Processing applicant ${current}/${progress.totalToAccept} (ID: ${applicant.userId})...`,
    );

    const success = await acceptApplicant(
      applicant.userId,
      applicant.applicationId,
    );
    if (success) {
      successCount++;
      progress.acceptedCount++;
      progress.lastProcessedId = applicant.userId;
      await saveProgress(progress);
    }
    index++;
  }

  console.log(
    `Acceptance process complete. Successfully accepted ${successCount} new applicants.`,
  );
  console.log(
    `Total accepted: ${progress.acceptedCount}/${progress.totalToAccept}`,
  );

  if (progress.acceptedCount < progress.totalToAccept) {
    console.log(
      `Note: Could not find enough eligible applicants to reach target of ${progress.totalToAccept}`,
    );
  }
  */

  rl.close();
}

main()
  .then(() => {
    console.log("Success");
  })
  .catch((error) => {
    console.error("Fatal error:", error);
  })
  .finally(() => {
    rl.close();
    process.exit(1);
  });
