"use client";

import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => Promise<void>; 
  title: string; 
  message: string;
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-red-500/20 p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Danger Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
            <AlertTriangle size={24} />
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {message}
          </p>
          
          <div className="pt-4 flex flex-col gap-3">
            <button 
              disabled={loading}
              onClick={handleConfirm}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Confirm Deletion"
              )}
            </button>
            <button 
              disabled={loading}
              onClick={onClose}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3.5 rounded-xl border border-white/5 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
