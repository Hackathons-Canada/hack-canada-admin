import { rl, question } from "./cli";
import { loadProgress, saveProgress } from "./progress";
import { normalizeRatings } from "./normalize-ratings";
import {
  getTopApplicantsList,
  saveApplicantsToFile,
} from "./list-top-applicants";
import { readApplicantsFromCsv, acceptApplicant } from "./accept-applicants";

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

  // Ask for operation mode
  const mode = await question(
    "Choose operation mode (1 for generate list, 2 for accept applicants): ",
  );

  if (!["1", "2"].includes(mode)) {
    console.log("Invalid mode selected. Please choose 1 or 2.");
    rl.close();
    return;
  }

  // Ask for number of applicants to process
  if (!progress || progress.acceptedCount === 0) {
    const baseCountStr = await question(
      "How many applicants do you want to process? ",
    );
    const baseCount = parseInt(baseCountStr, 10);

    const extraPercentStr = await question(
      "What percentage extra should we process (e.g., 10 for 10%)? ",
    );
    const extraPercent = parseInt(extraPercentStr, 10) || 0;

    const totalToProcess = Math.ceil(baseCount * (1 + extraPercent / 100));
    progress = {
      ...progress,
      totalToAccept: totalToProcess,
      acceptedCount: 0,
    };

    console.log(
      `Will process ${totalToProcess} applicants (${baseCount} + ${extraPercent}% buffer)`,
    );
    await saveProgress(progress);
  } else {
    console.log(
      `Continuing previous run: ${progress.acceptedCount}/${progress.totalToAccept} already processed`,
    );
  }

  const remaining = progress.totalToAccept - progress.acceptedCount;
  if (remaining <= 0) {
    console.log("All applicants have already been processed!");
    rl.close();
    return;
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
      const applicants = await readApplicantsFromCsv();
      console.log(`Found ${applicants.length} applicants to process`);

      let successCount = 0;

      for (let i = 0; i < applicants.length; i++) {
        const applicant = applicants[i];
        const current = progress.acceptedCount + i + 1;
        console.log(
          `Processing applicant ${current}/${progress.totalToAccept} (${applicant.firstName} - ${applicant.email})...`,
        );

        const success = await acceptApplicant(applicant);
        if (success) {
          successCount++;
          progress.acceptedCount++;
          progress.lastProcessedId = applicant.userId;
          await saveProgress(progress);
        }

        // Add delay between processing each applicant (200ms)
        if (i < applicants.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      console.log(`\nAcceptance process complete:`);
      console.log(
        `Successfully processed: ${successCount}/${applicants.length}`,
      );
      console.log(`Failed: ${applicants.length - successCount}`);

      if (progress.acceptedCount < progress.totalToAccept) {
        console.log(
          `Note: Could not find enough eligible applicants to reach target of ${progress.totalToAccept}`,
        );
      }
    } catch (error) {
      console.error("Fatal error in acceptance process:", error);
      process.exit(1);
    }
  }

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
    process.exit(0); // Changed from 1 to 0 for successful exit
  });
