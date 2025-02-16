import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendHackathonPrepEmail } from "@/lib/ses";
import fs from "fs";
import path from "path";

const RETRY_ATTEMPTS = 3;
const DELAY_BETWEEN_EMAILS = 150; // milliseconds
const MAX_FAILURE_PERCENTAGE = 10; // Stop if 10% of emails fail

interface EmailAttempt {
  userId: string;
  email: string;
  name: string;
  attempts: number;
  lastError?: string;
}

const saveFailedAttempts = (attempts: EmailAttempt[]) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(process.cwd(), `failed-emails-${timestamp}.json`);
  fs.writeFileSync(filePath, JSON.stringify(attempts, null, 2));
  return filePath;
};

const main = async () => {
  console.log("🚀 Starting to send hackathon prep emails...");

  try {
    // Get all users with role "hacker"
    const hackers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.role, "hacker"));

    console.log(`📊 Found ${hackers.length} hackers to email`);

    let successCount = 0;
    let failureCount = 0;
    const failedAttempts: EmailAttempt[] = [];

    // Send email to each hacker with a delay
    for (let i = 0; i < hackers.length; i++) {
      const hacker = hackers[i];
      let currentAttempt = 1;
      let success = false;

      // Try multiple times for each email
      while (currentAttempt <= RETRY_ATTEMPTS && !success) {
        try {
          if (currentAttempt > 1) {
            console.log(
              `\n🔄 Retry attempt ${currentAttempt} for ${hacker.name.split(" ")[0]} (${i + 1}/${hackers.length})`,
            );
          } else {
            console.log(
              `\n📧 Sending email to ${hacker.name.split(" ")[0]} (${i + 1}/${hackers.length})`,
            );
          }

          const result = await sendHackathonPrepEmail(
            hacker.email,
            hacker.name.split(" ")[0],
            hacker.id,
          );

          if (result.success) {
            success = true;
            successCount++;
            console.log(`✅ Successfully sent email to ${hacker.email}`);
          } else {
            console.log(
              `❌ Attempt ${currentAttempt} failed for ${hacker.email}: ${result}`,
            );
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          console.error(
            `❌ Error on attempt ${currentAttempt} for ${hacker.email}:`,
            errorMessage,
          );

          // On final attempt, record the failure
          if (currentAttempt === RETRY_ATTEMPTS) {
            failureCount++;
            failedAttempts.push({
              userId: hacker.id,
              email: hacker.email,
              name: hacker.name,
              attempts: currentAttempt,
              lastError: errorMessage,
            });

            // Check if failure rate is too high
            const currentFailurePercentage =
              (failureCount / hackers.length) * 100;
            if (currentFailurePercentage > MAX_FAILURE_PERCENTAGE) {
              console.error(
                `\n⚠️ Failure rate of ${currentFailurePercentage.toFixed(
                  1,
                )}% exceeds maximum threshold of ${MAX_FAILURE_PERCENTAGE}%`,
              );
              if (failedAttempts.length > 0) {
                const filePath = saveFailedAttempts(failedAttempts);
                console.log(`📝 Failed attempts saved to ${filePath}`);
              }
              process.exit(1);
            }
          }
        }

        currentAttempt++;

        // Add delay between retry attempts
        if (currentAttempt <= RETRY_ATTEMPTS && !success) {
          await new Promise((resolve) =>
            setTimeout(resolve, DELAY_BETWEEN_EMAILS),
          );
        }
      }

      // Add delay between emails to respect SES rate limits (14 emails/second)
      if (i < hackers.length - 1) {
        // Don't delay after the last email
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_EMAILS),
        );
      }
    }

    console.log("\n📈 Final Results:");
    console.log(`✅ Successfully sent: ${successCount} emails`);
    console.log(`❌ Failed to send: ${failureCount} emails`);

    if (failedAttempts.length > 0) {
      const filePath = saveFailedAttempts(failedAttempts);
      console.log(`📝 Failed attempts saved to ${filePath}`);
    }

    console.log("✨ Script completed!");
    process.exit(failureCount > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
};

main();
