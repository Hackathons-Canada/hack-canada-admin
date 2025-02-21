import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendAcceptanceEmail } from "@/lib/ses";
import { createAuditLog } from "@/lib/db/queries/audit-log";
import { getUserByEmail } from "@/lib/db/queries/user";

async function acceptUser(email: string) {
  if (!email) {
    console.error("Error: Email is required");
    process.exit(1);
  }

  try {
    // Get user by email from the users table
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      console.error("Error: User does not exist");
      process.exit(1);
    }

    // Check if the user has already been accepted or rejected
    if (["accepted", "rejected"].includes(existingUser.applicationStatus)) {
      console.error(
        "Error: User has already been accepted or rejected and has received an email",
      );
      process.exit(1);
    }

    await db.transaction(async (tx) => {
      // Create audit log for the acceptance
      await createAuditLog(
        {
          userId: "6a655037-58af-47aa-8c14-fdfa8f94082c", // Araf's ID
          action: "update",
          entityType: "user",
          entityId: existingUser.id,
          previousValue: { applicationStatus: existingUser.applicationStatus },
          newValue: { applicationStatus: "accepted" },
          metadata: {
            description: `${existingUser.name} was manually accepted by Araf`,
            updatedBy: "Araf <araf.ahmed200@gmail.com>",
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
        .where(eq(users.id, existingUser.id));

      // Send acceptance email
      const firstName = existingUser.name.split(" ")[0];
      const response = await sendAcceptanceEmail(firstName, existingUser.email);

      if (response.error) {
        throw new Error(`Failed to send acceptance email: ${response.error}`);
      }
    });

    console.log(`Successfully accepted user: ${existingUser.name} (${email})`);
    process.exit(0);
  } catch (error) {
    console.error("Error accepting user:", error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("Usage: bun scripts/accept-user.ts <user-email>");
  process.exit(1);
}

acceptUser(email);
