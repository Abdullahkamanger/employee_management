"use server";

import { connectDB } from "@/lib/db"; 
import User from "@/models/User"; 

export async function getAllEmployees() {
  try {
    await connectDB();
    
    // Fetch users, sorting by newest first
    // We lean() it to get plain JS objects instead of heavy Mongoose documents
    const employees = await User.find({ })
      .select("-password") // NEVER send the password to the client
      .sort({ createdAt: -1 });

    return { success: true, data: JSON.parse(JSON.stringify(employees)) };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { success: false, error: "Failed to fetch employees" };
  }
}