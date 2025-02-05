import { RESULTS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";

type User = typeof users.$inferSelect;

/**
 * Retrieves a user by their ID from the database.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @return {Promise<User | null>} The user object if found, otherwise null.
 */
export const getUserById: (id: string) => Promise<User | null> = async (
  id: string,
): Promise<User | null> => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  } catch (error) {
    console.log("Error fetching user with ID: " + id, error);
    return null;
  }
};

export const getAdminUsers = async () => {
  try {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .orderBy(desc(users.createdAt));
  } catch (error) {
    console.log("Error fetching admin users", error);
    return [];
  }
};

// getting list of top offset+RESULTS_PER_PAGE users in db
export const getAllUsers = async (offsetAmt: number = 0) => {
  try {
    return await db
      .select()
      .from(users)
      .limit(RESULTS_PER_PAGE)
      .offset(offsetAmt)
      .orderBy(desc(users.createdAt));
  } catch (error) {
    console.log("Error fetching all users", error);
    return [];
  }
};

export const getAdminsAndOrganizers = async () => {
  try {
    return await db
      .select()
      .from(users)
      .where(or(eq(users.role, "admin"), eq(users.role, "organizer")))
      .orderBy(desc(users.createdAt));
  } catch (error) {
    console.log("Error fetching admins and organizers", error);
    return [];
  }
};

// getting total num of users
export const getNumUsers = async () => {
  try {
    const res = await db.select({ count: count() }).from(users);
    return res[0].count;
  } catch (error) {
    console.log("Error fetching number of users", error);
    return null;
  }
};

export const getUsersSearch = async (
  role: string,
  name: string,
  email: string,
  status: string,
  offsetAmt: number,
) => {
  try {
    const conditions = [];

    if (role !== "all") {
      conditions.push(eq(users.role, role));
    }

    if (name) {
      conditions.push(ilike(users.name, `%${name}%`));
    }

    if (email) {
      conditions.push(ilike(users.email, `%${email}%`));
    }

    if (status !== "all") {
      if (status === "noApplication") {
        conditions.push(eq(users.applicationStatus, "not_applied"));
      } else {
        conditions.push(eq(users.applicationStatus, status));
      }
    }

    return await db
      .select()
      .from(users)
      .limit(RESULTS_PER_PAGE)
      .offset(offsetAmt)
      .orderBy(desc(users.createdAt))
      .where(and(...conditions));
  } catch (error) {
    console.log("Error searching users", error);
    return [];
  }
};

export const getNumUsersSearch = async (
  role: string,
  name: string,
  email: string,
  status: string,
) => {
  try {
    const conditions = [];

    if (role !== "all") {
      conditions.push(eq(users.role, role));
    }

    if (name) {
      conditions.push(ilike(users.name, `%${name}%`));
    }

    if (email) {
      conditions.push(ilike(users.email, `%${email}%`));
    }

    if (status !== "all") {
      if (status === "noApplication") {
        conditions.push(eq(users.applicationStatus, "not_applied"));
      } else {
        conditions.push(eq(users.applicationStatus, status));
      }
    }

    const results = await db
      .select({ count: count() })
      .from(users)
      .where(and(...conditions));

    return results[0].count;
  } catch (error) {
    console.log("Error fetching number of users", error);
    return 0;
  }
};
