"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Loader2, Mail, Shield, User, LayoutGrid, DollarSign, Briefcase } from "lucide-react";
import { createEmployee } from "@/lib/employee-actions";
import { getDepartments } from "@/lib/dept-actions";
import { toast } from "sonner";

export default function AddEmployeeModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchDepts = async () => {
        const res = await getDepartments();
        if (res.success) {
          setDepartments(res.data);
        }
      };
      fetchDepts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      department: formData.get("department") as string,
      salary: Number(formData.get("salary")) || 0,
      designation: formData.get("designation") as string,
    };

    try {
      const res = await createEmployee(data);
      if (res.success) {
        toast.success(`Account created for ${data.name}!`);
        onClose();
      } else {
        setError(res.error || "An unknown error occurred");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/60 backdrop-blur-sm transition-all duration-500">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-white/10 p-8 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus className="text-purple-400" /> New Employee
            </h3>
            <p className="text-xs text-slate-500 mt-1">Add a new member to your organization.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600" 
              placeholder="e.g. Senior Developer, Marketing Lead" 
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="Employee" className="bg-slate-900">Employee</option>
                  <option value="Manager" className="bg-slate-900">Manager</option>
                  <option value="Admin" className="bg-slate-900">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600" 
              placeholder="e.g. 5000" 
            />
          </div>

          <div className="pt-8">
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create Employee Account</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
