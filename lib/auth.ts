import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/DBClient";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User"; 
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("LOGIN ATTEMPT:", credentials?.email);
        await connectDB();
        
        // Find user by email
        const user = await User.findOne({ email: credentials?.email }).select("+password");
        console.log("USER FOUND:", !!user);
        
        // If no user or if it's a Google user (no password), return null
        if (!user || !user.password) {
          console.log("NO USER OR NO PASSWORD");
          return null;
        }

        // Block deactivated accounts
        if (user.status === "Inactive") {
          console.log("USER INACTIVE");
          return null;
        }

        // Check password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        console.log("PASSWORD VALID:", isValid);

        if (!isValid) return null;

        // Return the user object with all needed fields
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role, 
          hasPassword: user.hasPassword,
          status: user.status,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account }) {
      // Base logic from authConfig
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.hasPassword = (user as any).hasPassword;
        token.status = (user as any).status;
      }

      // Special handling for Google login to sync custom fields from DB
      if (account?.provider === "google") {
         await connectDB();
         const dbUser = await User.findOne({ email: token.email });
         if (dbUser) {
           token.role = dbUser.role;
           token.hasPassword = dbUser.hasPassword;
           token.status = dbUser.status || "Active";
         }
      }

      return token;
    },
  }
});