"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

// 1. Define a Validation Schema
const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUser = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    // 2. Validate fields using Zod
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }

    const { name, email, password } = validatedFields.data;

    // 3. Connect to DB
    await connectDB();

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email already in use!" };
    }

    // 5. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Create the user
    // Note: We set the first user as 'Admin' or keep it 'Employee' by default
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Employee", 
    });

    return { success: "User created successfully!" };
  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
};