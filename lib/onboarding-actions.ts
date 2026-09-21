"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt, { genSaltSync } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function completeOnboarding(password: string, token?: string, email?: string) {
  try {
    let targetEmail: string | undefined;

    await connectDB();

    if (token && email) {
      const user = await User.findOne({ email, setupToken: token });
      if (!user || user.setupToken !== token || user.hasPassword || user.setupToken === null) {
        return { success: false, error: "Invalid or expired setup link." };
      }
      targetEmail = email;
    } else {
      const session = await auth();
      if (!session?.user?.email) {
        return { success: false, error: "Unauthorized" };
      }
      targetEmail = session.user.email;
    }

    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, genSaltSync(10));

    // 2. Update the user
    await User.findOneAndUpdate(
      { email: targetEmail },
      {
        password: hashedPassword,
        hasPassword: true,
        setupToken: null // Clear the token once used
      }
    );

    // Clear cache to allow access to protected routes
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "failed to complete onboarding";
    console.error("Onboarding error:", error);
    return { success: false, error: message };
  }
}
