import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "Employee";
        token.hasPassword = user.hasPassword;
        token.status = user.status;
        token.department = user.department ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string | null;
        session.user.hasPassword = token.hasPassword as boolean;

        session.user.status = token.status as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
    newUser: "/onboarding",
  },
} satisfies NextAuthConfig;
