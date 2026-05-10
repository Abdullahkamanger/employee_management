"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import AddEditEmployeeModal from "./AddEditEmployeeModal";
import { useRouter, useSearchParams } from "next/navigation";
import ExportCSVButton from "./ExportCSVButton";

export default function EmployeeHeader({ employees }: { employees: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }
      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Employees</h2>
          <p className="text-slate-400">Manage and view all members of the organization.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <Plus size={18} /> Add New Employee
        </button>
      </div>

      {/* Search/Filter Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
          {["Active", "Pending"].map((status) => {
            const isActive = (searchParams.get("status") || "Active") === status;
            return (
              <button
                key={status}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("status", status);
                  router.push(`?${params.toString()}`);
                }}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" 
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {status} {status === "Pending" && employees.length > 0 && (searchParams.get("status") === "Pending") && (
                   <span className="ml-2 bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{employees.length}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
          </div>
          <ExportCSVButton data={employees} filename="employee_directory" />
        </div>
      </div>

      <AddEditEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
