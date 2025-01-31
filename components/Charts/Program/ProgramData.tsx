import { db } from "@/lib/db";
import ProgramBarChart from "./ProgramBarChart";
import { sql } from "drizzle-orm";
import { hackerApplications } from "@/lib/db/schema";

type Props = {};

const ProgramData = async ({}: Props) => {
  const results = await db
    .select({
      major: hackerApplications.major,
      applicants: sql<number>`COUNT(${hackerApplications.userId})`,
    })
    .from(hackerApplications)
    .groupBy(hackerApplications.major)
    .execute();

  return (
    <div className="row-span-2 rounded-lg border p-6 md:col-span-2 md:p-10">
      <ProgramBarChart data={results} />
    </div>
  );
};
export default ProgramData;
