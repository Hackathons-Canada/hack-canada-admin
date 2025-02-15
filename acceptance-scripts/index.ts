import { rl, question } from "./cli";
import { loadProgress, saveProgress } from "./progress";
import { normalizeRatings } from "./normalize-ratings";
import {
  getTopApplicantsList,
  saveApplicantsToFile,
} from "./list-top-applicants";
import { acceptApplicant } from "./accept-applicants";

async function main() {
  let progress = await loadProgress();
  let dryRun = false;

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

  // Ask for operation mode
  console.log("\nOperation Modes:");
  console.log(
    "1. Generate List - Creates a CSV file of top applicants based on normalized ratings",
  );
  console.log(
    "   This will export eligible applicants to 'top-applicants.csv' for review",
  );
  console.log(
    "2. Accept Applicants - Processes top applicants based on normalized ratings",
  );
  console.log(
    "   This will send acceptance emails and update applicant statuses directly\n",
  );

  const mode = await question("Choose operation mode (1 or 2): ");

  if (!["1", "2"].includes(mode)) {
    console.log("Invalid mode selected. Please choose 1 or 2.");
    return;
  }

  // Ask about dry run if in accept applicants mode
  if (mode === "2") {
    const dryRunResponse = await question(
      "Do you want to run in dry run mode? No actual emails will be sent or statuses updated (y/n): ",
    );
    dryRun = dryRunResponse.toLowerCase() === "y";

    if (dryRun) {
      console.log("\n⚠️ DRY RUN MODE ENABLED ⚠️");
      console.log("No actual changes will be made to the system.");
      console.log("This is for testing purposes only.\n");
    }
  }

  // Ask for number of applicants to process
  if (!progress || progress.acceptedCount === 0) {
    let baseCount: number;
    while (true) {
      const baseCountStr = await question(
        "How many applicants do you want to process? ",
      );
      baseCount = parseInt(baseCountStr, 10);
      if (!isNaN(baseCount) && baseCount > 0) {
        break;
      }
      console.log("Please enter a valid positive number.");
    }

    let extraPercent: number;
    while (true) {
      const extraPercentStr = await question(
        "What percentage extra should we process (e.g., 10 for 10%)? ",
      );
      extraPercent = parseInt(extraPercentStr, 10);
      if (!isNaN(extraPercent) && extraPercent >= 0) {
        break;
      }
      console.log("Please enter a valid non-negative number.");
    }

    const totalToProcess = Math.ceil(baseCount * (1 + extraPercent / 100));

    // Initialize or update progress state
    progress = {
      normalizedAt: progress?.normalizedAt || new Date().toISOString(),
      totalToAccept: totalToProcess,
      acceptedCount: 0,
      lastProcessedId: undefined,
    };

    console.log("\nProgress Configuration:");
    console.log(`Base applicant count: ${baseCount}`);
    console.log(`Extra buffer: ${extraPercent}%`);
    console.log(`Total to process: ${totalToProcess} applicants`);

    try {
      await saveProgress(progress);
      console.log("Progress state initialized successfully.");
    } catch (error: unknown) {
      console.error(
        "Failed to save progress:",
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      process.exit(1);
    }
  } else {
    console.log(
      `Continuing previous run: ${progress.acceptedCount}/${progress.totalToAccept} already processed`,
    );
  }

  let remaining = progress.totalToAccept - progress.acceptedCount;
  if (remaining <= 0) {
    const continueProcessing = await question(
      "Target number of acceptances reached. Do you want to process more applicants? (y/n): ",
    );
    if (continueProcessing.toLowerCase() !== "y") {
      console.log("Exiting as target has been reached.");
      return;
    }

    // Ask for new batch size when continuing
    while (true) {
      const batchSizeStr = await question(
        "How many additional applicants do you want to process? ",
      );
      const batchSize = parseInt(batchSizeStr, 10);
      if (!isNaN(batchSize) && batchSize > 0) {
        remaining = batchSize;
        // Update total to reflect new batch
        progress.totalToAccept = progress.acceptedCount + batchSize;
        await saveProgress(progress);
        break;
      }
      console.log("Please enter a valid positive number.");
    }
  }

  if (mode === "1") {
    // Generate list mode
    console.log(`Getting top ${remaining} applicants...`);
    const applicantsToList = await getTopApplicantsList(remaining);
    console.log(`Found ${applicantsToList.length} eligible applicants`);

    // Save applicants to file
    const success = await saveApplicantsToFile(applicantsToList);
    if (success) {
      console.log(
        "Successfully saved applicant information to top-applicants.csv",
      );
    }
  } else {
    // Accept applicants mode
    try {
      // Get applicants directly from database
      const applicants = await getTopApplicantsList(remaining);
      console.log(`Found ${applicants.length} applicants to process`);

      let successCount = 0;
      let failureCount = 0;

      console.log("\nStarting acceptance process...");
      if (dryRun) {
        console.log("DRY RUN MODE: No actual changes will be made");
      } else {
        console.log(
          "Progress will be saved automatically after each successful acceptance",
        );
      }
      console.log("----------------------------------------");

      for (let i = 0; i < applicants.length; i++) {
        const applicant = applicants[i];
        const batchProgress = i + 1;
        const overallProgress = progress.acceptedCount + i;
        const percentComplete = Math.min(
          (overallProgress / progress.totalToAccept) * 100,
          100,
        ).toFixed(1);

        console.log(
          `\nProcessing ${batchProgress}/${applicants.length} in current batch (${percentComplete}% overall)`,
        );
        console.log(`Applicant: ${applicant.firstName} (${applicant.email}) - ${applicant.avgRating}/10 rating`);

        try {
          if (dryRun) {
            // Simulate success in dry run mode
            console.log("✓ [DRY RUN] Would accept applicant");
            successCount++;
          } else {
            const success = await acceptApplicant(applicant);
            if (success) {
              successCount++;
              progress.acceptedCount++;
              progress.lastProcessedId = applicant.userId;
              // Save progress after each successful acceptance
              try {
                await saveProgress(progress);
                console.log("✓ Accepted and progress saved");
              } catch (error) {
                console.error("Failed to save progress:", error);
                throw error; // Escalate error to main error handler
              }
            } else {
              failureCount++;
              console.log("✗ Failed to accept applicant");
            }
          }
        } catch (error) {
          failureCount++;
          console.error(
            `Error processing applicant: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
          );
        }

        // Add delay between processing each applicant (200ms)
        if (!dryRun && i < applicants.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      console.log("\n========================================");
      console.log("Acceptance Process Summary:");
      console.log("----------------------------------------");
      console.log(`Total Processed: ${applicants.length}`);
      console.log(`Successfully Accepted: ${successCount}`);
      console.log(`Failed: ${failureCount}`);

      if (!dryRun) {
        console.log(
          `Overall Progress: ${progress.acceptedCount}/${progress.totalToAccept}`,
        );

        if (progress.acceptedCount < progress.totalToAccept) {
          console.log("\nNote: Target not reached");
          console.log(
            `Still need ${progress.totalToAccept - progress.acceptedCount} more acceptances`,
          );
          console.log("Run the script again to process more applicants");
        } else {
          console.log("\n✓ Target number of acceptances reached!");
        }
      } else {
        console.log("\n[DRY RUN] No actual changes were made to the system");
      }
    } catch (error: unknown) {
      console.error(
        "Fatal error in acceptance process:",
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      process.exit(1);
    }
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
