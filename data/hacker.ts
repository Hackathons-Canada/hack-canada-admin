import { RESULTS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { hackerApplications, users } from "@/lib/db/schema";
import {
  eq,
  count,
  desc,
  and,
  like,
  lt,
  gte,
  ne,
  isNotNull,
  asc,
} from "drizzle-orm";

export const getHackerWithUserById = async (id: string) => {
  try {
    const [hacker] = await db
      .select()
      .from(hackerApplications)
      .where(eq(hackerApplications.userId, id))
      .innerJoin(users, eq(users.id, hackerApplications.userId));

    return hacker;
  } catch (error) {
    console.log("Error fetching hacker with ID: " + id, error);
    return null;
  }
};

export const getHackerById = async (userId: string) => {
  try {
    const [hacker] = await db
      .select()
      .from(hackerApplications)
      .where(eq(hackerApplications.userId, userId));

    return hacker;
  } catch (error) {
    console.log("Error fetching hacker with ID: " + userId, error);
    return null;
  }
};

export const getHackers = async (offsetAmt: number) => {
  try {
    const hackers = await db
      .select()
      .from(hackerApplications)
      .limit(RESULTS_PER_PAGE)
      .offset(offsetAmt)
      .orderBy(desc(hackerApplications.createdAt));
    return hackers;
  } catch (error) {
    console.log("Error fetching hackers", error);
    return null;
  }
};

export const getNumHackers = async () => {
  try {
    const hackers = await db
      .select({ count: count() })
      .from(hackerApplications);
    return hackers[0].count;
  } catch (error) {
    console.log("Error fetching number of hackers", error);
    return 0;
  }
};

export const getHackersSearch = async (
  firstName: string | string[],
  lastName: string | string[],
  school: string | string[],
  age: string | string[],
  diet: string | string[],
  status: string | string[],
  offset: number,
) => {
  diet = diet === "all" ? "" : diet;
  status = status === "all" ? "" : status;
  try {
    return await db
      .select()
      .from(hackerApplications)
      .where(
        and(
          like(hackerApplications.firstName, `${firstName}%`),
          like(hackerApplications.lastName, `${lastName}%`),
          like(hackerApplications.school, `%${school}%`),
          age === "under"
            ? lt(hackerApplications.age, 18)
            : age === "over"
              ? gte(hackerApplications.age, 18)
              : isNotNull(hackerApplications.age),
        ),
      )
      .limit(RESULTS_PER_PAGE)
      .offset(offset)
      .orderBy(asc(hackerApplications.createdAt));
  } catch (error) {
    console.log("Error fetching hackers", error);
    return null;
  }
};

export const getNumHackersSearch = async (
  firstName: string | string[],
  lastName: string | string[],
  school: string | string[],
  age: string | string[],
  diet: string | string[],
  status: string | string[],
) => {
  diet = diet === "all" ? "" : diet;
  status = status === "all" ? "" : status;
  try {
    const hackers = await db
      .select({ count: count() })
      .from(hackerApplications)
      .where(
        and(
          like(hackerApplications.firstName, `${firstName}%`),
          like(hackerApplications.lastName, `${lastName}%`),
          like(hackerApplications.school, `%${school}%`),
          age === "under"
            ? lt(hackerApplications.age, 18)
            : age === "over"
              ? gte(hackerApplications.age, 18)
              : ne(hackerApplications.age, -1),
        ),
      );
    return hackers[0].count;
  } catch (error) {
    console.log("Error fetching number of hackers", error);
    return 0;
  }
};
