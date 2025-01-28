import { db } from "@/lib/db";
import GenderBarChart from "./GenderBarChart";
import { hackerApplications } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

type Props = {};

const GenderData = async ({}: Props) => {
  const results = await db
    .select({
      gender: hackerApplications.gender,
      count: sql<number>`COUNT(${hackerApplications.userId})`,
    })
    .from(hackerApplications)
    .groupBy(hackerApplications.gender)
    .execute();

  return <GenderBarChart data={results} />;
};
export default GenderData;
