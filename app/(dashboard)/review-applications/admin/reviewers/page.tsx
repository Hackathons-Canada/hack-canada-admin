import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ReviewerSelector from "@/components/review/ReviewerSelector";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import ReviewerStats from "@/components/review/ReviewerStats";
import { getReviewers, getReviewerStats } from "@/lib/services/reviewer-stats";

export default async function ReviewerStatsPage({
  searchParams,
}: {
  searchParams: { reviewer?: string };
}) {
  const user = await getCurrentUser();

  if (!user?.id || !isAdmin(user.role)) {
    redirect("/");
  }

  const reviewers = await getReviewers();
  const selectedReviewer = searchParams.reviewer;
  const reviewerStats = selectedReviewer
    ? await getReviewerStats(selectedReviewer)
    : null;

  return (
    <Container className="space-y-6 md:space-y-10">
      <PageBanner
        backButton
        heading="Reviewer Statistics"
        subheading="Track individual reviewer performance and statistics"
        className="transition-all duration-200 hover:bg-muted/50"
      />

      <div className="space-y-4 md:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Select an Organizer to View Stats</CardTitle>
            <CardDescription>
              Choose an organizer from the dropdown below to view their review
              statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewerSelector
              selectedReviewer={selectedReviewer}
              reviewers={reviewers}
            />
          </CardContent>
        </Card>

        <ReviewerStats
          stats={reviewerStats}
          selectedReviewer={selectedReviewer}
        />
      </div>
    </Container>
  );
}
