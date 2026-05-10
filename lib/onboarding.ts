"use server";

import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const setInitialPassword = async (password: string) => {
  const session = await auth();
  
  if (!session?.user?.email) return { error: "Not authenticated" };

  try {
    await connectDB();
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        password: hashedPassword,
        hasPassword: true 
      }
    );

    return { success: "Password set! You can now login with email too." };
  } catch (error) {
    return { error: "Failed to update account" };
  }
};