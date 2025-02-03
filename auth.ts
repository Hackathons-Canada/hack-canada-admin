import { cache } from "react";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { DefaultSession } from "next-auth";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./lib/db/queries/user";
import { isReviewer } from "./lib/utils";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      status: ApplicationStatus;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
  },
  cookies: {
    sessionToken: {
      name: "authjs.session-token-admin",
    },
  },
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account, user }): Promise<boolean | string> {
      if (!user.id) {
        return false;
      }

      const existingUser = await getUserById(user.id);

      if (
        !existingUser?.id ||
        !existingUser.email ||
        !isReviewer(existingUser.role)
      ) {
        return false;
      }

      return true;
    },
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        if (token.role) {
          session.user.role = token.role as UserRole;
        }

        if (token.status) {
          session.user.status = token.status as ApplicationStatus;
        }

        session.user.name = token.name;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role as UserRole | "unassigned";
      token.status = existingUser.applicationStatus as
        | ApplicationStatus
        | "not_applied";

      return token;
    },
  },
  ...authConfig,
});

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
});
