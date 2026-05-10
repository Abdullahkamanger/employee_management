import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/DBClient";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User"; 

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  // 1. Pages must be OUTSIDE of providers
  pages: {
    signIn: "/signin",       // Point this to your custom login page
    error: "/signin",        // Redirect errors back to your login page
    newUser: "/onboarding",   // Where to send new users
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        
        // Find user by email
        const user = await User.findOne({ email: credentials?.email });
        
        // If no user or if it's a Google user (no password), return null
        if (!user || !user.password) return null;

        // Check password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        // Return the user object with the role for the callbacks below
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role, 
        };
      },
    }),
  ],
 // Inside your auth.ts callbacks
callbacks: {
  async jwt({ token, user, account }) {
    // 1. Initial Sign In
    if (user) {
      // If it's a Google login, the 'user' here is just what Google sent.
      // We need to ensure we have the DB version of the user.
      token.role = (user as any).role || "Employee";
      token.hasPassword = !!(user as any).password;
    }

    // 2. STRENGTHEN: If this was an OAuth login, we should double-check the DB
    // so the token stays in sync with our custom fields.
    if (account?.provider === "google") {
       const dbUser = await User.findOne({ email: token.email });
       if (dbUser) {
         token.role = dbUser.role;
         token.hasPassword = !!dbUser.password;
       }
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
});