import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { ApiResponse } from "@/types/api";
import { getUserByEmail } from "@/lib/db/queries/user";
import { LoginSchema } from "@/lib/validations/login";
import { createAuditLog } from "@/lib/db/queries/audit-log";
import { isReviewer } from "@/lib/utils";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  let existingUser;
  let email;

  try {
    const body = await req.json();

    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { email: validatedEmail, password } = validatedFields.data;

    email = validatedEmail.toLowerCase();

    existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!isReviewer(existingUser.role)) {
      // Log non-organizer login attempt
      await createAuditLog({
        userId: existingUser.id,
        action: "create",
        entityType: "session",
        entityId: existingUser.id,
        metadata: {
          reason: "Unauthorized access attempt - Non-organizer user",
          email: email,
        },
      });

      return NextResponse.json({
        success: false,
        message: "You are not authorized to access this dashboard.",
      });
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result) {
      // Log failed login attempt
      await createAuditLog({
        userId: existingUser.id,
        action: "create",
        entityType: "session",
        entityId: existingUser.id,
        metadata: {
          reason: "Failed login attempt - Invalid credentials",
          email: email,
        },
      });

      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Log successful login
    await createAuditLog({
      userId: existingUser.id,
      action: "create",
      entityType: "session",
      entityId: existingUser.id,
      metadata: {
        reason: "Successful organizer login",
        email: email,
      },
    });

    // If everything is successful
    return NextResponse.json({
      success: true,
      message: "Welcome!",
    });
  } catch (error) {
    console.error("Error during login:", error);

    // Handling known errors
    if (error instanceof Error) {
      const { type } = error as AuthError;
      if (type === "CredentialsSignin") {
        // Log failed login attempt
        if (existingUser) {
          await createAuditLog({
            userId: existingUser.id,
            action: "create",
            entityType: "session",
            entityId: existingUser.id,
            metadata: {
              reason: "Failed login attempt - Invalid credentials",
              email: email,
              error: type,
            },
          });
        }

        return NextResponse.json({
          success: false,
          message: "Invalid email or password.",
        });
      }
    }

    // Log unhandled error
    if (existingUser) {
      await createAuditLog({
        userId: existingUser.id,
        action: "create",
        entityType: "session",
        entityId: existingUser.id,
        metadata: {
          reason: "Failed login attempt - Unhandled error",
          email: email,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }

    // Any other unhandled errors
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
}
