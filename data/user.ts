import { RESULTS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, count, desc, like, and } from "drizzle-orm";

type User = typeof users.$inferSelect;

/**
 * Retrieves a user by their ID from the database.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @return {Promise<User | null>} The user object if found, otherwise null.
 */
export const getUserById: (id: string) => Promise<User | null> = async (
  id: string,
) => {
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
    const adminUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .orderBy(desc(users.createdAt));
    return adminUsers;
  } catch (error) {
    console.log("Error fetching admin users", error);
    return [];
  }
};

// getting list of top offset+RESULTS_PER_PAGE users in db
export const getAllUsers = async (offsetAmt: number = 0) => {
  try {
    const all = await db
      .select()
      .from(users)
      .limit(RESULTS_PER_PAGE)
      .offset(offsetAmt)
      .orderBy(desc(users.createdAt));
    return all;
  } catch (error) {
    console.log("Error fetching all users", error);
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
  role: any,
  firstName: string | string[],
  lastName: string | string[],
  offsetAmt: number,
) => {
  try {
    role = role === "all" ? "" : role;
    const searchName = `${firstName} ${lastName}`.trim();

    return await db
      .select()
      .from(users)
      .limit(RESULTS_PER_PAGE)
      .offset(offsetAmt)
      .orderBy(desc(users.createdAt))
      .where(
        and(
          role ? eq(users.role, role) : undefined,
          searchName ? like(users.name, `${searchName}%`) : undefined,
        ),
      );
  } catch (error) {
    console.log("Error searching users", error);
    return [];
  }
};

export const getNumUsersSearch = async (
  role: any,
  firstName: string | string[],
  lastName: string | string[],
) => {
  try {
    const searchName = `${firstName} ${lastName}`.trim();

    if (role === "all") {
      const results = await db
        .select({ count: count() })
        .from(users)
        .where(searchName ? like(users.name, `${searchName}%`) : undefined);
      return results[0].count;
    }

    const results = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.role, role),
          searchName ? like(users.name, `${searchName}%`) : undefined,
        ),
      );
    return results[0].count;
  } catch (error) {
    console.log("Error fetching number of users", error);
    return 0;
  }
};
