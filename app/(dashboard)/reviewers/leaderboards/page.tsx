import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { isReviewer } from "@/lib/utils";
import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import { getLeaderboardStats } from "@/lib/services/reviewer-stats";
import LeaderboardTable from "@/components/review/LeaderboardTable";

export default async function LeaderboardPage() {
  const user = await getCurrentUser();

  if (!user?.id || !isReviewer(user.role)) {
    redirect("/");
  }

  const leaderboardStats = await getLeaderboardStats();

  return (
    <Container className="space-y-6 md:space-y-10">
      <PageBanner
        backButton
        heading="Reviewer Leaderboard"
        subheading="See who's leading the pack in application reviews"
      />

      <LeaderboardTable stats={leaderboardStats} currentUserRole={user.role} />
    </Container>
  );
}
