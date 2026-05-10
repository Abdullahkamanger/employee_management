import mongoose, { Schema, model, models } from "mongoose";

// Define the User structure for TypeScript
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string; // Optional because Google users don't have passwords
  image?: string;
  role: "Admin" | "Manager" | "Employee";
  department?: string;
  emailVerified: Date | null;
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
      // Not required because of Google Login
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
      type: String,
      default: "General"
    },
    emailVerified: { 
      type: Date, 
      default: null 
    },
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// This "models.User || model..." check is critical for Next.js 
// to prevent re-defining the model during hot reloads.
const User = models.User || model<IUser>("User", UserSchema);

export default User;