"use server";

import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { users, hackerApplications } from "@/lib/db/schema";

export const getDownloadableFile = async (entity: "users" | "applications") => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized",
    };
  }

  try {
    if (entity === "users") {
      const userList = await db.select().from(users);
      return userList;
    } else if (entity === "applications") {
      const applicationList = await db.select().from(hackerApplications);
      return applicationList;
    }
  } catch (error) {
    console.log("Error fetching all users", error);
    return [];
  }
};
