"use client";

import { useState } from "react";
import { X, Lock, Loader2, ShieldCheck } from "lucide-react";
import { changePassword } from "@/lib/auth-actions";
import { toast } from "sonner";

export default function ChangePasswordModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }

    setLoading(true);
    const res = await changePassword({ currentPassword, newPassword });
    
    if (res.success) {
      toast.success("Password updated successfully!");
      onClose();
    } else {
      toast.error(res.error || "Failed to update password.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-purple-400" size={24} /> Update Security
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-all p-1 hover:bg-white/5 rounded-lg">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Password</label>
            <input 
              name="currentPassword" 
              type="password" 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all placeholder:text-slate-600" 
              placeholder="••••••••"
            />
          </div>

          <div className="h-px bg-white/5 my-2" />

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Password</label>
            <input 
              name="newPassword" 
              type="password" 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all placeholder:text-slate-600" 
              placeholder="Min. 8 characters"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirm New Password</label>
            <input 
              name="confirmPassword" 
              type="password" 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-all placeholder:text-slate-600" 
              placeholder="Repeat new password"
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 hover:bg-slate-200 disabled:bg-slate-500 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Lock size={18} />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
