import mongoose, { Schema, model, models } from "mongoose";

// Define the User structure for TypeScript
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string; // Optional because Google users don't have passwords
  image?: string;
  role: "Admin" | "Manager" | "Employee";
  department?: mongoose.Types.ObjectId | any;
  emailVerified: Date | null;
  hasPassword: boolean;
  salary: number;
  designation: string;
  notifications?: {
    email: boolean;
    payroll: boolean;
    newJoiners: boolean;
  };
  twoFactor?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"] 
    },
    email: { 
      type: String, 
      unique: true, 
      required: [true, "Email is required"],
      lowercase: true,
      trim: true
    },
    password: { 
      type: String, 
      select: false, // Prevents password from being returned in queries by default
    },
    image: { 
      type: String 
    },
    role: { 
      type: String, 
      enum: ["Admin", "Manager", "Employee"], 
      default: "Employee" 
    },
    department: { 
      type: Schema.Types.ObjectId,
      ref: "Department"
    },
    emailVerified: { 
      type: Date, 
      default: null 
    },
    hasPassword: {
      type: Boolean,
      default: false
    },
    salary: {
      type: Number,
      default: 0
    },
    designation: {
      type: String,
      default: "Staff"
    },
    notifications: {
      email: { type: Boolean, default: true },
      payroll: { type: Boolean, default: true },
      newJoiners: { type: Boolean, default: true },
    },
    twoFactor: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// This "models.User || model..." check is critical for Next.js 
// to prevent re-defining the model during hot reloads.
const User = models.User || model<IUser>("User", UserSchema);

export default User;