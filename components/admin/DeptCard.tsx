"use client";

import { LayoutGrid, Users, MoreVertical, ShieldCheck, ArrowRight, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteDepartment } from "@/lib/dept-actions";
import { toast } from "sonner";
import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function DeptCard({ dept }: { dept: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const res = await deleteDepartment(dept._id);
    if (res.success) {
      toast.success(`Department ${dept.name} deleted.`);
    } else {
      toast.error(res.error || "Failed to delete department.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={`bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all group relative overflow-hidden flex flex-col h-full shadow-lg hover:shadow-purple-500/5 ${isDeleting ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <LayoutGrid size={24} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-90"
            >
              <Trash2 size={18} />
            </button>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
            {dept.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {dept.description || "No description provided for this department unit."}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
              <Users size={14} />
            </div>
            <span className="text-sm font-semibold text-slate-300">
              {dept.memberCount || 0} <span className="text-slate-500 font-normal">{dept.memberCount === 1 ? 'Member' : 'Members'}</span>
            </span>
          </div>
          <button 
            onClick={() => router.push(`/admin/employees?deptId=${dept._id}`)}
            className="text-xs font-bold text-purple-400 uppercase tracking-widest hover:text-white flex items-center gap-1 transition-all group/btn"
          >
            View Staff
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-purple-600/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <DeleteConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Dissolve Department"
        message={`Are you sure you want to delete the ${dept.name} department? This will not delete the employees, but they will be unassigned.`}
      />
    </>
  );
}
