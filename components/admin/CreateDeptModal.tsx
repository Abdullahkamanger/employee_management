"use client";
import { getAllEmployees } from "@/lib/employee-actions";
import { useEffect, useState } from "react";
import { X, LayoutGrid, Loader2, Info, Type, UserCog, Palette } from "lucide-react";
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
  const [heads, setHeads] = useState([]);



  useEffect(() => {
    if (isOpen) {

      const fetchHeads = async () => {
        try {
          const res = await getAllEmployees({ role: { $in: ["Admin", "Manager"] } });
          if (res.success) {
            setHeads(res.data);
          } else {
            console.error("Error fetching department heads:", res.error);
          }
        } catch (error) {
          console.error("Error fetching department heads:", error);
        }
      };




      fetchHeads();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const deptData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      head: formData.get("head") as string,
      color: formData.get("color") as string,
    }

    try {
      const res = await createDepartment(deptData);
      if (res.success) {
        toast.success(`Department "${deptData.name}" established!`);
        onClose();
      } else {
        toast.error(res.error || "Failed to create department");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create Department"
      toast.error(`An unexpected error occurred: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-sm p-4 animate-in fade-in duration-300transition-all duration-300 
    ${isOpen ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95"}`}>
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-24 left-24 w-48 h-48 bg-purple-600/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <LayoutGrid className="text-purple-400" /> Create New Department
            </h3>
            <p className="text-xs text-slate-500 mt-1">Define a new functional unit for your organization.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-white/5 transition-all cursor-pointer hover:scale-110 hover:rotate-95 active:rotate-0"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Department Name */}
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
          {/* Description */}
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
          {/* Department Head */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <UserCog size={12} /> Head of Department
            </label>
            <select
              name="head"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-slate-600 cursor-pointer"
              required
            >

              <option value="" disabled selected className="text-slate-900">
                Select a manager
              </option>
              {heads.length > 0 ? (
                heads.map((head: { _id: string; name: string; email: string }) => (
                  <option key={head._id} value={head._id} className="text-black">
                    {head.name} ({head.email})
                  </option>
                ))
              ) : (
                <option value="">No managers available</option>
              )}
            </select>
          </div>


          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Palette size={12} /> Department Color
            </label>
            <input
              type="color"
              name="color"
              defaultValue="#8b5cf6"
              className="w-full h-10 rounded-xl border border-white/10 cursor-pointer background-none p-0"
            />
          </div>

          {/* Submit Button */}

          <div className="pt-4">
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
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
