"use client";

import { Download } from "lucide-react";

export default function ExportCSVButton({ 
  data, 
  filename 
}: { 
  data: any[], 
  filename: string 
}) {
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create rows
    const rows = data.map(obj => 
      headers.map(header => {
        let val = obj[header];
        // Handle nested objects (like department or employeeId)
        if (typeof val === 'object' && val !== null) {
          val = val.name || JSON.stringify(val);
        }
        // Escape quotes and commas
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",")
    );

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={exportToCSV}
      className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white transition-all active:scale-95 flex items-center gap-2 px-3"
      title="Export to CSV"
    >
      <Download size={18} />
      <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Export CSV</span>
    </button>
  );
}
