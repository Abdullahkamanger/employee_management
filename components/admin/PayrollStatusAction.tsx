"use client";

import { useState } from "react";
import { updatePayrollStatus } from "@/lib/payroll-actions";
import { toast } from "sonner";
import { CheckCircle2, Clock, Loader2, ChevronDown } from "lucide-react";

export default function PayrollStatusAction({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusUpdate = async (newStatus: "Pending" | "Processing" | "Paid") => {
    if (newStatus === currentStatus) return;
    
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

  return (
    <div className="relative">
      <button 
        disabled={loading}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 border ${
          currentStatus === "Paid" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : 
          currentStatus === "Processing" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"
        }`}
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <>
            {currentStatus === "Paid" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
            {currentStatus}
            <ChevronDown size={10} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {(["Pending", "Processing", "Paid"] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {status}
            </button>
          ))}
        </div>
      )}
      
      {/* Backdrop for closing the dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
