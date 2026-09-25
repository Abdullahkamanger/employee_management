import mongoose, { Schema, model, models } from "mongoose";

// Define the User structure for TypeScript
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string | null; // Optional because Google users don't have passwords
  image?: string | null;
  role: "Admin" | "Manager" | "Employee";
  department?: mongoose.Types.ObjectId | null;
  emailVerified: Date | null;
  // hasPassword: boolean;
 payStructure: {
 payBasis: "Hourly" | "Salaried" | "Piece_Rate" | "Daily" | "Commission" | "Stipend";
  baseRate: mongoose.Types.Decimal128;
  overtimeRate?: mongoose.Types.Decimal128;
  payFrequency:"Daily" | "Weekly" | "Biweekly" | "Semimonthly" | "Monthly";
  currency: string;
  pieceRateUnit?: string;
  effectiveFrom: Date;
}
  designation: string;
  employmentType: "Full_Time" | "Part_Time" | "Temporary" | "Intern" | "Seasonal" | "Contractor";
  status: "Pending" | "Active" | "Inactive" | "Terminated" | "Suspended";
 setupTokenHash?: string;
setupTokenExpiresAt?: Date;
setupTokenUsedAt?: Date;
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
        default: null
    },
    image: { 
      type: String ,
      default: null
    },
    role: { 
      type: String, 
      enum: ["Admin", "Manager", "Employee"], 
      default: "Employee" 
    },
    department: { 
      type: Schema.Types.ObjectId,
      ref: "Department",
      default: null
    },
    employmentType:{
      type: String,
      enum: ["Full_Time", "Part_Time", "Temporary", "Intern", "Seasonal", "Contractor"],
      required: [true, "Employment type is required"],
    },
    emailVerified: { 
      type: Date, 
      default: null 
    },
    payStructure: {
      payBasis: { type: String, enum: ["Hourly", "Salaried", "Piece_Rate", "Daily", "Commission", "Stipend"], required: [true, "Pay basis is required"] },
      baseRate: { type: Schema.Types.Decimal128, required: [true, "Base rate is required"] },
      overtimeRate: { type: Schema.Types.Decimal128, default: 0 },
      payFrequency: { type: String, enum: ["Daily", "Weekly", "Biweekly", "Semimonthly", "Monthly"], required: [true, "Pay frequency is required"] },
      currency: { type: String, required: [true, "Currency is required"] },
      pieceRateUnit: { type: String },
      effectiveFrom: { type: Date, required: [true, "Effective from is required"] }

    },
    designation: {
      type: String,
      default: "Staff"
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive","Terminated", "Suspended"],
      default: "Pending"
    },

    setupTokenHash: { type: String },
    setupTokenExpiresAt: { type: Date },
    setupTokenUsedAt: { type: Date },

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


UserSchema.pre("validate", function () {
  if (
    this.payStructure.payBasis === "Piece_Rate" &&
    !this.payStructure.pieceRateUnit
  ) {
    this.invalidate(
      "payStructure.pieceRateUnit",
      "Piece-rate employees require a piece-rate unit."
    );
  }
});


// This "models.User || model..." check is critical for Next.js 
// to prevent re-defining the model during hot reloads.
// If status is missing in your DB, try restarting the dev server to refresh this model.
const User = models.User || model<IUser>("User", UserSchema);

export default User;