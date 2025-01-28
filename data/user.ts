import { RESULTS_PER_PAGE } from "@/lib/constants";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { User } from "@/types/user";
import { eq, count, desc, like, and } from "drizzle-orm";

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
  role = role === "all" ? "" : role;
  return await db
    .select()
    .from(users)
    .limit(RESULTS_PER_PAGE)
    .offset(offsetAmt)
    .orderBy(desc(users.createdAt))
    .where(
      and(
        like(users.role, `${role}%`),
        like(users.firstName, `${firstName}%`),
        like(users.lastName, `${lastName}%`),
      ),
    );
};

export const getNumUsersSearch = async (
  role: any,
  firstName: string | string[],
  lastName: string | string[],
) => {
  try {
    if (role === "all") {
      const results = await db
        .select({ count: count() })
        .from(users)
        .where(
          and(
            like(users.firstName, `${String(firstName)}%`),
            like(users.lastName, `${String(lastName)}%`),
          ),
        );
      return results[0].count;
    }
    const results = await db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.role, role),
          like(users.firstName, `${String(firstName)}%`),
          like(users.lastName, `${String(lastName)}%`),
        ),
      );
    return results[0].count;
  } catch (error) {
    console.log("Error fetching number of users", error);
    return 0;
  }
};
