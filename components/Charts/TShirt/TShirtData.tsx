// import { db } from "@/lib/db";
// import { hackerApplications } from "@/lib/db/schema";
// import { sql } from "drizzle-orm";
// import TShirtPieChart from "./TShirtPieChart";

// const TShirtData = async () => {
//   const results = await db
//     .select({
//       tShirtSize: hackerApplications.tshirtSize,
//       count: sql<number>`COUNT(${hackerApplications.userId})`,
//     })
//     .from(hackerApplications)
//     .groupBy(hackerApplications.tshirtSize)
//     .execute();

//   return <TShirtPieChart data={results} />;
// };
// export default TShirtData;
