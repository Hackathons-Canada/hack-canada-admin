"use server";

import { getCurrentUser } from "@/auth";
import { getApplicationById } from "@/data/applications";
import { getUserById } from "@/data/user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateStatusSchema = z.object({
  userId: z.string().trim().min(1).max(32),
  status: z.enum([
    "pending",
    "accepted",
    "rejected",
    "waitListed",
    "not_applied",
  ]),
});

type UpdateResult = {
  success?: string;
  error?: string;
  displayBanner: boolean;
};

export const updateHackerStatus = async (
  userId: string,
  status: ApplicationStatus,
): Promise<UpdateResult> => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return {
        error: "You do not have permission to perform this action.",
        displayBanner: true,
      };
    }

    const validatedFields = updateStatusSchema.safeParse({ userId, status });

    if (!validatedFields.success) {
      return {
        error: "Invalid user ID or status provided.",
        displayBanner: true,
      };
    }

    const existingHackerProfile = await getApplicationById(userId);
    const existingUser = await getUserById(userId);

    if (!existingHackerProfile || !existingUser) {
      return {
        error: existingUser
          ? "User has not applied for the hackathon yet."
          : "User does not exist.",
        displayBanner: true,
      };
    }

    // Check if the user has already been accepted or rejected
    if (["accepted", "rejected"].includes(existingUser.applicationStatus)) {
      return {
        error:
          "User status cannot be updated. They have already been accepted or rejected and have received an email.",
        displayBanner: true,
      };
    }

    // Check if the user status CAN be updated in the first place
    // The status can only be updated if the status is pending or waitlisted
    if (!["pending", "waitListed"].includes(existingUser.applicationStatus)) {
      return {
        error:
          "No changes can be made. The user's current application status is invalid or cannot be modified.",
        displayBanner: true,
      };
    }

    // await db.transaction(async (tx) => {
    //   await tx
    //     .update(users)
    //     .set({
    //       applicationStatus: status,
    //     })
    //     .where(eq(users.id, existingUser.id));

    //   await tx
    //     .update(hackerApplications)
    //     .set({ applicationStatus: status })
    //     .where(eq(hackerApplications.userId, existingHackerProfile.userId));

    //   if (status === "accepted" || status === "rejected") {
    //     const sendEmail =
    //       status === "accepted" ? sendAcceptanceEmail : sendRejectionEmail;
    //     const response = await sendEmail(
    //       existingHackerProfile.firstName || existingUser.firstName || "hacker",
    //       existingHackerProfile.email,
    //     );

    //     if (response.error) {
    //       throw new Error(`Failed to send ${status} email: ${response.error}`);
    //     }
    //   }
    // });

    revalidatePath(`/applications/${userId}`);
    revalidatePath(`/users/${userId}`);

    console.log(`User ${userId} status updated to ${status}`);

    return {
      success: `User status updated successfully. ${existingHackerProfile.firstName} now has the status of '${status}'.`,
      displayBanner: true,
    };
  } catch (error) {
    console.error("Error updating hacker status:", error);
    return {
      error:
        "Failed to update hacker status. Please try again or contact support if the issue persists.",
      displayBanner: true,
    };
  }
};
