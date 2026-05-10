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
        token.role = (user as any).role || "Employee";
        token.hasPassword = (user as any).hasPassword;
        token.status = (user as any).status || "Active";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        //@ts-ignore
        session.user.hasPassword = token.hasPassword as boolean;
        //@ts-ignore
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
