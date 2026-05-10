import mongoose, { Schema, model, models } from "mongoose";

export interface IDepartment extends mongoose.Document {
  name: string;
  description?: string;
  head?: mongoose.Types.ObjectId;
  color?: string;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { 
      type: String, 
      required: [true, "Department name is required"], 
      unique: true,
      trim: true 
    },
    description: { 
      type: String 
    },
    head: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    }, // Link to an Admin/Manager
    color: { 
      type: String, 
      default: "text-purple-400" 
    }, // For UI styling
  },
  { 
    timestamps: true 
  }
);

const Department = models.Department || model<IDepartment>("Department", DepartmentSchema);
export default Department;
