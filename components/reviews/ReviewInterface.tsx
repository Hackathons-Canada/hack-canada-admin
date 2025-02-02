"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { HackerApplicationsSelectData } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
interface ReviewInterfaceProps {
  initialApplication: HackerApplicationsSelectData | null;
}

const RATINGS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export default function ReviewInterface({
  initialApplication,
}: ReviewInterfaceProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const submitReview = async () => {
    if (!initialApplication || rating === null) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/applications/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: initialApplication.id,
          rating,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      router.refresh();
      setRating(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit review. Please try again.",
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialApplication) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No more applications to review!</p>
        <Button
          onClick={() => router.refresh()}
          variant="secondary"
          className="mt-4"
        >
          Check Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold">Rating</p>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2">
        {RATINGS.map((value) => (
          <Button
            key={value}
            onClick={() => setRating(value)}
            variant={rating === value ? "default" : "outline"}
            className={cn(
              "h-12 text-lg font-semibold",
              rating === value && "ring-2 ring-primary",
              value <= 3 && "hover:bg-red-100 dark:hover:bg-red-900",
              value > 3 &&
                value <= 7 &&
                "hover:bg-yellow-100 dark:hover:bg-yellow-900",
              value > 7 && "hover:bg-green-100 dark:hover:bg-green-900",
            )}
            disabled={submitting}
          >
            {value}
          </Button>
        ))}
      </div>

      <Button
        onClick={submitReview}
        disabled={submitting || rating === null}
        className="w-full min-w-[140px]"
      >
        <span className="flex items-center justify-center gap-2">
          {submitting && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {submitting ? "Submitting..." : "Submit Review"}
        </span>
      </Button>
    </div>
  );
}
