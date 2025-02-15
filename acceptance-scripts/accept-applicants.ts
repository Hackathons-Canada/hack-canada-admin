import * as fs from "fs/promises";
import * as path from "path";
import { db } from "@/lib/db";
import { hackerApplications, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendAcceptanceEmail } from "@/lib/ses";
import { parse } from "csv-parse/sync";
import { createAuditLog } from "@/lib/db/queries/audit-log";

interface ApplicantData {
  userId: string;
  firstName: string;
  email: string;
}

export async function readApplicantsFromCsv(): Promise<ApplicantData[]> {
  const csvContent = await fs.readFile(
    path.join(process.cwd(), "top-applicants.csv"),
    "utf-8",
  );
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });
  return records as ApplicantData[];
}

export async function acceptApplicant(applicantData: ApplicantData) {
  try {
    console.log(
      `Processing ${applicantData.firstName} (${applicantData.email})...`,
    );

    await db.transaction(async (tx) => {
      // Create audit log
      await createAuditLog(
        {
          userId: applicantData.userId,
          action: "update",
          entityType: "user",
          entityId: applicantData.userId,
          previousValue: { applicationStatus: "pending" },
          newValue: { applicationStatus: "accepted" },
          metadata: {
            description: `${applicantData.firstName}'s application was accepted by automated process`,
            updatedBy: "system",
            timestamp: new Date().toISOString(),
          },
        },
        tx,
      );

      // Update user status
      await tx
        .update(users)
        .set({
          applicationStatus: "accepted",
          acceptedAt: new Date(),
        })
        .where(eq(users.id, applicantData.userId));

      // Update application status
      await tx
        .update(hackerApplications)
        .set({
          internalResult: "accepted",
        })
        .where(eq(hackerApplications.userId, applicantData.userId));

      // Send acceptance email
      const emailResponse = await sendAcceptanceEmail(
        applicantData.firstName,
        applicantData.email,
      );

      if (emailResponse.error) {
        throw new Error(
          `Failed to send acceptance email: ${emailResponse.error}`,
        );
      }
    });

    console.log(`Successfully processed ${applicantData.firstName}`);
    return true;
  } catch (error) {
    console.error(`Failed to process ${applicantData.firstName}:`, error);
    return false;
  }
}

async function main() {
  try {
    const applicants = await readApplicantsFromCsv();

    console.log("Found applications", applicants);

    console.log(`Found ${applicants.length} applicants to process`);

    let successCount = 0;

    for (let i = 0; i < applicants.length; i++) {
      const applicant = applicants[i];
      const success = await acceptApplicant(applicant);

      if (success) {
        successCount++;
      }

      // Add delay between processing each applicant (200ms)
      if (i < applicants.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    console.log(`\nAcceptance process complete:`);
    console.log(`Successfully processed: ${successCount}/${applicants.length}`);
    console.log(`Failed: ${applicants.length - successCount}`);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// main();
