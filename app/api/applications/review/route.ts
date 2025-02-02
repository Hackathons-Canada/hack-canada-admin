import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { applicationReviews, hackerApplications } from "@/lib/db/schema";
import { getCurrentUser } from "@/auth";
import { createAuditLog } from "@/lib/db/queries/audit-log";
import { db } from "@/lib/db";

import { ApiResponse } from "@/types/api";
import { isReviewer } from "@/lib/utils";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  // Remove when done testing
  const troo = true;
  if (troo)
    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
    });

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !isReviewer(currentUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access",
          error: "User must be an admin/organizer to review applications",
        },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { applicationId, rating } = body;

    if (!applicationId || !rating || rating < 1 || rating > 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          error: "Application ID and rating (1-10) are required",
        },
        { status: 400 },
      );
    }

    // Start a transaction to ensure data consistency
    await db.transaction(async (tx) => {
      if (!currentUser.id) throw new Error("Invalid user ID");

      // Check if the user has already reviewed this application
      const [existingReview] = await tx
        .select()
        .from(applicationReviews)
        .where(
          and(
            eq(applicationReviews.applicationId, applicationId),
            eq(applicationReviews.reviewerId, currentUser.id),
          ),
        )
        .execute();

      if (existingReview) {
        throw new Error("You have already reviewed this application");
      }

      // Create the review
      await tx.insert(applicationReviews).values({
        applicationId,
        reviewerId: currentUser.id,
        rating,
      });

      // Update the application's review count and average rating
      const allReviews = await tx
        .select({ rating: applicationReviews.rating })
        .from(applicationReviews)
        .where(eq(applicationReviews.applicationId, applicationId))
        .execute();

      const totalRatings = allReviews.length + 1; // Include the new review
      const averageRating =
        Math.round(
          (allReviews.reduce((sum, review) => sum + review.rating, rating) /
            totalRatings) *
            100,
        ) / 100;

      await tx
        .update(hackerApplications)
        .set({
          reviewCount: sql`${hackerApplications.reviewCount} + 1`,
          averageRating,
        })
        .where(eq(hackerApplications.id, applicationId));

      // Create audit log
      await createAuditLog(
        {
          action: "create",
          entityId: applicationId,
          entityType: "applicationReview",
          userId: currentUser.id,
          metadata: { rating },
        },
        tx,
      );
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("[APPLICATIONS_REVIEW_POST]", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to submit review",
          error: error.message,
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit review",
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
