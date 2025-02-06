import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HackerApplicationsSelectData } from "@/lib/db/schema";
import { ApiResponse } from "@/types/api";

export const RATINGS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // milliseconds

export const useReviewInterface = (
  initialApplication: HackerApplicationsSelectData | null,
) => {
  const [rating, setRating] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now()); // Start timer when component mounts
  const router = useRouter();

  const submitReview = async () => {
    if (!initialApplication || rating === null) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    if (rating < 0 || rating > 10) {
      toast.error("Rating must be between 0 and 10");
      return;
    }

    try {
      setSubmitting(true);

      let retryCount = 0;
      while (retryCount < MAX_RETRIES) {
        try {
          const res = await fetch("/api/applications/review", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              applicationId: initialApplication.id,
              rating,
              reviewDuration: Math.floor((Date.now() - startTime) / 1000), // Convert to seconds
            }),
          });
          const data: ApiResponse = await res.json();

          if (!res.ok || !data.success) {
            throw new Error(
              data.error || data.message || "Failed to submit review",
            );
          }

          toast.success(data.message || "Review submitted successfully!");
          router.refresh();
          window.scrollTo({ top: 0, behavior: "smooth" });

          setStartTime(Date.now());
          setRating(null);
          return;
        } catch (error) {
          retryCount++;
          if (retryCount === MAX_RETRIES) {
            throw new Error(
              `Failed to submit review after ${MAX_RETRIES} attempts. Please try again later.`,
            );
          }
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
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

  return {
    rating,
    setRating,
    submitting,
    submitReview,
  };
};
