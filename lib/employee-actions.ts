"use server";

import { connectDB } from "@/lib/db"; 
import User, { IUser } from "@/models/User"; 
import { revalidatePath } from "next/cache";
import { sendInviteEmail, sendApprovalEmail } from "./mail";

export async function getAllEmployees(filters?: { search?: string; department?: string; status?: string }) {
  try {
    await connectDB();
    
    let query: any = {};
    
    if (filters?.search) {
      query.name = { $regex: filters.search, $options: "i" };
    }
    
    if (filters?.department) {
      query.department = filters.department;
    }

    if (filters?.status) {
      if (filters.status === "Active") {
        query.status = { $in: ["Active", null, undefined] };
      } else {
        query.status = filters.status;
      }
    }

    const employees = await User.find(query)
      .select("-password") 
      .populate("department", "name")
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(employees)) };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, error: "Failed to fetch employees" };
  }
}

export async function createEmployee(data: { 
  name: string; 
  email: string; 
  role: string; 
  department?: string;
  salary?: number;
  designation?: string;
}) {
  try {
    await connectDB();
    
    const setupToken = crypto.randomUUID();
    
    // Create new user with hasPassword: false and department link
    await User.create({
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      salary: data.salary || 0,
      designation: data.designation || "Staff",
      hasPassword: false, 
      status: "Active",
      setupToken: setupToken,
    });

    // Send the invite email
    await sendInviteEmail(data.email, data.name, setupToken);

    // This clears the cache so the Employee Table updates immediately
    revalidatePath("/admin/employees");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return { success: false, error: error.message || "Failed to create employee" };
  }
}

export async function deleteEmployee(id: string) {
  try {
    await connectDB();
    await User.findByIdAndDelete(id);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete employee" };
  }
}

export async function updateEmployee(id: string, data: Partial<IUser>) {
  try {
    await connectDB();
    
    // If approving a user, we might need to send an email
    if (data.status === "Active") {
      const existingUser = await User.findById(id);
      if (existingUser && existingUser.status === "Pending") {
         await sendApprovalEmail(existingUser.email, existingUser.name);
      }
    }

    await User.findByIdAndUpdate(id, data);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update employee" };
  }
}

export async function getEmployeeProfile(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email })
      .select("-password")
      .populate("department", "name")
      .lean();
    
    if (!user) return { success: false, error: "User not found" };
    
    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function getAdminUsers() {
  try {
    await connectDB();
    const admins = await User.find({ 
      role: { $regex: /^admin$/i } 
    }).select("_id name email").lean();
    return { success: true, data: JSON.parse(JSON.stringify(admins)) };
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { success: false, data: [] };
  }
}