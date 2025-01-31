import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { ApiResponse } from "@/types/api";
import { getCurrentUser } from "@/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const user = await getCurrentUser();
    const { role } = await req.json();

    if (!user || user.role !== "admin" || user.id === params.userId) {
      return Response.json({
        success: false,
        message: "You are not authorized to perform this action",
        error: "You are not authorized to perform this action",
      } as ApiResponse);
    }

    if (!role) {
      return Response.json({
        success: false,
        message: "Role is required",
        error: "Missing role in request body",
      } as ApiResponse);
    }

    const validRoles: UserRole[] = [
      "admin",
      "hacker",
      "organizer",
      "mentor",
      "volunteer",
      "judge",
      "unassigned",
    ];

    if (!validRoles.includes(role as UserRole)) {
      return Response.json({
        success: false,
        message: "Invalid role provided",
        error: `Role must be one of: ${validRoles.join(", ")}`,
      } as ApiResponse);
    }

    await db
      .update(users)
      .set({ role: role as UserRole })
      .where(eq(users.id, params.userId));

    return Response.json({
      success: true,
      message: `User role successfully updated to ${role}`,
    } as ApiResponse);
  } catch (error) {
    console.error("[UPDATE_USER_ROLE_ERROR]", error);
    return Response.json({
      success: false,
      message: "Failed to update user role",
      error: "Internal server error",
    } as ApiResponse);
  }
}
