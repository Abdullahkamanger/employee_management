"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payroll from "@/models/Payroll";
import { revalidatePath } from "next/cache";

export async function generateMonthlyPayroll(month: string) {
  try {
    await connectDB();
    
    // 1. Get all employees (excluding Admins usually, but let's do all for now or filter)
    const employees = await User.find({ role: { $ne: "Admin" } });

    if (employees.length === 0) {
      return { success: false, error: "No employees found to generate payroll." };
    }

    // 2. Check if payroll for this month already exists to avoid duplicates
    const existing = await Payroll.findOne({ month });
    if (existing) {
      return { success: false, error: `Payroll for ${month} has already been generated.` };
    }

    // 3. Create a payroll record for each
    const payrollEntries = employees.map(emp => ({
      employeeId: emp._id,
      amount: emp.salary || 3000, // Default if not set
      month: month,
      status: "Pending",
      paymentMethod: "Bank Transfer"
    }));

    await Payroll.insertMany(payrollEntries);
    
    revalidatePath("/admin/payroll");
    return { success: true };
  } catch (error: any) {
    console.error("Payroll generation error:", error);
    return { success: false, error: error.message || "Failed to generate payroll" };
  }
}

export async function getPayrollHistory() {
  try {
    await connectDB();
    const history = await Payroll.find({})
      .populate("employeeId", "name email designation")
      .sort({ createdAt: -1 })
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(history)) };
  } catch (error) {
    console.error("Error fetching payroll history:", error);
    return { success: false, data: [] };
  }
}

export async function updatePayrollStatus(id: string, status: "Pending" | "Processing" | "Paid") {
  try {
    await connectDB();
    await Payroll.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/payroll");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update payroll status" };
  }
}

export async function getUserPayroll(employeeId: string) {
  try {
    await connectDB();
    const history = await Payroll.find({ employeeId })
      .sort({ month: -1 })
      .limit(6)
      .lean();
    
    return { success: true, data: JSON.parse(JSON.stringify(history)) };
  } catch (error) {
    console.error("Error fetching user payroll:", error);
    return { success: false, data: [] };
  }
}

