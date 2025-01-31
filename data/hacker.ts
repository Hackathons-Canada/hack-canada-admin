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
  or,
  sql,
} from "drizzle-orm";

export const getHackerWithUserById = async (id: string) => {
  try {
    const [result] = await db
      .select({
        hackerApplication: hackerApplications,
        user: users,
      })
      .from(hackerApplications)
      .where(eq(hackerApplications.userId, id))
      .innerJoin(users, eq(users.id, hackerApplications.userId));

    return result;
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
    const results = await db
      .select({
        hackerApplication: hackerApplications,
        user: users,
      })
      .from(hackerApplications)
      .limit(RESULTS_PER_PAGE)
      .offset(offsetAmt)
      .orderBy(desc(hackerApplications.createdAt))
      .innerJoin(users, eq(users.id, hackerApplications.userId));
    return results;
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
  firstName: string | undefined,
  lastName: string | undefined,
  school: string | undefined,
  levelOfStudy: string | undefined,
  major: string | undefined,
  status: string | undefined,
  offset: number,
) => {
  try {
    const conditions = [];

    if (firstName)
      conditions.push(
        like(hackerApplications.firstName || "", `${firstName}%`),
      );
    if (lastName)
      conditions.push(like(hackerApplications.lastName || "", `${lastName}%`));
    if (school)
      conditions.push(like(hackerApplications.school || "", `%${school}%`));
    if (major)
      conditions.push(like(hackerApplications.major || "", `%${major}%`));

    if (levelOfStudy && levelOfStudy !== "all") {
      conditions.push(eq(hackerApplications.levelOfStudy, levelOfStudy));
    }

    if (status && status !== "all") {
      conditions.push(eq(users.applicationStatus, status));
    }

    return await db
      .select({
        hackerApplication: hackerApplications,
        user: users,
      })
      .from(hackerApplications)
      .innerJoin(users, eq(users.id, hackerApplications.userId))
      .where(and(...conditions))
      .limit(RESULTS_PER_PAGE)
      .offset(offset)
      .orderBy(asc(hackerApplications.createdAt));
  } catch (error) {
    console.log("Error fetching hackers", error);
    return null;
  }
};

export const getNumHackersSearch = async (
  firstName: string | undefined,
  lastName: string | undefined,
  school: string | undefined,
  levelOfStudy: string | undefined,
  major: string | undefined,
  status: string | undefined,
) => {
  try {
    const conditions = [];

    if (firstName)
      conditions.push(
        like(hackerApplications.firstName || "", `${firstName}%`),
      );
    if (lastName)
      conditions.push(like(hackerApplications.lastName || "", `${lastName}%`));
    if (school)
      conditions.push(like(hackerApplications.school || "", `%${school}%`));
    if (major)
      conditions.push(like(hackerApplications.major || "", `%${major}%`));

    if (levelOfStudy && levelOfStudy !== "all") {
      conditions.push(eq(hackerApplications.levelOfStudy, levelOfStudy));
    }

    if (status && status !== "all") {
      conditions.push(eq(users.applicationStatus, status));
    }

    const hackers = await db
      .select({ count: count() })
      .from(hackerApplications)
      .innerJoin(users, eq(users.id, hackerApplications.userId))
      .where(and(...conditions));

    return hackers[0].count;
  } catch (error) {
    console.log("Error fetching number of hackers", error);
    return 0;
  }
};
