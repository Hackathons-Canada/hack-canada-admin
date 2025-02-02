import { and, eq, lt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { applicationReviews, hackerApplications } from "@/lib/db/schema";
import { getCurrentUser } from "@/auth";
import { createAuditLog } from "@/lib/db/queries/audit-log";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || currentUser.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get applications that:
    // 1. Have less than 3 reviews
    // 2. Haven't been reviewed by the current admin
    // 3. Are submitted (not drafts)
    const [application] = await db
      .select()
      .from(hackerApplications)
      .where(
        and(
          lt(hackerApplications.reviewCount, 3),
          eq(hackerApplications.submissionStatus, "submitted"),
          eq(hackerApplications.internalResult, "pending"),
          sql`NOT EXISTS (
            SELECT 1 FROM ${applicationReviews}
            WHERE ${applicationReviews.applicationId} = ${hackerApplications.id}
            AND ${applicationReviews.reviewerId} = ${currentUser.id}
          )`,
        ),
      )
      .orderBy(sql`RANDOM()`)
      .limit(1)
      .execute();

    if (!application) {
      return new NextResponse(
        JSON.stringify({ message: "No applications left to review" }),
        { status: 404 },
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("[APPLICATIONS_REVIEW_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  // Remove when done testing
  const troo = true;
  if (troo)
    return new NextResponse("Review submitted successfully", { status: 200 });

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || currentUser.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { applicationId, rating } = body;

    if (!applicationId || !rating || rating < 1 || rating > 10) {
      return new NextResponse("Invalid request body", { status: 400 });
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

    return new NextResponse("Review submitted successfully", { status: 200 });
  } catch (error) {
    console.error("[APPLICATIONS_REVIEW_POST]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
