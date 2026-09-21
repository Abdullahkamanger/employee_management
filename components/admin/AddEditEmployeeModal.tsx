"use client";

import { useState, useEffect, useReducer } from "react";
import { X, UserPlus, Loader2, Mail, Shield, User, LayoutGrid, DollarSign, Briefcase, Save } from "lucide-react";
import { createEmployee, updateEmployee } from "@/lib/employee-actions";
import { getDepartments } from "@/lib/dept-actions";
import { toast } from "sonner";

type Role = "Employee" | "Admin" | "Manager";
type Status = "Pending" | "Active" | "Inactive";
type Department = {
  _id: string;
  name: string;
};

type FormData = {
  name: string;
  email: string;
  role: Role;
  department: string;
  salary: number;
  designation: string;
};

const initialFormData: FormData = {
  name: "",
  email: "",
  role: "Employee",
  department: "",
  salary: 0,
  designation: "",
};

type FormAction =
   { type: "replace"; payload: FormData }
  | { type: "update"; name: string; value: string | number };


function formDataReducer(formData: FormData, action: FormAction): FormData {
  if (action.type === "replace") {
    return action.payload;
  }

  return {
    ...formData,
    [action.name]: action.value,
  } as FormData;
}

type Employee = {
  _id: string;
  name: string;
  email: string;
  role: string;
  designation?: string;
  salary?: number;
  department?: Department;
  status?: string;
}

export default function AddEditEmployeeModal({
  isOpen,
  onClose,
  employee = null
}: {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Form states to handle both create and edit
  const [formData, dispatchFormData] = useReducer(formDataReducer, initialFormData);

  const populateFormData = (employee: Employee) => {
    dispatchFormData({
      type: "replace",
      payload: {
        name: employee.name,
        email: employee.email,
        role: employee.role as Role,
        department: employee.department?._id || "",
        salary: employee.salary || 0,
        designation: employee.designation || "",
      },
    });
  };

  useEffect(  () => {
    if (isOpen) {
      // Reset form if opening for new employee, or populate if editing
      if (employee) {
        populateFormData(employee);
      } else {
        dispatchFormData({ type: "replace", payload: initialFormData });
      }

      const fetchDepts = async () => {
        const res = await getDepartments();
        if (res.success) {
          setDepartments(res.data);
        }
      };
      fetchDepts();
    }
  }, [isOpen, employee]);



  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (employee) {
        // Update Logic
        const updateData = { ...formData, status: undefined as Status | undefined };
        if (employee.status === "Pending") {
          updateData.status = "Active";
        }

        const res = await updateEmployee(
          employee._id,
          updateData as unknown as Parameters<typeof updateEmployee>[1]
        );
        if (res.success) {
          toast.success(employee.status === "Pending" ? `Approved ${formData.name}!` : `Updated ${formData.name}'s information!`);
          onClose();
        } else {
          setError(res.error || "Failed to update employee");
        }
      } else {
        // Create Logic
        const res = await createEmployee(formData);
        if (res.success) {
          toast.success(`Account created for ${formData.name}!`);
          onClose();
        } else {
          setError(res.error || "Failed to create employee");
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatchFormData({
      type: "update",
      name,
      value: name === "salary" ? Number(value) : value,
    });
  };
  // if (!isOpen) return null;
  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-end bg-black/10 backdrop-blur transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className={`w-full max-w-md h-full bg-slate-900 border-l border-white/10 p-8 shadow-2xl transition-all duration-200 flex flex-col overflow-hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {employee?.status === "Pending" ? <Shield className="text-emerald-400" /> : employee ? <Briefcase className="text-purple-400" /> : <UserPlus className="text-purple-400" />}
              {employee?.status === "Pending" ? "Approve Employee" : employee ? "Edit Employee" : "New Employee"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {employee?.status === "Pending" ? "Assign department and designation to activate account." : employee ? "Modify employee details and permissions." : "Add a new member to your organization."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-white/5 transition-all cursor-pointer transition-all hover:scale-110 hover:rotate-95 active:rotate-0"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <User size={12} /> Full Name
            </label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Mail size={12} /> Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
              placeholder="john@company.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={12} /> Designation
            </label>
            <input
              name="designation"
              required
              value={formData.designation}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
              placeholder="e.g. Senior Developer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} /> Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="Employee" className="bg-slate-900">Employee</option>
                  <option value="Manager" className="bg-slate-900">Manager</option>
                  <option value="Admin" className="bg-slate-900">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={12} /> Department
              </label>
              <div className="relative">
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900">Select...</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id} className="bg-slate-900">
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={12} /> Monthly Salary ($)
            </label>
            <input
              name="salary"
              type="number"
              required
              value={formData.salary}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600"
              placeholder="e.g. 5000"
            />
          </div>

          <div className="pt-8">
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>{employee ? "Saving Changes..." : "Creating Account..."}</span>
                </>
              ) : (
                <>
                  {employee ? <Save size={20} /> : <UserPlus size={20} />}
                  <span>{employee?.status === "Pending" ? "Approve & Activate" : employee ? "Save Changes" : "Create Employee Account"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
