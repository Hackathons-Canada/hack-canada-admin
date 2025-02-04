"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HackerApplicationsSelectData } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { RATINGS, useReviewInterface } from "@/hooks/useReviewInterface";

interface ReviewInterfaceProps {
  initialApplication: HackerApplicationsSelectData | null;
}

export default function ReviewInterface({
  initialApplication,
}: ReviewInterfaceProps) {
  const router = useRouter();
  const { rating, setRating, submitting, submitReview } =
    useReviewInterface(initialApplication);

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
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2 md:grid-cols-11">
        {RATINGS.map((value) => (
          <Button
            key={value}
            onClick={() => setRating(value)}
            variant={rating === value ? "default" : "rating"}
            className={cn(
              "h-12 text-lg font-semibold",
              value <= 3 && "hover:border-destructive hover:text-destructive",
              value > 3 &&
                value <= 7 &&
                "hover:border-secondary hover:text-secondary",
              value > 7 &&
                "hover:border-green-500 hover:text-green-500 dark:hover:text-green-400",
              rating === value && "scale-105 shadow-md hover:text-white",
              value === 10 && "max-md:col-span-2",
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
