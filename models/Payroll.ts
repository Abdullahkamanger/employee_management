import mongoose, { Schema, model, models } from "mongoose";

export interface IPayroll extends mongoose.Document {
  employeeId: mongoose.Types.ObjectId;
  amount: number;
  month: string;
  status: "Pending" | "Processing" | "Paid";
  paymentMethod: string;
}

const PayrollSchema = new Schema<IPayroll>(
  {
    employeeId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    month: { 
      type: String, 
      required: true 
    }, // e.g., "May 2026"
    status: { 
      type: String, 
      enum: ["Pending", "Processing", "Paid"], 
      default: "Pending" 
    },
    paymentMethod: { 
      type: String, 
      default: "Bank Transfer" 
    }
  },
  { 
    timestamps: true 
  }
);

const Payroll = models.Payroll || model<IPayroll>("Payroll", PayrollSchema);
export default Payroll;
