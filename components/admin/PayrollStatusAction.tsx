"use client";

import { useState } from "react";
import { updatePayrollStatus } from "@/lib/payroll-actions";
import { toast } from "sonner";
import { CheckCircle2, Clock, Loader2, ChevronDown, RotateCcw } from "lucide-react";

export default function PayrollStatusAction({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusUpdate = async (newStatus: "Pending" | "Processing" | "Paid") => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }
    
    setLoading(true);
    setIsOpen(false);
    const res = await updatePayrollStatus(id, newStatus);
    if (res.success) {
      toast.success(`Payroll status updated to ${newStatus}`);
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setLoading(false);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
      case "Processing":
        return "bg-sky-500/20 text-sky-400 border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.1)]";
      default:
        return "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    }
  };

  return (
    <div className="relative">
      <button 
        disabled={loading}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border-2 ${getStatusStyles(currentStatus)}`}
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <>
            {currentStatus === "Paid" ? <CheckCircle2 size={14} strokeWidth={3} /> : 
             currentStatus === "Processing" ? <RotateCcw size={14} strokeWidth={3} className="animate-spin-slow" /> : 
             <Clock size={14} strokeWidth={3} />}
            <span>{currentStatus}</span>
            <ChevronDown size={12} strokeWidth={3} className={`ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-40 bg-[#121214] border-2 border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <p className="px-4 py-2 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">Update Status</p>
          {(["Pending", "Processing", "Paid"] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-between group ${
                currentStatus === status ? 'text-white bg-white/5' : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {status}
              {currentStatus === status && <CheckCircle2 size={10} className="text-emerald-400" />}
            </button>
          ))}
        </div>
      )}
      
      {/* Backdrop for closing the dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/5" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
