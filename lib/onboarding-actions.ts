"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function completeOnboarding(password: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    await connectDB();

    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 2. Update the user
    await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        password: hashedPassword, 
        hasPassword: true 
      }
    );

    // Clear cache to allow access to protected routes
    revalidatePath("/"); 
    
    return { success: true };
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return { success: false, error: error.message || "Failed to complete onboarding" };
  }
}
