import { db } from "@/lib/db";
import DietBarChart from "./DietBarChart";
import { hackerApplications } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

type Props = {};

const DietData = async ({}: Props) => {
  const results = await db
    .select({
      diet: hackerApplications.dietaryRestrictions,
      count: sql<number>`COUNT(${hackerApplications.userId})`,
    })
    .from(hackerApplications)
    .groupBy(hackerApplications.dietaryRestrictions)
    .execute();

  return <DietBarChart data={results} />;
};
export default DietData;
