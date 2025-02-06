import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { applicationReviews, hackerApplications } from "@/lib/db/schema";
import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";

import { ApiResponse } from "@/types/api";
import { isReviewer } from "@/lib/utils";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
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
    const { applicationId, rating, reviewDuration } = body;

    if (
      !applicationId ||
      rating === undefined ||
      rating === null ||
      rating < 0 ||
      rating > 10 ||
      !reviewDuration
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request data",
          error:
            "Application ID, rating (0-10), and review duration are required",
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
        reviewDuration,
      });

      // Update the application's review count and average rating
      const allReviews = await tx
        .select({ rating: applicationReviews.rating })
        .from(applicationReviews)
        .where(eq(applicationReviews.applicationId, applicationId))
        .execute();

      const averageRating = Math.round(
        (allReviews.reduce((sum, review) => sum + review.rating, 0) /
          allReviews.length) *
          100,
      );

      await tx
        .update(hackerApplications)
        .set({
          reviewCount: sql`${hackerApplications.reviewCount} + 1`,
          averageRating,
        })
        .where(eq(hackerApplications.id, applicationId));
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
