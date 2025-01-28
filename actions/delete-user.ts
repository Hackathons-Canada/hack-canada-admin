"use server";

import { getCurrentUser } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const deleteUser = async (id: string, input: string) => {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return {
      error: "Unauthorized",
    };
  }

  const schema = z.string().trim().min(1).max(32);

  const validatedId = schema.safeParse(input);

  if (!validatedId.success) {
    return {
      error: "Invalid ID Provided",
    };
  }

  if (id !== validatedId.data) {
    return {
      error: "Invalid ID Provided",
    };
  }

  if (user.id === validatedId.data) {
    return {
      error: "Cannot delete yourself.",
    };
  }

  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, validatedId.data));

    if (!existingUser) {
      return {
        error: "User not found.",
      };
    }

    if (existingUser.role === "admin") {
      return {
        error:
          "Cannot delete another admin. Only super admins can delete other admins.",
      };
    }

    await db.delete(users).where(eq(users.id, existingUser.id));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting user: ", error);
    return {
      error: "An error occurred while deleting the user.",
    };
  }
};
