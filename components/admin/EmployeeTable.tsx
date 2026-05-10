"use client";

import { useState } from "react";
import { Mail, ShieldCheck, Calendar, LayoutGrid, Trash2, Edit2 } from "lucide-react";
import { deleteEmployee } from "@/lib/employee-actions";
import { toast } from "sonner";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function EmployeeTable({ employees }: { employees: Employee[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    const res = await deleteEmployee(deleteId);
    if (res.success) {
      toast.success(`Employee ${deleteName} deleted successfully.`);
    } else {
      toast.error(res.error || "Failed to delete employee.");
    }
    setDeleteId(null);
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-[10px] uppercase tracking-widest">
              <th className="px-6 py-4 font-bold">Employee</th>
              <th className="px-6 py-4 font-bold">Role</th>
              <th className="px-6 py-4 font-bold">Department</th>
              <th className="px-6 py-4 font-bold">Joined Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {employees.map((emp) => (
              <tr key={emp._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/20 transition-transform group-hover:scale-110">
                      {emp.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{emp.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Mail size={12} /> {emp.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    emp.role === "Admin" ? "bg-amber-400/10 text-amber-400 border border-amber-400/20" : "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                  }`}>
                    <ShieldCheck size={12} /> {emp.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <LayoutGrid size={14} className="text-slate-500" />
                    {emp.department?.name || "Unassigned"}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-500" />
                    {emp.createdAt 
                      ? new Date(emp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                      : "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all active:scale-90">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => {
                        setDeleteId(emp._id);
                        setDeleteName(emp.name);
                      }}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Account"
        message={`Are you sure you want to delete ${deleteName}? All access will be revoked immediately and this action cannot be undone.`}
      />
    </>
  );
}