"use server";

import { connectDB } from "@/lib/db"; 
import User from "@/models/User"; 
import { revalidatePath } from "next/cache";
import { sendInviteEmail, sendApprovalEmail } from "./mail";


type UserType = {
   name: string;
    email: string;
    password?: string; // Optional because Google users don't have passwords
    image?: string;
    role: "Admin" | "Manager" | "Employee";
    department?: string | null;
    emailVerified: Date | null;
    hasPassword: boolean;
    salary: number;
    designation: string;
    status: "Pending" | "Active" | "Inactive";
    setupToken?: string;
    notifications?: {
      email: boolean;
      payroll: boolean;
      newJoiners: boolean;
    }
};




export async function getAllEmployees(filters?: { search?: string; department?: string; status?: string,role?: "Employee" | "Admin" | "Manager" | { $in: Array<"Employee" | "Admin" | "Manager"> } }) {
  try {
    await connectDB();
    
    const query: {
      name?:object,
      department?:string,
      role?: "Employee" | "Admin" | "Manager" | { $in: Array<"Employee" | "Admin" | "Manager"> }
      status?:string | object,


    } = {};
    
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
    if (filters?.role) {
      query.role = filters.role;
    }

    const employees = await User.find(query)
      .select("-password") 
      .populate("department", "name")
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(employees)) };
  } catch (error) {
  //  console.error("Error fetching employees:", error);
  const message = error instanceof Error ? error.message : "Failed to fetch employees"
    return { success: false, error: message };
  }
}



export async function createEmployee(data: Partial<UserType>) {
  try {
    await connectDB();
    
    const setupToken = crypto.randomUUID();
    
    // Create new user with hasPassword: false and department link
    const newUser = await User.create({
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      salary: data.salary || 0,
      designation: data.designation || "Un-Assigned",
      hasPassword: false, 
      status: "Active",
      setupToken: setupToken,
    });

    // Send the invite email
    await sendInviteEmail(newUser.email as string, newUser.name as string, newUser.setupToken);

    // This clears the cache so the Employee Table updates immediately
    revalidatePath("/admin/employees");
    
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message :" Failed to create Employee"
    // console.error("Error creating employee:", error);
    return { success: false, error: message };
  }
}

export async function deleteEmployee(id: string) {
  try {
    await connectDB();
    await User.findByIdAndDelete(id);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error? error.message : "Failed to delete Employee"
    return { success: false, error: message};
  }
}

export async function updateEmployee(id: string, data: Partial<UserType>) {
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
  } catch (error) {
    const message = error instanceof Error ? error.message :"Failed to update Employee"
    return { success: false, error:message };
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
    // console.error("Error fetching employee profile:", error);
    const message = error instanceof Error ? error.message :"Failed to fetch profile";
    return { success: false, error: message };
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
    // console.error("Error fetching admin users:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch admin users";
    return { success: false, error: message, data: [] };
  }
}