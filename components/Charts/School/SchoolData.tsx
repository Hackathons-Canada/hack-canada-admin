import { db } from "@/lib/db";
import { SchoolBarChart } from "./SchoolBarChart";
import { hackerApplications } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

type Props = {};

const SchoolData = async ({}: Props) => {
  const result = await db
    .select({
      school: hackerApplications.school,
      applicants: sql<number>`COUNT(${hackerApplications.userId})`,
    })
    .from(hackerApplications)
    .groupBy(hackerApplications.school);

  return (
    <div className="row-span-2 rounded-lg border p-6 md:p-10">
      <SchoolBarChart data={result} />
    </div>
  );
};
export default SchoolData;
