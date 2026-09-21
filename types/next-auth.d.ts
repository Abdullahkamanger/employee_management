import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      hasPassword: boolean;
      status: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    hasPassword: boolean;
    status: string;
    department?: string | null; // Optional department field

  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    hasPassword: boolean;
    status: string;
    department?: string | null; // Optional department field
  }
}