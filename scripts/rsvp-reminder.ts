import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { and, eq } from "drizzle-orm";
import { sendRSVPReminderEmail } from "../lib/ses";

const sendRSVPReminders = async () => {
  console.log("🔍 Fetching users who need RSVP reminders...");

  try {
    const unresponded = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(
        and(
          eq(users.applicationStatus, "accepted"),
          eq(users.role, "unassigned"),
        ),
      );

    if (!unresponded.length) {
      console.log("✨ No users found needing RSVP reminders.");
      return;
    }

    console.log(`📧 Found ${unresponded.length} users to send reminders to.`);
    console.log("🚀 Starting to send reminder emails...\n");

    let successCount = 0;
    let failureCount = 0;

    for (const user of unresponded) {
      try {
        await sendRSVPReminderEmail(
          user.name.split(" ")[0] || "Hacker",
          user.email,
        );
        console.log(`✅ Sent reminder to ${user.email}`);
        successCount++;

        // Add delay between emails
        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (error) {
        console.error(`❌ Failed to send reminder to ${user.email}:`, error);
        failureCount++;
      }
    }

    console.log("\n📊 Summary:");
    console.log(`Total users processed: ${unresponded.length}`);
    console.log(`Successfully sent: ${successCount}`);
    console.log(`Failed to send: ${failureCount}`);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    process.exit(1);
  }
};

// Execute the script
sendRSVPReminders()
  .then(() => {
    console.log("\n✨ RSVP reminder script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
