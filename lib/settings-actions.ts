"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserSettings(data: {
  name?: string;
  notifications?: {
    email: boolean;
    payroll: boolean;
    newJoiners: boolean;
  };
  twoFactor?: boolean;
}) {
  try {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    await connectDB();

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.notifications) updateData.notifications = data.notifications;
    if (typeof data.twoFactor !== "undefined") updateData.twoFactor = data.twoFactor;

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData }
    );

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error: any) {
    console.error("Settings update error:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}
