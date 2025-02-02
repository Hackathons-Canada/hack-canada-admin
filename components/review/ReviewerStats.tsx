import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import ReviewerStatsCards from "./ReviewerStatsCards";
import ReviewerHistoryTable from "./ReviewerHistoryTable";

interface ReviewerStats {
  reviewerId: string;
  reviewCount: number;
  timeSpent: string;
  averageRating: number;
  applicationsReviewed: {
    applicationId: string;
    applicantName: string;
    rating: number;
    reviewedAt: Date;
    duration: number;
  }[];
}

interface ReviewerStatsProps {
  stats: ReviewerStats | null;
  selectedReviewer: string | undefined;
}

export default function ReviewerStats({
  stats,
  selectedReviewer,
}: ReviewerStatsProps) {
  if (!stats && selectedReviewer) {
    return (
      <Card>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            No reviews found for this organizer
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading stats...</div>}>
      <div className="space-y-6">
        <ReviewerStatsCards
          reviewCount={stats.reviewCount}
          timeSpent={stats.timeSpent}
          averageRating={stats.averageRating}
        />
        <ReviewerHistoryTable reviews={stats.applicationsReviewed} />
      </div>
    </Suspense>
  );
}
