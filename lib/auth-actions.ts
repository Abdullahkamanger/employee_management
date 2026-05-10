"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function changePassword(data: any) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const { currentPassword, newPassword } = data;

    await connectDB();
    // Use select("+password") to fetch the hidden password field
    const user = await User.findOne({ email: session.user.email }).select("+password");

    if (!user || !user.password) {
      throw new Error("User account error. Please contact support.");
    }

    // 1. Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("The current password you entered is incorrect.");
    }

    // 2. Hash and Save New Password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Change password error:", error);
    return { success: false, error: error.message || "Failed to update password" };
  }
}
