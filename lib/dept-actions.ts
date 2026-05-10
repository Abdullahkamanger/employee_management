"use server";

import { connectDB } from "@/lib/db";
import Department from "@/models/Department";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function createDepartment(name: string, description: string) {
  try {
    await connectDB();
    
    // Check if already exists
    const existing = await Department.findOne({ name });
    if (existing) {
      return { success: false, error: "Department already exists" };
    }

    await Department.create({ name, description });
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating department:", error);
    return { success: false, error: error.message || "Failed to create department" };
  }
}

export async function getDepartments() {
  try {
    await connectDB();
    
    // We use aggregation to count members in each department
    const departmentsWithCounts = await Department.aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "department",
          as: "members"
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          color: 1,
          head: 1,
          memberCount: { $size: "$members" }
        }
      },
      { $sort: { name: 1 } }
    ]);

    return { success: true, data: JSON.parse(JSON.stringify(departmentsWithCounts)) };
  } catch (error) {
    console.error("Error fetching departments:", error);
    return { success: false, data: [] };
  }
}

export async function deleteDepartment(id: string) {
  try {
    await connectDB();
    
    // Check if any users are in this department
    const usersInDept = await User.findOne({ department: id });
    if (usersInDept) {
      return { success: false, error: "Cannot delete department with assigned employees." };
    }

    await Department.findByIdAndDelete(id);
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete department" };
  }
}
