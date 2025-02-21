import { getCurrentUser } from "@/auth";
import { getApplicationById } from "@/data/applications";
import { getUserById } from "@/data/user";
import { ApiResponse } from "@/types/api";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { hackerApplications, users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { sendAcceptanceEmail, sendRejectionEmail } from "@/lib/ses";
import { createAuditLog } from "@/lib/db/queries/audit-log";
import { isAdmin } from "@/lib/utils";

const updateStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "waitlisted"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
): Promise<NextResponse<ApiResponse>> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !isAdmin(currentUser.role)) {
      return NextResponse.json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    const body = await req.json();
    const validatedFields = updateStatusSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid status provided.",
      });
    }

    const { status } = validatedFields.data;
    const { userId } = params;

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Invalid user ID provided.",
      });
    }

    const existingApplication = await getApplicationById(userId);
    const existingUser = await getUserById(userId);

    if (!existingApplication || !existingUser) {
      return NextResponse.json({
        success: false,
        message: existingUser
          ? "User has not applied for the hackathon yet."
          : "User does not exist.",
      });
    }

    // Check if the user has already been accepted or rejected
    if (["accepted", "rejected"].includes(existingUser.applicationStatus)) {
      return NextResponse.json({
        success: false,
        message:
          "User status cannot be updated. They have already been accepted or rejected and have received an email.",
      });
    }

    // Check if the user status CAN be updated in the first place
    // The status can only be updated if the status is pending or waitlisted
    if (!["pending", "waitlisted"].includes(existingUser.applicationStatus)) {
      return NextResponse.json({
        success: false,
        message:
          "No changes can be made. The user's current application status is invalid or cannot be modified.",
      });
    }

    await db.transaction(async (tx) => {
      // Create audit log for the status change
      await createAuditLog(
        {
          userId: currentUser.id || "unknown",
          action: "update",
          entityType: "user",
          entityId: userId,
          previousValue: { applicationStatus: existingUser.applicationStatus },
          newValue: { applicationStatus: status },
          metadata: {
            description: `${existingApplication.firstName}'s application was ${status} by ${currentUser.name || currentUser.email}`,
            updatedBy: currentUser.email,
            timestamp: new Date().toISOString(),
          },
        },
        tx,
      );

      await tx
        .update(users)
        .set({
          applicationStatus: status,
          acceptedAt: status === "accepted" ? new Date() : null,
        })
        .where(eq(users.id, existingUser.id));

      await tx
        .update(hackerApplications)
        .set({
          internalResult: status,
        })
        .where(eq(hackerApplications.userId, existingUser.id));

      if (status === "accepted" || status === "rejected") {
        const sendEmail =
          status === "accepted" ? sendAcceptanceEmail : sendRejectionEmail;

        const response = await sendEmail(
          existingApplication.firstName || existingUser.name.split(" ")[0],
          existingUser.email,
        );

        if (response.error) {
          throw new Error(`Failed to send ${status} email: ${response.error}`);
        }
      }
    });

    console.log(`User ${userId} status updated to ${status}`);

    return NextResponse.json({
      success: true,
      message: `User status updated successfully. ${existingApplication.firstName} now has the status of '${status}'.`,
      data: { status },
    });
  } catch (error) {
    console.error("Error updating hacker status:", error);
    return NextResponse.json({
      success: false,
      message:
        "Failed to update hacker status. Please try again or contact support if the issue persists.",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
