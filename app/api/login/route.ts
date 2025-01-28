import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

import { ApiResponse } from "@/types/api";
import { getUserByEmail } from "@/lib/db/queries/user";
import { LoginSchema } from "@/lib/validations/login";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
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

    const email = validatedEmail.toLowerCase();

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (existingUser.role !== "admin") {
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
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

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
        return NextResponse.json({
          success: false,
          message: "Invalid email or password.",
        });
      }
    }

    // Any other unhandled errors
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
}
