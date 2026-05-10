"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import CreateDeptModal from "./CreateDeptModal";

export default function DeptHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Departments</h2>
          <p className="text-slate-400">Organize your workforce into functional units.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <Plus size={18} /> Create Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Filter departments..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
        />
      </div>

      <CreateDeptModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
