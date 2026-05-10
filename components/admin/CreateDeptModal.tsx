"use client";

import { useState } from "react";
import { X, LayoutGrid, Loader2, Info, Type } from "lucide-react";
import { createDepartment } from "@/lib/dept-actions";
import { toast } from "sonner";

export default function CreateDeptModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      const res = await createDepartment(name, description);
      if (res.success) {
        toast.success(`Department "${name}" established!`);
        onClose();
      } else {
        toast.error(res.error || "Failed to create department");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <LayoutGrid className="text-purple-400" /> Create New Department
            </h3>
            <p className="text-xs text-slate-500 mt-1">Define a new functional unit for your organization.</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Type size={12} /> Department Name
            </label>
            <input 
              name="name" 
              required 
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600" 
              placeholder="e.g. Engineering, Sales, Marketing..." 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Info size={12} /> Description
            </label>
            <textarea 
              name="description" 
              rows={3} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none placeholder:text-slate-600" 
              placeholder="What does this team focus on?" 
            />
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Establishing Unit...</span>
                </>
              ) : (
                <>
                  <LayoutGrid size={20} />
                  <span>Establish Department</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
