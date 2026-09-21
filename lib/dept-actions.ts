"use server";

import { connectDB } from "@/lib/db";
import Department from "@/models/Department";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

type DeptData = {
  name: string;
  description?: string;
  head?: string;
  color?: string;
};

export async function createDepartment(deptData:DeptData) {
  try {
    const Data = {
      name: deptData.name,
      description: deptData.description,
      head: deptData.head,
      color: deptData.color,
    }
    await connectDB();

    // Check if already exists
    const existing = await Department.findOne({ name: Data.name });
    if (existing) {
      return { success: false, error: "Department already exists" };
    }

    await Department.create({ name: Data.name, description: Data.description, head: Data.head });
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown Error occured";
    console.error("Error creating department:", error);
    return { success: false, error: message || "Failed to create department" };
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
    const message = error instanceof Error ? error.message : "An unknown Error occured";
    return { success: false, data: [], error: message };
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error Occured"
    return { success: false, error: message || "Failed to delete department" };
  }
}
