import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import ReviewerStatsCards from "./ReviewerStatsCards";
import ReviewerHistoryTable from "./ReviewerHistoryTable";
import { ClipboardX } from "lucide-react";

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
        <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
          <ClipboardX className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-medium">No Reviews Found</p>
            <p className="text-sm text-muted-foreground">
              This kid hasn&apos;t reviewed any applications yet
            </p>
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
