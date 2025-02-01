import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { ApiResponse } from "@/types/api";
import { getCurrentUser } from "@/auth";
import { createAuditLog } from "@/lib/db/queries/audit-log";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  let user;
  let role;

  try {
    user = await getCurrentUser();
    const body = await req.json();
    role = body.role;

    // Get the target user's current role
    const targetUser = await db.query.users.findFirst({
      where: eq(users.id, params.userId),
    });

    if (!targetUser) {
      return Response.json({
        success: false,
        message: "User not found",
        error: "User not found",
      } as ApiResponse);
    }

    if (
      !user ||
      !user.id ||
      user.role !== "admin" ||
      user.id === params.userId
    ) {
      // Log unauthorized attempt
      await createAuditLog({
        userId: user?.id || "unknown",
        action: "update",
        entityType: "user",
        entityId: params.userId,
        metadata: {
          reason: "Unauthorized role update attempt",
          attempted_role: role,
          requestedBy: user?.id || "unknown",
        },
      });

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
      // Log invalid role attempt
      await createAuditLog({
        userId: user.id,
        action: "update",
        entityType: "user",
        entityId: params.userId,
        metadata: {
          reason: "Invalid role update attempt",
          attempted_role: role,
          valid_roles: validRoles,
        },
      });

      return Response.json({
        success: false,
        message: "Invalid role provided",
        error: `Role must be one of: ${validRoles.join(", ")}`,
      } as ApiResponse);
    }

    // Create audit log before updating
    await createAuditLog({
      userId: user.id,
      action: "update",
      entityType: "user",
      entityId: params.userId,
      previousValue: { role: targetUser.role },
      newValue: { role: role as UserRole },
      metadata: {
        reason: "User role update",
        updatedBy: user.id,
      },
    });

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

    // Log error
    await createAuditLog({
      userId: user?.id || "unknown",
      action: "update",
      entityType: "user",
      entityId: params.userId,
      metadata: {
        reason: "Failed role update",
        error: error instanceof Error ? error.message : "Unknown error",
        attempted_role: role || "unknown",
      },
    });

    return Response.json({
      success: false,
      message: "Failed to update user role",
      error: "Internal server error",
    } as ApiResponse);
  }
}
