"use server";

import { connectDB } from "@/lib/db"; 
import User, { IUser } from "@/models/User"; 
import { revalidatePath } from "next/cache";
import { sendInviteEmail } from "./mail";

export async function getAllEmployees(filters?: { search?: string; department?: string }) {
  try {
    await connectDB();
    
    let query: any = {};
    
    if (filters?.search) {
      query.name = { $regex: filters.search, $options: "i" };
    }
    
    if (filters?.department) {
      query.department = filters.department;
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
    
    // Create new user with hasPassword: false and department link
    await User.create({
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      salary: data.salary || 0,
      designation: data.designation || "Staff",
      hasPassword: false, 
    });

    // Send the invite email
    await sendInviteEmail(data.email, data.name);

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
    await User.findByIdAndUpdate(id, data);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update employee" };
  }
}