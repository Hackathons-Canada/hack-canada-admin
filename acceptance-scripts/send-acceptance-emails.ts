import * as fs from "fs/promises";
import * as path from "path";
import { sendAcceptanceEmail } from "@/lib/ses";
import { parse } from "csv-parse/sync";

async function readTopApplicants() {
  const csvContent = await fs.readFile(
    path.join(process.cwd(), "top-applicants.csv"),
    "utf-8",
  );
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records as Array<{ "First Name": string; Email: string }>;
}

async function sendEmailWithDelay(firstName: string, email: string) {
  try {
    console.log(`Sending acceptance email to ${firstName} (${email})...`);
    const response = await sendAcceptanceEmail(firstName, email);

    if (response.error) {
      throw new Error(response.error);
    }

    console.log(`Successfully sent acceptance email to ${email}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    return false;
  }
}

async function main() {
  try {
    const applicants = await readTopApplicants();
    console.log(`Found ${applicants.length} applicants to email`);

    let successCount = 0;

    for (let i = 0; i < applicants.length; i++) {
      const applicant = applicants[i];
      const success = await sendEmailWithDelay(
        applicant["First Name"],
        applicant.Email,
      );

      if (success) {
        successCount++;
      }

      // Add delay before next email (200ms)
      if (i < applicants.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    console.log(`\nEmail sending complete:`);
    console.log(`Successfully sent: ${successCount}/${applicants.length}`);
    console.log(`Failed: ${applicants.length - successCount}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
