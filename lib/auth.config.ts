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
        token.role = (user as any).role || "Employee";
        token.hasPassword = (user as any).hasPassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        //@ts-ignore
        session.user.hasPassword = token.hasPassword as boolean;
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
