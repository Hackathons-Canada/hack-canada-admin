import { db } from "@/lib/db";
import { hackerApplications } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import RaceBarChart from "./RaceBarChart";

const RaceData = async () => {
  const results = await db
    .select({
      race: hackerApplications.race,
      count: sql<number>`COUNT(${hackerApplications.userId})`,
    })
    .from(hackerApplications)
    .groupBy(hackerApplications.race)
    .execute();

  return <RaceBarChart data={results} />;
};
export default RaceData;
