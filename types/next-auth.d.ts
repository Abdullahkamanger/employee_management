import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      hasPassword: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    hasPassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    hasPassword: boolean;
  }
}