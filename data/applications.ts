import { RESULTS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { applicationReviews, hackerApplications, users } from "@/lib/db/schema";
import { and, asc, count, desc, ilike, eq } from "drizzle-orm";

export const getApplicationWithUserById = async (id: string) => {
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

export const getApplicationReviews = async (applicationId: string) => {
  try {
    return await db
      .select({
        id: applicationReviews.id,
        rating: applicationReviews.rating,
        createdAt: applicationReviews.createdAt,
        reviewerName: users.name,
        reviewerId: users.id,
      })
      .from(applicationReviews)
      .where(eq(applicationReviews.applicationId, applicationId))
      .innerJoin(users, eq(users.id, applicationReviews.reviewerId))
      .orderBy(desc(applicationReviews.createdAt));
  } catch (error) {
    console.log("Error fetching application reviews: ", error);
    return null;
  }
};

export const getApplicationById = async (userId: string) => {
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

export const getApplications = async (offsetAmt: number) => {
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
    console.log("Error fetching applications", error);
    return null;
  }
};

export const getNumApplications = async () => {
  try {
    const applications = await db
      .select({ count: count() })
      .from(hackerApplications);
    return applications[0].count;
  } catch (error) {
    console.log("Error fetching number of applications", error);
    return 0;
  }
};

export const getApplicationsSearch = async (
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
        ilike(hackerApplications.firstName || "", `${firstName}%`),
      );
    if (lastName)
      conditions.push(ilike(hackerApplications.lastName || "", `${lastName}%`));
    if (school)
      conditions.push(ilike(hackerApplications.school || "", `%${school}%`));
    if (major)
      conditions.push(ilike(hackerApplications.major || "", `%${major}%`));

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
    console.log("Error fetching applications", error);
    return null;
  }
};

export const getNumApplicationsSearch = async (
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
        ilike(hackerApplications.firstName || "", `${firstName}%`),
      );
    if (lastName)
      conditions.push(ilike(hackerApplications.lastName || "", `${lastName}%`));
    if (school)
      conditions.push(ilike(hackerApplications.school || "", `%${school}%`));
    if (major)
      conditions.push(ilike(hackerApplications.major || "", `%${major}%`));

    if (levelOfStudy && levelOfStudy !== "all") {
      conditions.push(eq(hackerApplications.levelOfStudy, levelOfStudy));
    }

    if (status && status !== "all") {
      conditions.push(eq(users.applicationStatus, status));
    }

    const applications = await db
      .select({ count: count() })
      .from(hackerApplications)
      .innerJoin(users, eq(users.id, hackerApplications.userId))
      .where(and(...conditions));

    return applications[0].count;
  } catch (error) {
    console.log("Error fetching number of applications", error);
    return 0;
  }
};
