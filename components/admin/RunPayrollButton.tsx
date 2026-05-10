"use client";

import { useState } from "react";
import { DollarSign, Loader2 } from "lucide-react";
import { generateMonthlyPayroll } from "@/lib/payroll-actions";
import { toast } from "sonner";

export default function RunPayrollButton() {
  const [loading, setLoading] = useState(false);

  const handleRunPayroll = async () => {
    const month = "May 2026"; // In a real app, this could be dynamic
    if (confirm(`Are you sure you want to run payroll for ${month}?`)) {
      setLoading(true);
      const res = await generateMonthlyPayroll(month);
      if (res.success) {
        toast.success(`Payroll generated for ${month}!`);
      } else {
        toast.error(res.error || "Failed to generate payroll.");
      }
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRunPayroll}
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <DollarSign size={18} />
      )}
      Run Payroll
    </button>
  );
}
