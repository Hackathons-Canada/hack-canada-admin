import { getCurrentUser } from "@/auth";
import Container from "@/components/Container";
import CountCard from "@/components/CountCard";
import PageBanner from "@/components/PageBanner";
import { db } from "@/lib/db";
import { hackerApplications, users } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const revalidate = 600;

const Home = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("https://app.hackcanada.org");
  }

  const [
    [dbUsers],
    [applicants],
    [applications],
    [accepted],
    [rejected],
    [pendingApplications],
    [waitListed],
    [admins],
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(hackerApplications),
    db.select({ count: count() }).from(users).where(eq(users.role, "hacker")),
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
      .where(eq(users.applicationStatus, "waitListed")),
    db.select({ count: count() }).from(users).where(eq(users.role, "admin")),
  ]);

  const organizers = 33;
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
            <CountCard label="Organizers" count={organizers} />
            <CountCard label="Mentors" count={mentors} />
            <CountCard label="Volunteers" count={volunteers} />
          </div>
        </section>

        <section className="space-y-2">
          <p className="text-lg font-bold text-foreground md:text-xl">
            Applications
          </p>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <CountCard label="Applications" count={applicants.count} />
            <CountCard label="Applications" count={applications.count} />
            <CountCard label="Accepted" count={accepted.count} />
            <CountCard label="Rejected" count={rejected.count} />
            <CountCard label="Pending" count={pendingApplications.count} />
            <CountCard label="Waitlisted" count={waitListed.count} />
          </div>
        </section>
      </div>
    </Container>
  );
};

export default Home;
