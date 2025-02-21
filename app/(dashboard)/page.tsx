import { getCurrentUser } from "@/auth";
import Container from "@/components/Container";
import CountCard from "@/components/CountCard";
import PageBanner from "@/components/PageBanner";
import { db } from "@/lib/db";
import {
  hackerApplications,
  applicationReviews,
  users,
  checkIns,
} from "@/lib/db/schema";
import { isReviewer } from "@/lib/utils";
import { count, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export const revalidate = 1800;

const Home = async () => {
  const user = await getCurrentUser();

  if (!user?.id) {
    redirect("/");
  }

  if (!isReviewer(user.role)) redirect("https://app.hackcanada.org");

  const [
    [dbUsers],
    [applicants],
    [hackers],
    [checkedIns],
    [accepted],
    [rejected],
    [pendingApplications],
    [waitlisted],
    [cancelled],
    [admins],
    [organizers],
    [totalReviews],
    [avgRating],
    [avgReviewCount],
    [avgReviewDuration],
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db
      .select({ count: count() })
      .from(hackerApplications)
      .where(eq(hackerApplications.submissionStatus, "submitted")),
    db.select({ count: count() }).from(users).where(eq(users.role, "hacker")),
    db
      .select({ count: count() })
      .from(checkIns)
      .where(eq(checkIns.eventName, "hackathon-check-in")),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.applicationStatus, "accepted")),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.applicationStatus, "rejected")),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.applicationStatus, "pending")),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.applicationStatus, "waitlisted")),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.applicationStatus, "cancelled")),
    db.select({ count: count() }).from(users).where(eq(users.role, "admin")),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "organizer")),
    // New queries for review statistics
    db.select({ count: count() }).from(applicationReviews),
    db
      .select({
        avg: sql<number>`ROUND(AVG(${applicationReviews.rating})::numeric, 2)`,
      })
      .from(applicationReviews)
      .where(sql`${applicationReviews.rating} IS NOT NULL`),
    db
      .select({
        avg: sql<number>`ROUND(AVG(${hackerApplications.reviewCount})::numeric, 2)`,
      })
      .from(hackerApplications)
      .where(eq(hackerApplications.submissionStatus, "submitted")),
    db
      .select({
        avg: sql<number>`ROUND(AVG(${applicationReviews.reviewDuration})::numeric, 2)`,
      })
      .from(applicationReviews)
      .where(sql`${applicationReviews.reviewDuration} IS NOT NULL`),
  ]);

  const volunteers = 0;
  const mentors = 0;

  return (
    <Container>
      <PageBanner
        heading="Overview"
        className="mb-6 md:mb-8"
        subheading="Welcome to the official dashboard of Hack Canada. Below is a quick overview of our hackathon's statistics so far."
      />

      <div className="flex flex-col gap-8 md:gap-12">
        <section className="space-y-2">
          <p className="text-lg font-bold text-foreground md:text-xl">Users</p>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CountCard label="Users" count={dbUsers.count} />
            <CountCard label="Admins" count={admins.count} />
            <CountCard label="Organizers" count={organizers.count} />
            <CountCard label="Mentors" count={mentors} />
            <CountCard label="Volunteers" count={volunteers} />
            <CountCard label="Hackers" count={hackers.count} />
            <CountCard label="Checked In" count={checkedIns.count} />
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-lg font-bold text-foreground md:text-xl">
            Applications
          </p>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CountCard label="Applications" count={applicants.count} />
            <CountCard label="Accepted" count={accepted.count} />
            <CountCard label="Rejected" count={rejected.count} />
            <CountCard label="Pending" count={pendingApplications.count} />
            <CountCard label="Waitlisted" count={waitlisted.count} />
            <CountCard label="Cancelled" count={cancelled.count} />
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-lg font-bold text-foreground md:text-xl">
            Review Statistics
          </p>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CountCard label="Total Reviews" count={totalReviews.count} />
            <CountCard
              label="Avg Rating"
              count={avgRating.avg || 0}
              isDecimal
            />
            <CountCard
              label="Avg Reviews per App"
              count={avgReviewCount.avg || 0}
              isDecimal
            />
            <CountCard
              label="Avg Time per Review (s)"
              count={avgReviewDuration.avg || 0}
              isDecimal
            />
          </div>
        </section>
      </div>
    </Container>
  );
};

export default Home;
