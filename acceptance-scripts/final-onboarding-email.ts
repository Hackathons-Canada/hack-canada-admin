import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendHackathonPrepEmail } from "@/lib/ses";

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

    // Send email to each hacker with a delay
    for (let i = 0; i < hackers.length; i++) {
      const hacker = hackers[i];
      try {
        console.log(
          `\n📧 Sending email to ${hacker.name.split(" ")[0]} (${i + 1}/${hackers.length})`,
        );

        const result = await sendHackathonPrepEmail(
          hacker.email,
          hacker.name.split(" ")[0],
          hacker.id,
        );

        if (result.success) {
          successCount++;
          console.log(`✅ Successfully sent email to ${hacker.email}`);
        } else {
          failureCount++;
          console.log(`❌ Failed to send email to ${hacker.email}: ${result}`);
        }

        // Add delay between emails to respect SES rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        failureCount++;
        console.error(`❌ Error sending email to ${hacker.email}:`, error);
      }
    }

    console.log("\n📈 Final Results:");
    console.log(`✅ Successfully sent: ${successCount} emails`);
    console.log(`❌ Failed to send: ${failureCount} emails`);
    console.log("✨ Script completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
};

main();
