import { getCurrentUser } from "@/auth";
import HackerPieChart from "@/components/Charts/HackerPieChart";
import LevelOfStudyData from "@/components/Charts/LevelOfStudy/LevelOfStudyData";
import ProgramData from "@/components/Charts/Program/ProgramData";
import RaceData from "@/components/Charts/Race/RaceData";
import SchoolData from "@/components/Charts/School/SchoolData";
// import TShirtData from "@/components/Charts/TShirt/TShirtData";
import Container from "@/components/Container";
import { db } from "@/lib/db";
import { hackerApplications, users } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const StatisticsPage = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("https://app.hackcanada.org");
  }

  const [applications] = await db
    .select({ count: count() })
    .from(hackerApplications);

  const [pendingApps] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.applicationStatus, "pending"));

  const [acceptedApps] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.applicationStatus, "accepted"));

  const [rejectedApps] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.applicationStatus, "rejected"));

  const [waitlistedApps] = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.applicationStatus, "waitlisted"));

  const applicationData = [
    {
      status: "pending",
      applicants: pendingApps.count,
      fill: "var(--color-pending)",
    },
    {
      status: "accepted",
      applicants: acceptedApps.count,
      fill: "var(--color-accepted)",
    },
    {
      status: "rejected",
      applicants: rejectedApps.count,
      fill: "var(--color-rejected)",
    },
    {
      status: "waitlisted",
      applicants: waitlistedApps.count,
      fill: "var(--color-waitlisted)",
    },
  ];

  return (
    <Container className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-8 md:col-span-2">
        <SchoolData />
        <ProgramData />
        <LevelOfStudyData />
        <RaceData />
      </div>
      <div className="col-span-2 grid h-fit gap-8 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
        <HackerPieChart
          applicantsCount={applications.count}
          data={applicationData}
        />
        {/* <TShirtData /> */}
      </div>
    </Container>
  );
};
export default StatisticsPage;
